import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year");
  const country = searchParams.get("country");
  const attackType = searchParams.get("attackType");
  const weaponType = searchParams.get("weaponType");
  const nkill = parseInt(searchParams.get("nkill") || "0", 10);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "100", 10);
  const offset = (page - 1) * limit;

  let query = supabase
    .from("attacks")
    .select("eventid, iyear, country_txt, attacktype1_txt, weaptype1_txt, nkill, gname")
    .range(offset, offset + limit - 1);

  if (year) query = query.eq("iyear", Number(year));
  if (country) query = query.eq("country_txt", country);
  if (attackType) query = query.eq("attacktype1_txt", attackType);
  if (weaponType) query = query.eq("weaptype1_txt", weaponType);
  if (!isNaN(nkill)) query = query.gte("nkill", nkill);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
