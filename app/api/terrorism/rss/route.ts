import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser()

const feedUrls = [
  'https://news.google.com/rss/search?q=attentat+OU+terrorisme&hl=fr&gl=FR&ceid=FR:fr',
  'http://feeds.feedburner.com/homelandsecuritynewswire/rss',
  'https://allafrica.com/tools/headlines/rdf/terrorism/headlines.rdf',
  'https://www.scmp.com/rss/91/feed',
  'https://intelligencebriefs.com/category/terrorism-war/feed',
  'https://www.caert.org.dz/feed',
  'https://intelnews.org/feed',
  'https://www.counterterrorism.police.uk/latest-news/feed/',
  'https://warsawinstitute.org/feed/',
  'https://www.globaldefensecorp.com/feed/',
]

export async function GET() {
  const allItems: any[] = []

  await Promise.all(feedUrls.map(async (url) => {
    try {
      const feed = await parser.parseURL(url)
      feed.items.forEach((item) => {
        allItems.push({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          source: { name: feed.title },
        })
      })
    } catch (e) {
      console.error(`Erreur chargement RSS ${url}`, e)
    }
  }))

  const sorted = allItems
    .filter(item => item.title && item.pubDate)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 30)

  return NextResponse.json(sorted)
}