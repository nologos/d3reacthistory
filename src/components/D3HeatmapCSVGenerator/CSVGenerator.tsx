// import React from "react"
import { useEffect, useRef, useState } from 'react'

function CSVGenerator() {
  const [getData, setData] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState(null)

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

  function logfile() {
    console.log(fileContent)
  }
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    console.log(file)
    if (file) {
      console.log('opening file')
      const reader = new FileReader()
      reader.onload = (e) => {
      //   console.log(e)
      //   const content = e.target.result
        console.log(e.target.result)
        setFileContent(e.target.result)
      }
      reader.readAsText(file) // or readAsDataURL(file) for images, readAsArrayBuffer(file) for binary
      console.log({ asdf: fileContent })
    }
  }

  const inputFile = useRef<HTMLInputElement | null>(null)
  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click()
  }

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
        <div>
          <h2>Upload github repository files:</h2>
          <input type="file" onChange={handleFileUpload} />
          <button onClick={logfile}>pooop</button>
          {fileContent && (
            <div>
              <h3>File Content:</h3>
              <pre>{fileContent}</pre>
            </div>
          )}
        </div>
        <div>
          <input type="file" id="file" ref={inputFile} style={{ display: 'none' }} />
          <button onClick={onButtonClick}>Open file upload window</button>
        </div>
      </h1>
    )
  }
  return null
}

export default CSVGenerator
