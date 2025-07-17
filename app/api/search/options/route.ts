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
  const countries = ["-- Tous --", ...Array.from(new Set(
    (countryData || [])
      .map((r: { country_txt: string }) => r.country_txt)
      .filter((c: string): c is string => typeof c === "string" && c.trim().length > 0)
  )).sort((a: string, b: string) => a.localeCompare(b))];

  const { data: attackTypeData } = await supabase
    .from("attacks")
    .select("attacktype1_txt")
    .order("attacktype1_txt", { ascending: true });
  const attackTypes = ["-- Tous --", ...Array.from(new Set(
    (attackTypeData || [])
      .map((r: { attacktype1_txt: string }) => r.attacktype1_txt)
      .filter((t: string): t is string => typeof t === "string" && t.trim().length > 0)
  )).sort((a: string, b: string) => a.localeCompare(b))];

  const { data: weaponTypeData } = await supabase
    .from("attacks")
    .select("weaptype1_txt")
    .order("weaptype1_txt", { ascending: true });
  const weaponTypes = ["-- Tous --", ...Array.from(new Set(
    (weaponTypeData || [])
      .map((r: { weaptype1_txt: string }) => r.weaptype1_txt)
      .filter((w: string): w is string => typeof w === "string" && w.trim().length > 0)
  )).sort((a: string, b: string) => a.localeCompare(b))];

  const { data: yearData } = await supabase.rpc("distinct_years");
  const years = ["-- Tous --", ...(
    (yearData || [])
      .map((r: { iyear: number }) => r.iyear)
      .filter((y: number): y is number => typeof y === "number" && !isNaN(y))
      .sort((a: number, b: number) => a - b)
  )];

  return NextResponse.json({
    countries,
    attackTypes,
    weaponTypes,
    years,
  });
}