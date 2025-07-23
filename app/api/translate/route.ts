import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { q, source = 'auto', target = 'fr' } = body

  const res = await fetch(`https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(q)}`)

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: 'Erreur API externe', detail: text }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json({ translatedText: data.translation })
}