import CalHeatmap from 'cal-heatmap'
import 'cal-heatmap/cal-heatmap.css'

function HeatmapComponent() {
  const cal = new CalHeatmap()
  cal.paint({ theme: 'dark' })

  return <div id="cal-heatmap"></div>
}

export default HeatmapComponent
