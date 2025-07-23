import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET() {
  try {
    const url = 'https://api.gdeltproject.org/api/v2/doc/doc?query=terrorism&mode=artlist&format=json'
    const { data } = await axios.get(url)
    return NextResponse.json(data.articles || [])
  } catch {
    return NextResponse.json({ error: 'Erreur GDELT' }, { status: 500 })
  }
}