import { Stack } from "@mui/material"
import NotificationLogList from "../components/notifications/NotificationLogList"
import NotificationRuleCard from "../components/notifications/NotificationRuleCard"
import NotificationRuleCreateForm from "../components/notifications/NotificationRuleCreateForm"
import SpecPageLayout from "../components/specs/SpecPageLayout"
import SpecSummary from "../components/specs/SpecSummary"
import useIdpStore from "../hooks/useIdpStore"
import type { NotificationRule } from "../types/specs"

export default function NotificationsPage() {
  const { state, updateNotificationRule, deleteNotificationRule, addNotificationLog } = useIdpStore()
  const enabledCount = state.notificationRules.filter(rule => rule.enabled).length
  const activeRecipientCount = state.notificationRules.reduce(
    (total, rule) => total + rule.recipients.filter(recipient => recipient.enabled).length,
    0
  )

  const sendTestNotification = (rule: NotificationRule) => {
    addNotificationLog(
      rule.channel,
      "테스트",
      `[${rule.target}] ${rule.messageTemplate
        .replace("{event}", "테스트")
        .replace("{targetTitle}", "알림 설정")
        .replace("{targetId}", rule.id)
        .replace("{actor}", "현재 사용자")}`
    )
  }

  return (
    <SpecPageLayout eyebrow="IDP SERVICE" title="외부 협업 도구 알림">
      <SpecSummary
        items={[
          { label: "알림 규칙", value: state.notificationRules.length, helper: "직접 등록한 채널" },
          { label: "활성 채널", value: enabledCount, helper: "이벤트 수신 중" },
          { label: "활성 수신자", value: activeRecipientCount, helper: "실제 알림 대상자" },
        ]}
      />

      <NotificationRuleCreateForm onCreate={updateNotificationRule} />

      <Stack direction={{ xs: "column", xl: "row" }} spacing={2.5}>
        {state.notificationRules.map(rule => (
          <NotificationRuleCard
            key={rule.id}
            rule={rule}
            onChange={updateNotificationRule}
            onDelete={deleteNotificationRule}
            onTestSend={sendTestNotification}
          />
        ))}
      </Stack>

      <NotificationLogList logs={state.notificationLogs} />
    </SpecPageLayout>
  )
}
