import { CaretRight, Star, Tray } from "@phosphor-icons/react";

import { getIllustrationSrc } from "./IllustrationImage";
import { PrivacyNotice } from "./PrivacyNotice";

type StartScreenProps = {
  nickname: string;
  savedCount: number;
  onNicknameChange: (value: string) => void;
  onStart: () => void;
  onOpenSaved: () => void;
};

export function StartScreen({
  nickname,
  savedCount,
  onNicknameChange,
  onStart,
  onOpenSaved,
}: StartScreenProps) {
  return (
    <section className="start-layout" aria-labelledby="start-title">
      <div className="start-hero">
        <div className="start-hero__copy">
          <span className="spark-label">
            <Star size={16} weight="fill" /> 중학교 2학년 대상
          </span>
          <h2 id="start-title">나의 공부 스타일을 탐색하는 시간</h2>
          <p>나는 어떤 방식으로 공부할 때 잘 되는 편일까?</p>
        </div>
        <div className="rocket-badge" aria-hidden="true">
          <img src={getIllustrationSrc("hero-rocket.webp")} alt="" />
        </div>
        <PrivacyNotice />
        <form
          className="start-form"
          onSubmit={(event) => {
            event.preventDefault();
            onStart();
          }}
        >
          <label htmlFor="nickname">이름 또는 별명 (선택)</label>
          <input
            id="nickname"
            placeholder="예) 민트고래"
            value={nickname}
            onChange={(event) => onNicknameChange(event.target.value)}
            maxLength={20}
          />
          <button className="primary-button primary-button--wide" type="submit">
            시작하기 <CaretRight size={20} weight="bold" />
          </button>
        </form>
        {savedCount > 0 && (
          <button className="ghost-link start-saved-link" type="button" onClick={onOpenSaved}>
            <Tray size={18} weight="duotone" />
            저장된 결과 {savedCount}개 보기
          </button>
        )}
      </div>
    </section>
  );
}
