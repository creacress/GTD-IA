'use client'

import { useEffect, useState } from 'react'

type Article = {
  title: string
  link?: string
  url?: string
  pubDate?: string
  publishedAt?: string
  source?: { name?: string }
  translatedTitle?: string
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

      const translated = await Promise.all(
        allData.map(async (item) => {
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
            if (result.error) throw new Error(result.detail || 'Erreur de traduction')
            return { ...item, translatedTitle: result.translatedText }
          } catch (e) {
            console.error('Erreur traduction pour :', item.title, e)
            return { ...item, translatedTitle: null }
          }
        })
      )

      translated.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.pubDate || '').getTime()
        const dateB = new Date(b.publishedAt || b.pubDate || '').getTime()
        return dateB - dateA
      })

      setData(translated)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <p className="p-4">Chargement...</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white p-6 space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">🛰️ Veille Terrorisme</h1>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item, i) => (
          <div
            key={i}
            className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-xl hover:shadow-zinc-700 transition duration-200"
          >
            <a
              href={item.url || item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-400 hover:text-blue-300 text-lg font-semibold leading-snug"
            >
              {item.translatedTitle ? item.translatedTitle : (
                <span>⚠️ {item.title}</span>
              )}
            </a>
            <p className="text-sm text-zinc-500 mt-2">{item.pubDate || item.publishedAt}</p>
            {item.source?.name && (
              <p className="text-xs text-zinc-400 mt-1">Source : {item.source.name}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}