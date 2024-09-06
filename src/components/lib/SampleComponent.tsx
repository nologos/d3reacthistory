// import React from "react"
import { useEffect, useState } from 'react'

function LoadComponent() {
  const [getData, setData] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const data = [1, 2]
        /**
         * your code replaces this
         */
        if (!data || Object.keys(data).length === 0) {
          throw new Error('Network response was not ok')
        }
        setData(data)
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
      <h1>
        {getData.map(item => (
          <p>{item}</p>
        ))}
      </h1>
    )
  }
  return null
}

export default LoadComponent
