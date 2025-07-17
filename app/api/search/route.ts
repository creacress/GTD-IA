import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

console.log("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
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

  if (year && year !== "-- Tous --") query = query.eq("iyear", Number(year));
  if (country && country !== "-- Tous --") query = query.eq("country_txt", country);
  if (attackType && attackType !== "-- Tous --") query = query.eq("attacktype1_txt", attackType);
  if (weaponType && weaponType !== "-- Tous --") query = query.eq("weaptype1_txt", weaponType);
  if (!isNaN(nkill)) query = query.gte("nkill", nkill);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
