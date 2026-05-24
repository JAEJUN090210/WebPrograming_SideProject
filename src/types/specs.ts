export type SpecStatus = "Draft" | "In Review" | "Approved" | "Deprecated"

export type FunctionalSpec = {
  id: string
  title: string
  description: string
  owner: string
  status: SpecStatus
  updatedAt: string
  category: string
  priority: "Low" | "Medium" | "High" | "Critical"
  version: string
  tags: string[]
  linkedApis: number
}

export type ApiSpec = {
  id: string
  name: string
  description: string
  owner: string
  status: SpecStatus
  updatedAt: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  version: string
  tags: string[]
  auth: "None" | "API Key" | "OAuth2" | "JWT"
  latencyMs: number
}
