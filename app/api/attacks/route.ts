import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  if (id) {
    const { data, error } = await supabase
      .from("attaques")
      .select("*")
      .eq("eventid", id)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || {});
  }

  const year = searchParams.get("year");
  const country = searchParams.get("country");
  const group = searchParams.get("group");
  const victims = parseInt(searchParams.get("victims") || "0", 10);
  const bbox = searchParams.get("bbox");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "500", 10);
  const offset = (page - 1) * limit;

  let query = supabase
    .from("attaques")
    .select("eventid, latitude, longitude, iyear, country_txt, gname, nkill", { count: "exact" })
    .gte("nkill", victims);

  if (year) query = query.eq("iyear", parseInt(year));
  if (country) query = query.eq("country_txt", country);
  if (group) query = query.eq("gname", group);

  if (bbox) {
    const [minLon, minLat, maxLon, maxLat] = bbox.split(",").map(Number);
    query = query
      .gte("latitude", minLat).lte("latitude", maxLat)
      .gte("longitude", minLon).lte("longitude", maxLon);
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const res = NextResponse.json(data);
  res.headers.set("x-total-count", count?.toString() || "0");
  return res;
}
