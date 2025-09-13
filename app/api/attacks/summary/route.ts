// app/api/attacks/summary/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // total, victimes
    const { data, error } = await supabase
      .from("attacks")
      .select("iyear, nkill, country_txt, gname");
    if (error) throw error;

    const total = data.length;
    const deaths = data.reduce((s, d) => s + (Number(d.nkill) || 0), 0);
    const countries = new Set(data.map(d => d.country_txt).filter(Boolean)).size;
    const groups = new Set(data.map(d => d.gname).filter(Boolean)).size;

    const perYear: Record<number, number> = {};
    for (const d of data) {
      const y = Number(d.iyear);
      if (!Number.isNaN(y)) perYear[y] = (perYear[y] || 0) + 1;
    }

    return NextResponse.json({ total, deaths, countries, groups, perYear });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}