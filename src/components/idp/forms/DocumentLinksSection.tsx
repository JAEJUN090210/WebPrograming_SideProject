import MultiSelectField from "../MultiSelectField"
import FormSection from "../layout/FormSection"

type LinkOption = {
  value: string
  label: string
}

type DocumentLinksSectionProps = {
  title?: string
  primaryLabel: string
  primaryValue: string[]
  primaryOptions: LinkOption[]
  onPrimaryChange: (value: string[]) => void
  entityValue: string[]
  entityOptions: LinkOption[]
  onEntityChange: (value: string[]) => void
}

export default function DocumentLinksSection({
  title = "문서 연결",
  primaryLabel,
  primaryValue,
  primaryOptions,
  onPrimaryChange,
  entityValue,
  entityOptions,
  onEntityChange,
}: DocumentLinksSectionProps) {
  return (
    <FormSection title={title} description="기능, API, 데이터 구조를 연결해 변경 영향도를 추적합니다.">
      <MultiSelectField label={primaryLabel} value={primaryValue} options={primaryOptions} onChange={onPrimaryChange} />
      <MultiSelectField
        label="연결 데이터 테이블"
        value={entityValue}
        options={entityOptions}
        onChange={onEntityChange}
      />
    </FormSection>
  )
}
