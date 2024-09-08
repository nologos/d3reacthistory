import { useEffect, useState } from 'react'
import * as d3 from 'd3'

interface LoadComponentProps {
  hookComponent?: string
  csvPath?: string
  startYear?: number
  endYear?: number
}

const defaultProps: LoadComponentProps = {
  hookComponent: '.heatmap',
  csvPath: '/src/components/dji.csv',
  startYear: 2019,
  endYear: 2025,
}

const LoadComponent: React.FC<any> = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  function renderTooltip(csvdata: any, date: any) {
    try {
      const objectByDate = csvdata.find(item => item.Date === date)
      return objectByDate.Data
    }
    catch (e) {
      return undefined
    }
  }

  function bar(
    hookComponent = defaultProps.hookComponent,
    csvPath = defaultProps.csvPath,
    startYear = defaultProps.startYear,
    endYear = defaultProps.endYear,
  ) {
    // Set dimensions and size for the calendar heatmap
    const width = 960
    const height = 136
    const cellSize = 17

    // Format functions for percentages and dates
    const percent = d3.format('.1%')
    const format = d3.timeFormat('%Y-%m-%d')

    // Load the CSV data and process it
    d3.csv(csvPath).then((poooop: any) => {
      const data = d3.rollup(
        poooop,
        v => (v[0].color || 'green'),
        d => d.Date,
      )

      // Create an SVG element for each year in the range and append to the selected component
      const svg = d3.select(hookComponent).selectAll('svg')
        .data(d3.range(startYear, endYear))
        .enter().append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'RdYlGn')
        .append('g')
        .attr('transform', `translate(${(width - cellSize * 53) / 2},${height - cellSize * 7 - 1})`)

      // Append a text element for the year, rotated 90 degrees
      svg.append('text')
        .attr('transform', `translate(-6,${cellSize * 3.5})rotate(-90)`)
        .style('text-anchor', 'middle')
        .text((d) => { return d }) // Display the year

      // Initialize Tooltip
      const tooltip = d3.select(hookComponent)
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('pointer-events', 'none')
        .style('position', 'absolute')
        .style('z-index', 9999)
        .style('width', '250px')
        .style('max-width', '250px')
        .style('overflow', 'hidden')
        .style('padding', '15px')
        .style('font-size', '12px')
        .style('line-height', '14px')
        .style('color', 'rgb(00, 00, 00)')
        .style('background', 'rgba(255, 255, 255, 0.95)')

      // Add month labels at the top of each column
      svg.selectAll('.month')
        .data(d => d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
        .enter().append('text')
        .attr('class', 'month-label')
        .attr('x', d => (d3.timeWeek.count(d3.timeYear(d), d) * cellSize + cellSize / 2) + 40)
        .attr('y', -5) // Position above the calendar
        .style('text-anchor', 'middle')
        .text(d => d3.timeFormat('%b')(d)) // Display the abbreviated month name

      // Create a rectangle for each day of the year
      const rect = svg.selectAll('.day')
        .data(d => d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
        .enter().append('rect')
        .attr('class', 'day')
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('x', d => d3.timeWeek.count(d3.timeYear(d), d) * cellSize)
        .attr('y', d => d.getDay() * cellSize)
        .datum(format)

      // Add a tooltip (title) to each rectangle to show the date
      rect.append('title')
        .text(d => d)

      // Handle mouse events for tooltips
      rect.on('mouseover', (event: any, d) => {
        if (!d)
          return
        d3.select(event.currentTarget)
          .style('stroke', 'black')
          .style('stroke-width', 3)
        // const dataPoint = `${d}: ${percent(data.get(d))}`
        const dataPoint = `${d}: ${renderTooltip(poooop, d)}`
        tooltip.html(dataPoint)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`)
          .transition()
          .duration(200)
          .style('opacity', 1)
      })
        .on('mouseout', (event) => {
          d3.select(event.currentTarget)
            .style('stroke', '#ccc')
            .style('stroke-width', 1)

          tooltip.transition()
            .duration(500)
            .style('opacity', 0)
        })

      // Draw the outline of each month
      svg.selectAll('.month')
        .data((d) => { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)) }) // Create an array of months
        .enter().append('path')
        .attr('class', 'month')
        .attr('d', monthPath) // Use a custom function to define the path of each month

      // // Set color scale mapping domain values to a range of classes (quantized)
      // const color = d3.scaleQuantize()
      // .domain([-0.05, 0.05])
      // .range(d3.range(20).map(d => `q${d}-11`))

      //   // Apply the color scale to the rectangles based on the data
      //     rect.filter(d => data.has(d))
      //       .attr('class', d => `day ${color(data.get(d))}`)
      //       .select('title')
      //       .text(d => `${d}: ${percent(data.get(d))}`)
      //   }).catch((error: any) => {
      //     console.error('Error loading the CSV file:', error)
      //   })

      // Apply the static color from the CSV data to the rectangles
      // rect is a day object array
      rect.filter(d => data.has(d))
        .attr('class', 'day-colored') // Keep the class 'day' as a base class for all rect elements
        .attr('fill', (d) => {
          const recuctionColor = data.get(d)
          return recuctionColor
        })
        .select('title')
    }).catch((error: any) => {
      console.error('Error loading the CSV file:', error)
    })

    // Function to create the SVG path for each month's outline
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
    return <div className="heatmap"></div>
  }

  return null
}

export default LoadComponent
