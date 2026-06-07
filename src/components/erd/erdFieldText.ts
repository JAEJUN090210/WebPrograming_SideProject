import type { ErdField } from "../../types/specs"

export type EntityDraft = {
  id: string
  name: string
  description: string
  owner: string
  fieldsText: string
}

export const emptyEntityDraft: EntityDraft = {
  id: "",
  name: "",
  description: "",
  owner: "전재준",
  fieldsText: "id: uuid: required: PK\nname: varchar: required: 표시 이름",
}

export function fieldsToText(fields: ErdField[]) {
  return fields
    .map(field => `${field.name}: ${field.type}: ${field.required ? "required" : "optional"}: ${field.note}`)
    .join("\n")
}

export function textToFields(value: string): ErdField[] {
  return value
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [name = "", type = "varchar", required = "optional", note = ""] = line.split(":").map(item => item.trim())
      return { name, type, required: required.toLowerCase() === "required", note }
    })
    .filter(field => field.name.length > 0)
}
