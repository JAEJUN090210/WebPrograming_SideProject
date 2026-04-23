import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { registerSW } from "virtual:pwa-register"
import App from "./App"
import "./global.css"

if ("serviceWorker" in navigator) {
  registerSW({
    onNeedRefresh() {
      console.log("새 버전 있음")
    },
    onOfflineReady() {
      console.log("오프라인 사용 가능")
    },
  })
}

const rootElement = document.getElementById("root")
if (!rootElement) {
  throw new Error("Failed to find the root element")
}
const root = createRoot(rootElement)
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
