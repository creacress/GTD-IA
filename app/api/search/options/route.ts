import { NextResponse } from "next/server";
import Database from "better-sqlite3";


const db = new Database("app/api/attacks/data/gtd.db", { readonly: true });

export async function GET() {
  const countries = db.prepare("SELECT DISTINCT country_txt FROM attacks ORDER BY country_txt ASC").all().map((r: any) => r.country_txt);
  const attackTypes = db.prepare("SELECT DISTINCT attacktype1_txt FROM attacks ORDER BY attacktype1_txt ASC").all().map((r: any) => r.attacktype1_txt);
  const weaponTypes = db.prepare("SELECT DISTINCT weaptype1_txt FROM attacks ORDER BY weaptype1_txt ASC").all().map((r: any) => r.weaptype1_txt);
  const years = db.prepare("SELECT DISTINCT iyear FROM attacks ORDER BY iyear ASC").all().map((r: any) => r.iyear);

  return NextResponse.json({
    countries,
    attackTypes,
    weaponTypes,
    years,
  });
}