import React, { useState } from 'react'
import ToggleButton from './ToggleButton'

function ExampleComponent() {
  const [buttonState, setbuttonState] = useState(false)

  const handleToggle = () => {
    setbuttonState(!buttonState)
  }

  return (
    <div className="container">
      <ToggleButton handleToggle={handleToggle} buttonState={buttonState} />
      <button className="flex-1 bg-primary-900 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
        Hello
      </button>
    </div>
  )
}

export default ExampleComponent
