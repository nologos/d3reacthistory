// import React from 'react'
import ExampleComponent from './components/ExampleComponent.tsx'
// import HeatmapComponent from './components/HeatmapComponent.js'
import D3heatmap from './components/D3Heatmap.tsx'
import CSVGenerator from './components/D3HeatmapCSVGenerator/CSVGenerator.tsx'

function App() {
  return (
    <div className="container">
      <ExampleComponent />
      <CSVGenerator />
      <D3heatmap />
    </div>
  )
}

export default App
