import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET() {
  try {
    const key = process.env.NEWSAPI_KEY
    const url = `https://newsapi.org/v2/everything?q=terrorist OR attack OR bombing&language=fr&sortBy=publishedAt&apiKey=${key}`
    const { data } = await axios.get(url)
    return NextResponse.json(data.articles || [])
  } catch {
    return NextResponse.json({ error: 'Erreur NewsAPI' }, { status: 500 })
  }
}