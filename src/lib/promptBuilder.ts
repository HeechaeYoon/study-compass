import { AXES } from "../data/questions";
import {
  AXIS_DESCRIPTIONS,
  AXIS_NAMES,
  LEARNING_TYPE_CONTENT,
  LEARNING_TYPE_NAMES,
} from "../data/learningTypes";
import { getCautionSummary, getGrowthSummary, getStrengthSummary } from "./resultText";
import type { Result } from "../types";

export type PromptInputs = {
  subject?: string;
  unit?: string;
  goal?: string;
  memo?: string;
  includeMemo?: boolean;
};

const displayInput = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "미입력";
};

export function buildAiPrompt(result: Result, inputs: PromptInputs = {}) {
  const content = LEARNING_TYPE_CONTENT[result.primaryType];
  const axisLines = AXES.map(
    (axis) => `- ${AXIS_NAMES[axis]}: ${result.axisLabels[axis]}`,
  ).join("\n");
  const memoBlock =
    inputs.includeMemo && inputs.memo?.trim()
      ? `\n내가 보기엔 이런 점도 있습니다:\n${inputs.memo.trim()}\n`
      : "";

  return `나는 현재 답변 기준으로 "${LEARNING_TYPE_NAMES[result.primaryType]}"에 가까운 학습 성향입니다.
이 결과는 고정된 성격이 아니라, 지금의 학습 습관과 선호를 바탕으로 한 자기주도학습 코칭 출발점입니다.

나의 학습 프로필은 다음과 같습니다.

${axisLines}

나의 주요 강점:
${getStrengthSummary(result)}

주의할 점:
${getCautionSummary(result)}

이번에 키워볼 성장 포인트:
${getGrowthSummary(result)}

나에게 잘 맞을 가능성이 높은 학습 방식:
${content.recommendedMethods.map((method) => `- ${method}`).join("\n")}

이번에 공부할 과목은 "${displayInput(inputs.subject)}"입니다.
이번에 공부할 단원은 "${displayInput(inputs.unit)}"입니다.
이번 학습 목표는 "${displayInput(inputs.goal)}"입니다.
${memoBlock}
내 성향을 고려해서 오늘 바로 실천할 수 있는 자기주도학습 계획을 추천해주세요.
계획은 너무 복잡하지 않게 30~40분 안에 실행 가능한 순서로 제안해주세요.
각 단계마다 내가 무엇을 하면 되는지 구체적으로 써주세요.
마지막에는 내가 스스로 점검할 수 있는 질문 3개를 만들어주세요.
내가 막혔을 때 AI에게 다시 물어볼 수 있는 질문 예시도 2개 만들어주세요.

참고: 성장 포인트는 부족하다는 뜻이 아니라, ${AXIS_DESCRIPTIONS[result.growthAxes[0] ?? "P"]}을 조금 더 쉽게 만들 수 있는 출발점입니다.`;
}
