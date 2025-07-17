import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

console.log("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data: yearRows, error: yearError } = await supabase
    .from("attacks")
    .select("iyear");
  console.log("Résultat iyear:", yearRows);

  const { data: countryRows, error: countryError } = await supabase
    .from("attacks")
    .select("country_txt");
  console.log("Résultat country_txt:", countryRows);

  const { data: groupRows, error: groupError } = await supabase
    .from("attacks")
    .select("gname");
  console.log("Résultat gname:", groupRows);

  if (yearError) console.error("Year fetch error:", yearError.message);
  if (countryError) console.error("Country fetch error:", countryError.message);
  if (groupError) console.error("Group fetch error:", groupError.message);

  if (yearError || countryError || groupError) {
    return NextResponse.json({ error: "Failed to fetch filters" }, { status: 500 });
  }

  const yearsData = Array.from(new Set((yearRows || []).map(r => r.iyear))).sort((a, b) => b - a);
  const countriesData = Array.from(new Set((countryRows || []).map(r => r.country_txt))).sort();
  const groupsData = Array.from(new Set((groupRows || []).map(r => r.gname))).sort();

  console.log("Filtres formatés:", {
    years: yearsData,
    countries: countriesData,
    groups: groupsData
  });

  return NextResponse.json({
    years: yearsData,
    countries: countriesData,
    groups: groupsData
  });
}