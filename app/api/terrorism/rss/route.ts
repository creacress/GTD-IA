import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser()

export async function GET() {
  try {
    const feed = await parser.parseURL('https://news.google.com/rss/search?q=attentat+OU+terrorisme&hl=fr&gl=FR&ceid=FR:fr')
    return NextResponse.json(feed.items)
  } catch {
    return NextResponse.json({ error: 'Erreur RSS' }, { status: 500 })
  }
}