import { Routes, Route } from "react-router-dom"
import ErrorPage from "./pages/ErrorPage"

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<ErrorPage errorCode={401} />} />
      </Routes>
    </>
  )
}

export default App
