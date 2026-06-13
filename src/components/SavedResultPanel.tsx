import {
  ArrowCounterClockwise,
  CaretLeft,
  Eye,
  Star,
  Trash,
  WarningCircle,
} from "@phosphor-icons/react";

import { LEARNING_TYPE_NAMES } from "../data/learningTypes";
import type { Result, SavedResult } from "../types";

type SavedResultPanelProps = {
  results: SavedResult[];
  onBack: () => void;
  onRestart: () => void;
  onView: (result: Result) => void;
  onDelete: (savedAt: string) => void;
  onClear: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function SavedResultPanel({
  results,
  onBack,
  onRestart,
  onView,
  onDelete,
  onClear,
}: SavedResultPanelProps) {
  return (
    <section className="saved-card" aria-labelledby="saved-title">
      <div className="saved-card__header">
        <button className="secondary-button secondary-button--compact" type="button" onClick={onBack}>
          <CaretLeft size={18} weight="bold" /> 돌아가기
        </button>
        <button className="danger-button" type="button" onClick={onClear} disabled={results.length === 0}>
          <Trash size={18} weight="bold" /> 전체 삭제
        </button>
      </div>
      <div className="panel-heading">
        <span className="panel-icon">
          <Star size={30} weight="duotone" />
        </span>
        <div>
          <h2 id="saved-title">저장된 결과</h2>
          <p>이 기기에 저장된 현재 진단 결과예요.</p>
        </div>
      </div>
      {results.length === 0 ? (
        <div className="empty-state">
          <WarningCircle size={42} weight="duotone" />
          <h3>아직 저장된 결과가 없어요.</h3>
          <p>진단을 마친 뒤 결과 저장 버튼을 누르면 이곳에서 다시 볼 수 있습니다.</p>
          <button className="primary-button" type="button" onClick={onRestart}>
            <ArrowCounterClockwise size={18} weight="bold" /> 다시 진단하기
          </button>
        </div>
      ) : (
        <div className="saved-list">
          {results.map((result) => (
            <article className="saved-item" key={result.savedAt}>
              <div className="saved-item__mark">
                <Star size={26} weight="fill" />
              </div>
              <div>
                <h3>{LEARNING_TYPE_NAMES[result.primaryType]}</h3>
                <p>{dateFormatter.format(new Date(result.savedAt))}</p>
                <div className="saved-tags">
                  {result.nickname && <span>{result.nickname}</span>}
                  <span>{result.questionnaireVersion}</span>
                </div>
              </div>
              <div className="saved-item__actions">
                <button className="secondary-button secondary-button--compact" type="button" onClick={() => onView(result)}>
                  <Eye size={18} weight="bold" /> 보기
                </button>
                <button className="icon-danger" type="button" aria-label="저장 결과 삭제" onClick={() => onDelete(result.savedAt)}>
                  <Trash size={20} weight="bold" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
