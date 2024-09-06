import { useEffect, useState } from 'react'
import * as d3 from 'd3'

const LoadComponent: React.FC<any> = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  function bar(
    hookcomponent = '.heatmap',
    csvpath = '/src/components/dji.csv',
  ) {
    const width = 960
    const height = 136
    const cellSize = 17

    const percent = d3.format('.1%')
    const format = d3.timeFormat('%Y-%m-%d')

    const color = d3.scaleQuantize()
      .domain([-0.05, 0.05])
      .range(d3.range(11).map((d) => { return `q${d}-11` }))

    const svg = d3.select(hookcomponent).selectAll('svg')
      .data(d3.range(2009, 2010))
      .enter().append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'RdYlGn')
      .append('g')
      .attr('transform', `translate(${(width - cellSize * 53) / 2},${height - cellSize * 7 - 1})`)

    svg.append('text')
      .attr('transform', `translate(-6,${cellSize * 3.5})rotate(-90)`)
      .style('text-anchor', 'middle')
      .text((d) => { return d })

    const rect = svg.selectAll('.day')
      .data((d) => { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)) })
      .enter().append('rect')
      .attr('class', 'day')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('x', (d) => { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize })
      .attr('y', (d) => { return d.getDay() * cellSize })
      .datum(format)

    rect.append('title')
      .text((d) => { return d })

    svg.selectAll('.month')
      .data((d) => { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)) })
      .enter().append('path')
      .attr('class', 'month')
      .attr('d', monthPath)

    d3.csv(csvpath).then((poooop: any) => {
      const data = d3.rollup(
        poooop,
        v => (v[0].Close - v[0].Open) / v[0].Open,
        d => d.Date,
      )

      rect
        .filter((d) => {
          return data.has(d)
        })
        .attr('class', (d) => {
          return `day ${color(data.get(d))}`
        })
        .select('title')
        .text((d) => {
          return `${d}: ${percent(data.get(d))}`
        })
    }).catch((error: any) => {
      console.error('Error loading the CSV file:', error)
    })

    function monthPath(t0) {
      const t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0)
      const d0 = t0.getDay()
      const w0 = d3.timeWeek.count(d3.timeYear(t0), t0)
      const d1 = t1.getDay()
      const w1 = d3.timeWeek.count(d3.timeYear(t1), t1)
      return `M${(w0 + 1) * cellSize},${d0 * cellSize
      }H${w0 * cellSize}V${7 * cellSize
      }H${w1 * cellSize}V${(d1 + 1) * cellSize
      }H${(w1 + 1) * cellSize}V${0
      }H${(w0 + 1) * cellSize}Z`
    }
  }

  useEffect(() => {
    if (!loading && !error) {
      bar()
    }
  }, [loading, error])

  useEffect(() => {
    (async () => {
      try {
        const data = [1]
        if (!data || Object.keys(data).length === 0) {
          throw new Error('Network response was not ok')
        }
      }
      catch (error: any) {
        setError(error.message)
      }
      finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return (
      <p>
        Error:
        {error}
      </p>
    )
  }

  if (!loading) {
    return (
      <div className="heatmap"></div>
    )
  }

  return null
}

export default LoadComponent
