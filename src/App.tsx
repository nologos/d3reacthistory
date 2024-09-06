// import React from 'react'
import ExampleComponent from './components/ExampleComponent.tsx'
// import HeatmapComponent from './components/HeatmapComponent.js'
import D3heatmap from './components/D3Heatmap.tsx'

function App() {
  // const data = [
  //   { date: '2024-11-01', value: 3, column2: 3 },
  //   { date: '2024-12-02', value: 6, column2: 3 },
  // ]

  return (
    <div className="container">
      <ExampleComponent />
      <D3heatmap />
    </div>
  )
}

export default App
