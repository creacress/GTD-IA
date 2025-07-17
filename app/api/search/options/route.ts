import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data: countryData } = await supabase
    .from("attacks")
    .select("country_txt")
    .order("country_txt", { ascending: true });
  const countries = [...new Set(countryData?.map((r) => r.country_txt).filter(Boolean))];

  const { data: attackTypeData } = await supabase
    .from("attacks")
    .select("attacktype1_txt")
    .order("attacktype1_txt", { ascending: true });
  const attackTypes = [...new Set(attackTypeData?.map((r) => r.attacktype1_txt).filter(Boolean))];

  const { data: weaponTypeData } = await supabase
    .from("attacks")
    .select("weaptype1_txt")
    .order("weaptype1_txt", { ascending: true });
  const weaponTypes = [...new Set(weaponTypeData?.map((r) => r.weaptype1_txt).filter(Boolean))];

  const { data: yearData } = await supabase
    .from("attacks")
    .select("iyear")
    .order("iyear", { ascending: true });
  const years = [...new Set(yearData?.map((r) => r.iyear).filter(Boolean))];

  return NextResponse.json({
    countries,
    attackTypes,
    weaponTypes,
    years,
  });
}