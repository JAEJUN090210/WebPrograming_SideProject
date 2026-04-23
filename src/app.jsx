import { Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import { Global } from "@emotion/react"

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
