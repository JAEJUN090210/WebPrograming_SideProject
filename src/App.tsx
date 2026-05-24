import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ErrorPage from "./pages/ErrorPage"
import FunctionalSpecListPage from "./pages/FunctionalSpecListPage"
import ApiSpecListPage from "./pages/ApiSpecListPage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<FunctionalSpecListPage />} />
        <Route path="/specs/functional" element={<FunctionalSpecListPage />} />
        <Route path="/specs/api" element={<ApiSpecListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<ErrorPage errorCode={404} />} />
      </Routes>
    </>
  )
}

export default App
