import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

export default function AppLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
