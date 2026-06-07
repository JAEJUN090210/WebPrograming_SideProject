import { Stack } from "@mui/material"
import { useState } from "react"
import ErdEntityForm from "../components/erd/ErdEntityForm"
import ErdEntityGrid from "../components/erd/ErdEntityGrid"
import ErdRelationshipForm from "../components/erd/ErdRelationshipForm"
import { emptyEntityDraft, fieldsToText, textToFields, type EntityDraft } from "../components/erd/erdFieldText"
import VersionPanel from "../components/idp/VersionPanel"
import SpecPageLayout from "../components/specs/SpecPageLayout"
import SpecSummary from "../components/specs/SpecSummary"
import useIdpStore from "../hooks/useIdpStore"
import type { ErdEntity } from "../types/specs"

export default function ErdPage() {
  const { state, saveErdEntity, deleteErdEntity, saveErdRelationship, saveErdSnapshot, restoreErdVersion } =
    useIdpStore()
  const [draft, setDraft] = useState<EntityDraft>(emptyEntityDraft)
  const [relationship, setRelationship] = useState({
    fromEntityId: state.erdEntities[0]?.id ?? "",
    toEntityId: state.erdEntities[1]?.id ?? "",
    label: "참조",
  })

  const erdVersions = state.versions.filter(version => version.targetType === "erd")
  const summaryItems = [
    { label: "테이블", value: state.erdEntities.length, helper: "ERD 엔티티 수" },
    { label: "관계", value: state.erdRelationships.length, helper: "테이블 간 연결" },
    {
      label: "컬럼",
      value: state.erdEntities.reduce((total, entity) => total + entity.fields.length, 0),
      helper: "관리 중인 필드",
    },
  ]

  const handleEdit = (entity: ErdEntity) => {
    setDraft({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      owner: entity.owner,
      fieldsText: fieldsToText(entity.fields),
    })
  }

  const handleSaveEntity = () => {
    if (!draft.name.trim()) {
      return
    }

    saveErdEntity({
      id: draft.id,
      name: draft.name,
      description: draft.description,
      owner: draft.owner,
      updatedAt: "",
      fields: textToFields(draft.fieldsText),
    })
    setDraft(emptyEntityDraft)
  }

  const handleSaveRelationship = () => {
    if (
      !relationship.fromEntityId ||
      !relationship.toEntityId ||
      relationship.fromEntityId === relationship.toEntityId
    ) {
      return
    }

    saveErdRelationship({
      id: "",
      fromEntityId: relationship.fromEntityId,
      toEntityId: relationship.toEntityId,
      label: relationship.label,
    })
  }

  return (
    <SpecPageLayout
      eyebrow="IDP SERVICE"
      title="DB 관계도(ERD)"
      description="데이터베이스 테이블, 컬럼, 관계를 시각적으로 관리하고 버전 스냅샷으로 복원합니다."
    >
      <SpecSummary items={summaryItems} />

      <Stack direction={{ xs: "column", lg: "row" }} spacing={2.5}>
        <ErdEntityForm
          draft={draft}
          onDraftChange={setDraft}
          onSave={handleSaveEntity}
          onSaveSnapshot={saveErdSnapshot}
        />
        <ErdRelationshipForm
          entities={state.erdEntities}
          relationships={state.erdRelationships}
          draft={relationship}
          onDraftChange={setRelationship}
          onSave={handleSaveRelationship}
        />
      </Stack>

      <ErdEntityGrid entities={state.erdEntities} onEdit={handleEdit} onDelete={deleteErdEntity} />
      <VersionPanel versions={erdVersions} onRestore={restoreErdVersion} />
    </SpecPageLayout>
  )
}
