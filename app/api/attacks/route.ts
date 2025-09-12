import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Utilitaires
function parseIntSafe(v: string | null, def = 0) {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : def;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // --- Fetch by ID ---
    if (id) {
      const { data, error } = await supabase
        .from("attacks")
        .select("*")
        .eq("eventid", id)
        .maybeSingle();

      if (error) throw error;
      return NextResponse.json(data || {});
    }

    // --- Filters ---
    const year = searchParams.get("year");
    const country = searchParams.get("country");
    const group = searchParams.get("group");
    const victims = parseIntSafe(searchParams.get("victims"), 0);
    const bbox = searchParams.get("bbox");

    // --- Pagination (sécurisée) ---
    const DEFAULT_LIMIT = 5000;
    const MAX_LIMIT = 20000; // garde-fou serveur
    const page = clamp(parseIntSafe(searchParams.get("page"), 1), 1, 10_000_000);
    const limit = clamp(parseIntSafe(searchParams.get("limit"), DEFAULT_LIMIT), 1, MAX_LIMIT);
    const offset = (page - 1) * limit;

    // --- Base query (réutilisable) ---
    const applyFilters = (sel: ReturnType<typeof supabase.from> extends infer R ? any : never) => {
      let q = supabase
        .from("attacks")
        .select(sel, { count: "exact" })
        .gte("nkill", victims);

      if (year) q = q.eq("iyear", parseIntSafe(year));
      if (country) q = q.eq("country_txt", country);
      if (group) q = q.eq("gname", group);

      if (bbox) {
        const parts = bbox.split(",").map((x) => Number(x.trim()));
        if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
          const [minLon, minLat, maxLon, maxLat] = parts;
          q = q
            .gte("latitude", minLat)
            .lte("latitude", maxLat)
            .gte("longitude", minLon)
            .lte("longitude", maxLon);
        }
      }
      return q;
    };

    // 1) Récupérer uniquement le total sans data (HEAD)
    const head = await applyFilters("*").select("*").limit(1).single();
    const total = head.count ?? 0;

    // Si l'offset est au-delà du total → renvoyer liste vide (au lieu d'erreur PostgREST)
    if (offset >= total) {
      const res = NextResponse.json([]);
      res.headers.set("x-total-count", String(total));
      return res;
    }

    // 2) Fenêtre sécurisée [offset, end]
    const end = Math.min(offset + limit - 1, Math.max(total - 1, 0));

    // 3) Data page
    const { data, error, count } = await applyFilters(
      "eventid, latitude, longitude, iyear, country_txt, gname, nkill"
    ).range(offset, end);

    if (error) throw error;

    const res = NextResponse.json(data ?? []);
    res.headers.set("x-total-count", String(count ?? total));
    res.headers.set("cache-control", "public, max-age=60, s-maxage=300");
    return res;
  } catch (err: any) {
    // Log concis côté serveur
    console.error("API /api/attacks ERROR:", err?.code || err?.name || "", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Erreur inconnue" },
      { status: 500 }
    );
  }
}
