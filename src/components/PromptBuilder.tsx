import { Copy, Sparkle } from "@phosphor-icons/react";

import type { PromptInputs } from "../lib/promptBuilder";
import { IllustrationImage } from "./IllustrationImage";

type PromptBuilderProps = {
  inputs: PromptInputs;
  prompt: string;
  onInputsChange: (inputs: PromptInputs) => void;
  onCopy: () => void;
};

export function PromptBuilder({ inputs, prompt, onInputsChange, onCopy }: PromptBuilderProps) {
  const update = (patch: Partial<PromptInputs>) => onInputsChange({ ...inputs, ...patch });

  return (
    <div className="prompt-panel">
      <div className="panel-heading">
        <span className="panel-icon panel-icon--image">
          <IllustrationImage name="promptRobot" className="illustration-image--panel" />
        </span>
        <div>
          <h3>AI 챗봇에게 이렇게 말해보세요!</h3>
          <p>
            다음 수업에서 Gemini 같은 AI 챗봇에 붙여넣으면, 현재 답변 기준에 맞춘 공부
            계획을 추천받을 수 있어요.
          </p>
        </div>
      </div>
      <div className="prompt-form">
        <label>
          과목 (선택)
          <input
            value={inputs.subject ?? ""}
            onChange={(event) => update({ subject: event.target.value })}
            placeholder="예) 수학"
          />
        </label>
        <label>
          단원 (선택)
          <input
            value={inputs.unit ?? ""}
            onChange={(event) => update({ unit: event.target.value })}
            placeholder="예) 일차함수"
          />
        </label>
        <label>
          이번 학습 목표 (선택)
          <input
            value={inputs.goal ?? ""}
            onChange={(event) => update({ goal: event.target.value })}
            placeholder="예) 일차함수의 그래프를 이해하고 문제 풀어보기"
          />
        </label>
        <label>
          내 메모 (선택)
          <textarea
            value={inputs.memo ?? ""}
            onChange={(event) => update({ memo: event.target.value })}
            placeholder="결과가 나와 조금 다르게 느껴지는 점이나 내 상황을 적어보세요."
            rows={4}
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={Boolean(inputs.includeMemo)}
            onChange={(event) => update({ includeMemo: event.target.checked })}
          />
          내가 쓴 메모를 AI 프롬프트에 포함하기
        </label>
      </div>
      <div className="prompt-preview">
        <div className="prompt-preview__header">
          <span>
            <Sparkle size={18} weight="fill" /> 프롬프트 미리보기
          </span>
          <button className="primary-button primary-button--small" type="button" onClick={onCopy}>
            <Copy size={18} weight="bold" /> 프롬프트 복사하기
          </button>
        </div>
        <pre>{prompt}</pre>
      </div>
    </div>
  );
}
