import { useEffect, useState } from 'react'
import * as d3 from 'd3'

const LoadComponent: React.FC<any> = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  function bar(
    hookcomponent = '.heatmap', // The CSS selector for the component to which the SVG will be attached.
    csvpath = '/src/components/dji.csv', // The path to the CSV file containing the data.
  ) {
    // Set dimensions and size for the calendar heatmap
    const width = 960
    const height = 136
    const cellSize = 17

    // Format functions for percentages and dates
    const percent = d3.format('.1%')
    const format = d3.timeFormat('%Y-%m-%d')

    // Set color scale mapping domain values to a range of classes (quantized)
    const color = d3.scaleQuantize()
      .domain([-0.05, 0.05]) // Domain of the data (percentage change)
      .range(d3.range(11).map((d) => { return `q${d}-11` })) // Classes for coloring

    // Create an SVG element for each year in the range and append to the selected component
    const svg = d3.select(hookcomponent).selectAll('svg')
      .data(d3.range(2009, 2010)) // The range of years (only 2009 in this case)
      .enter().append('svg') // Append an SVG for each year
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'RdYlGn') // Color scheme class
      .append('g')
      .attr('transform', `translate(${(width - cellSize * 53) / 2},${height - cellSize * 7 - 1})`) // Position the group element

    // Append a text element for the year, rotated 90 degrees
    svg.append('text')
      .attr('transform', `translate(-6,${cellSize * 3.5})rotate(-90)`)
      .style('text-anchor', 'middle')
      .text((d) => { return d }) // Display the year

    // Create a rectangle for each day of the year
    const rect = svg.selectAll('.day')
      .data((d) => { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)) }) // Create an array of all days in the year
      .enter().append('rect') // Append a rectangle for each day
      .attr('class', 'day')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('x', (d) => { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize }) // Position based on the week number
      .attr('y', (d) => { return d.getDay() * cellSize }) // Position based on the day of the week
      .datum(format) // Attach the formatted date to each rectangle

    // Add a tooltip (title) to each rectangle to show the date
    rect.append('title')
      .text((d) => { return d })

    // Draw the outline of each month
    svg.selectAll('.month')
      .data((d) => { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)) }) // Create an array of months
      .enter().append('path')
      .attr('class', 'month')
      .attr('d', monthPath) // Use a custom function to define the path of each month

    // Load the CSV data and process it
    d3.csv(csvpath).then((poooop: any) => {
      const data = d3.rollup(
        poooop,
        v => (v[0].Close - v[0].Open) / v[0].Open, // Calculate the percentage change for each day
        d => d.Date, // Group by date
      )

      // Apply the color scale to the rectangles based on the data
      rect
        .filter((d) => {
          return data.has(d) // Filter out days without data
        })
        .attr('class', (d) => {
          return `day ${color(data.get(d))}` // Apply the appropriate color class
        })
        .select('title')
        .text((d) => {
          return `${d}: ${percent(data.get(d))}` // Update the tooltip to show the date and percentage change
        })
    }).catch((error: any) => {
      console.error('Error loading the CSV file:', error) // Log any errors that occur during CSV loading
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
    return (
      <div className="heatmap"></div>
    )
  }

  return null
}

export default LoadComponent
