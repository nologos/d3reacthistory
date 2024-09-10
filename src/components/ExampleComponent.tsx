// import React from 'react'
import { useState } from 'react'
import ToggleButton from './ToggleButton'

function ExampleComponent() {
  const [buttonState, setbuttonState] = useState(false)

  const handleToggle = () => {
    setbuttonState(!buttonState)
  }

  return (
    <div className="container mb-1">
      <div className="flex">
        <ToggleButton handleToggle={handleToggle} buttonState={buttonState} />
        <button className="flex-1 bg-primary-900 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
          React  Vite  Typescript
        </button>
      </div>
    </div>
  )
}

export default ExampleComponent
