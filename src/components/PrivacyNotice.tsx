import {
  CloudSlash,
  IdentificationBadge,
  LockKey,
  NotePencil,
} from "@phosphor-icons/react";

const notices = [
  {
    icon: LockKey,
    title: "이 앱은 성격검사나 심리검사가 아니에요.",
    body: "자기주도학습 전략을 찾기 위한 자기이해 활동입니다.",
  },
  {
    icon: IdentificationBadge,
    title: "이름이나 별명은 선택사항이에요.",
    body: "입력하지 않아도 바로 사용할 수 있습니다.",
  },
  {
    icon: CloudSlash,
    title: "답변과 결과는 서버로 전송되지 않아요.",
    body: "저장 기능을 쓰면 이 기기의 브라우저에만 저장됩니다.",
  },
  {
    icon: NotePencil,
    title: "결과는 현재 답변 기준의 참고 자료예요.",
    body: "저장된 결과와 메모는 언제든 삭제할 수 있습니다.",
  },
];

export function PrivacyNotice() {
  return (
    <div className="notice-card" aria-label="개인정보 및 안전 안내">
      {notices.map((notice) => {
        const Icon = notice.icon;
        return (
          <div className="notice-item" key={notice.title}>
            <span className="notice-icon">
              <Icon size={22} weight="duotone" />
            </span>
            <span>
              <strong>{notice.title}</strong>
              <small>{notice.body}</small>
            </span>
          </div>
        );
      })}
    </div>
  );
}
