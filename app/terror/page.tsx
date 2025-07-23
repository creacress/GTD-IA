import { metadata } from './metadata'
"use client";

import { useEffect, useState } from 'react'
import WorldMap from '../component/WorldMap'
let countries: any = {}
try {
  countries = require('i18n-iso-countries')
  countries.registerLocale(require('i18n-iso-countries/langs/fr.json'))
} catch (e) {
  console.warn("⚠️ i18n-iso-countries non disponible, les pays ne seront pas détectés.")
}

function detectCountry(title: string): string | undefined {
  const lower = title.toLowerCase()
  // Typage correct : getNames retourne Record<string, string>
  const raw = countries.getNames('fr', { select: 'official' }) as Record<string, string>
  const countryList: string[] = Object.values(raw)
  const found = countryList.find((name: string) => lower.includes(name.toLowerCase()))
  return found || undefined
}

type Article = {
  title: string
  link?: string
  url?: string
  pubDate?: string
  publishedAt?: string
  source?: { name?: string }
  translatedTitle?: string
  country?: string
}

function formatRelativeDate(dateString?: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60) return `il y a ${diff} sec`
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`
  return date.toLocaleDateString('fr-FR')
}

export default function TerrorPage() {
  const [data, setData] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [gdelt, rss] = await Promise.all([
        fetch('/api/terrorism/gdelt').then(res => res.json()),
        fetch('/api/terrorism/rss').then(res => res.json()),
      ])

      const allData: Article[] = [...gdelt, ...rss].slice(0, 30)
      setData(allData) // immédiatement

      const enriched = allData.map(item => ({
        ...item,
        country: detectCountry(item.title)
      }))
      setData(enriched as Article[])

      // Traduction progressive
      enriched.forEach((item, index) => {
        setTimeout(async () => {
          try {
            const res = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                q: item.title,
                source: 'auto',
                target: 'fr',
                format: 'text',
              }),
            })
            const result = await res.json()
            if (!result.error) {
              setData(prev =>
                prev.map(art =>
                  art.title === item.title ? { ...art, translatedTitle: result.translatedText } : art
                )
              )
            }
          } catch (e) {
            console.error('Erreur progressive pour :', item.title)
          }
        }, index * 300) // 300ms entre chaque
      })

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Chargement des données...</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 animate-pulse rounded-xl h-40 shadow-md" />
        ))}
      </div>
    </div>
  )

  // Regroupement par source
  const gdeltData = data.filter(item => item.source?.name?.toLowerCase().includes('gdelt'))
  const rssData = data.filter(item => !item.source?.name || item.source.name.toLowerCase().includes('google'))
  const autres = data.filter(item => !gdeltData.includes(item) && !rssData.includes(item))

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-zinc-800 text-white p-8 space-y-16">
      <h1 className="text-5xl font-extrabold tracking-tight text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">🛰️ Veille Terrorisme</h1>
      <WorldMap data={data} />
      {!data.some(item => item.country) && (
        <p className="text-center text-sm text-zinc-400">
          ⚠️ Aucun pays détecté pour les données affichées. La carte peut ne pas être complète.
        </p>
      )}

      {[
        { label: '🧠 GDELT', items: gdeltData },
        { label: '📰 Google RSS', items: rssData },
        { label: '🌐 Autres Sources', items: autres }
      ].map(({ label, items }) => (
        <div key={label} className="space-y-10">
          <h2 className="text-3xl font-bold text-blue-300 border-b border-zinc-700 pb-2">{label}</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <div
                key={i}
                className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 shadow-2xl hover:scale-[1.03] hover:shadow-blue-500/20 transition-transform duration-300"
              >
                <a
                  href={item.url || item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-200 text-lg font-semibold leading-snug line-clamp-2"
                >
                  {item.translatedTitle ? item.translatedTitle : (
                    <span>⚠️ {item.title}</span>
                  )}
                </a>
                <p className="text-sm text-zinc-500 mt-2">{formatRelativeDate(item.pubDate || item.publishedAt)}</p>
                {item.source?.name && (
                  <p className="text-xs text-zinc-400 mt-1">Source : {item.source.name}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}