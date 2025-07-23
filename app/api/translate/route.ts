import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const res = await fetch('https://de.libretranslate.com/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const contentType = res.headers.get('content-type') || ''
  if (!res.ok || !contentType.includes('application/json')) {
    const text = await res.text()
    return NextResponse.json({ error: 'Erreur API externe', detail: text }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json(data)
}