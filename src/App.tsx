import { Routes, Route } from "react-router-dom"
import ErrorPage from "./pages/ErrorPage"
import FunctionalSpecListPage from "./pages/FunctionalSpecListPage"
import ApiSpecListPage from "./pages/ApiSpecListPage"
import FunctionalSpecCreatePage from "./pages/FunctionalSpecCreatePage"
import ApiSpecCreatePage from "./pages/ApiSpecCreatePage"
import FunctionalSpecDetailPage from "./pages/FunctionalSpecDetailPage"
import ApiSpecDetailPage from "./pages/ApiSpecDetailPage"
import AccountManagementPage from "./pages/AccountManagementPage"
import ErdPage from "./pages/ErdPage"
import ImpactMapPage from "./pages/ImpactMapPage"
import AiAssistantPage from "./pages/AiAssistantPage"
import NotificationsPage from "./pages/NotificationsPage"
import AuditLogPage from "./pages/AuditLogPage"
import AppLayout from "./components/layout/AppLayout"
import PromptAuthGate from "./components/auth/PromptAuthGate"

function App() {
  return (
    <Routes>
      <Route element={<PromptAuthGate />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<FunctionalSpecListPage />} />
          <Route path="/specs/functional" element={<FunctionalSpecListPage />} />
          <Route path="/specs/functional/new" element={<FunctionalSpecCreatePage />} />
          <Route path="/specs/functional/:id" element={<FunctionalSpecDetailPage />} />
          <Route path="/specs/api" element={<ApiSpecListPage />} />
          <Route path="/specs/api/new" element={<ApiSpecCreatePage />} />
          <Route path="/specs/api/:id" element={<ApiSpecDetailPage />} />
          <Route path="/erd" element={<ErdPage />} />
          <Route path="/impact" element={<ImpactMapPage />} />
          <Route path="/ai" element={<AiAssistantPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/audit" element={<AuditLogPage />} />
          <Route path="/accounts" element={<AccountManagementPage />} />
        </Route>
      </Route>
      <Route path="*" element={<ErrorPage errorCode={404} />} />
    </Routes>
  )
}

export default App
