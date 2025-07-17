import { NextResponse } from "next/server";
import Database from "better-sqlite3";

const db = new Database("app/api/attacks/data/gtd.db", { readonly: true });

export async function GET() {
  const years = (db.prepare("SELECT DISTINCT iyear FROM attacks ORDER BY iyear DESC").all() as { iyear: number }[]).map(r => r.iyear);
  const countries = (db.prepare("SELECT DISTINCT country_txt FROM attacks ORDER BY country_txt").all() as { country_txt: string }[]).map(r => r.country_txt);
  const groups = (db.prepare("SELECT DISTINCT gname FROM attacks ORDER BY gname").all() as { gname: string }[]).map(r => r.gname);

  return NextResponse.json({ years, countries, groups });
}