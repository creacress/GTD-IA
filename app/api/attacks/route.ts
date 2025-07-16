import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";

const db = new Database("gtd.db", { readonly: true });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const row = db.prepare("SELECT * FROM attacks WHERE eventid = ?").get(id);
    return NextResponse.json(row || {});
  }
  const year = searchParams.get("year");
  const country = searchParams.get("country");
  const group = searchParams.get("group");
  const victims = parseInt(searchParams.get("victims") || "0", 10);
  const bbox = searchParams.get("bbox");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "500", 10);
  const offset = (page - 1) * limit;

  let sql = `
    SELECT eventid, latitude, longitude, iyear, country_txt, gname, nkill
    FROM attacks
    WHERE nkill >= @victims
  `;
  const params: any = { victims };

  if (year)    { sql += " AND iyear = @year"; params.year = Number(year); }
  if (country) { sql += " AND country_txt = @country"; params.country = country; }
  if (group)   { sql += " AND gname = @group"; params.group = group; }

  if (bbox) {
    const [minLon, minLat, maxLon, maxLat] = bbox.split(",").map(Number);
    sql += " AND latitude BETWEEN @minLat AND @maxLat AND longitude BETWEEN @minLon AND @maxLon";
    Object.assign(params, { minLat, maxLat, minLon, maxLon });
  }

  sql += " LIMIT @limit OFFSET @offset";
  Object.assign(params, { limit, offset });
  const rows = db.prepare(sql).all(params);
  const countStmt = db.prepare(`SELECT COUNT(*) as total FROM attacks WHERE nkill >= @victims` + 
    (year ? " AND iyear = @year" : "") +
    (country ? " AND country_txt = @country" : "") +
    (group ? " AND gname = @group" : "") +
    (bbox ? " AND latitude BETWEEN @minLat AND @maxLat AND longitude BETWEEN @minLon AND @maxLon" : "")
  );
  const result = countStmt.get(params) as { total: number };
  const total = result.total;
  const res = NextResponse.json(rows);
  res.headers.set("x-total-count", total.toString());
  return res;
}
