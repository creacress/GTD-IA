import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";

// Assure-toi que le fichier gtd.db est accessible à la racine du projet ou adapte le chemin
const db = new Database("gtd.db", { readonly: true });

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

  let sql = `
    SELECT eventid, iyear, country_txt, attacktype1_txt, weaptype1_txt, nkill, gname
    FROM attacks
    WHERE 1=1
  `;

  const params: any = {};
  if (year) {
    sql += " AND iyear = @year";
    params.year = Number(year);
  }
  if (country) {
    sql += " AND country_txt = @country";
    params.country = country;
  }
  if (attackType) {
    sql += " AND attacktype1_txt = @attackType";
    params.attackType = attackType;
  }
  if (weaponType) {
    sql += " AND weaptype1_txt = @weaponType";
    params.weaponType = weaponType;
  }
  if (!isNaN(nkill)) {
    sql += " AND nkill >= @nkill";
    params.nkill = nkill;
  }

  sql += " LIMIT @limit OFFSET @offset";
  params.limit = limit;
  params.offset = offset;

  const rows = db.prepare(sql).all(params);
  return NextResponse.json(rows);
}
