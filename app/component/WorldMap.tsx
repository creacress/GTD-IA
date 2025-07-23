'// @ts-expect-error: Module \'d3-scale-chromatic\' has no type definitions'
'use client'

import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { scaleSequential } from 'd3-scale'
import { interpolateReds } from 'd3-scale-chromatic'
import worldGeo from '../../public/world-110m.json'
import { Tooltip } from 'react-tooltip'
import { useState } from 'react'

interface Article {
  country?: string
}

export default function WorldMap({ data }: { data: Article[] }) {
  const [tooltipContent, setTooltipContent] = useState('')

  const countByCountry = data.reduce((acc, item) => {
    if (!item.country) return acc
    acc[item.country] = (acc[item.country] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const maxCount = Math.max(1, ...Object.values(countByCountry))
  const colorScale = scaleSequential([1, maxCount], interpolateReds)

  return (
    <div className="mb-8 border border-zinc-700 rounded-lg overflow-hidden">
      <ComposableMap
        projectionConfig={{ scale: 150 }}
        width={800}
        height={400}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={worldGeo}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => {
              const countryName = geo.properties.name
              const count = countByCountry[countryName]
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={count ? (colorScale(count) as string) : '#1e1e1e'}
                  stroke="#555"
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#f87171', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                  data-tooltip-id="map-tooltip"
                  data-tooltip-content={`${countryName} — ${count || 0} attaque(s)`}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
      <Tooltip id="map-tooltip" />
    </div>
  )
}