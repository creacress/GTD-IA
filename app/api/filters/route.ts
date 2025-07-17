import path from "path";
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET() {
  const { data: yearRows, error: yearError } = await supabase
    .from("attacks")
    .select("iyear");

  const { data: countryRows, error: countryError } = await supabase
    .from("attacks")
    .select("country_txt");

  const { data: groupRows, error: groupError } = await supabase
    .from("attacks")
    .select("gname");

  if (yearError || countryError || groupError) {
    return NextResponse.json({ error: "Failed to fetch filters" }, { status: 500 });
  }

  const yearsData = Array.from(new Set((yearRows || []).map(r => r.iyear))).sort((a, b) => b - a);
  const countriesData = Array.from(new Set((countryRows || []).map(r => r.country_txt))).sort();
  const groupsData = Array.from(new Set((groupRows || []).map(r => r.gname))).sort();

  return NextResponse.json({
    years: yearsData,
    countries: countriesData,
    groups: groupsData
  });
}