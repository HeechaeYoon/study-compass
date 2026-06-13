import { AXES } from "../data/questions";
import {
  AXIS_DESCRIPTIONS,
  AXIS_LABEL_MESSAGES,
  AXIS_NAMES,
  LEARNING_TYPE_CONTENT,
  LEARNING_TYPE_NAMES,
} from "../data/learningTypes";
import type { Axis, Result } from "../types";

export function getDisplayName(result: Pick<Result, "nickname">) {
  return result.nickname ? `${result.nickname}님의 학습 성향` : "나의 학습 성향";
}

export function getPrimarySentence(result: Result) {
  const primary = LEARNING_TYPE_NAMES[result.primaryType];
  if (result.secondaryType) {
    return `현재 답변 기준으로는 "${primary}"에 가장 가깝고, "${LEARNING_TYPE_NAMES[result.secondaryType]}"의 특징도 일부 보여요.`;
  }

  return `현재 답변 기준으로는 "${primary}"에 가장 가까워요.`;
}

export function getMainGrowthAxis(result: Result): Axis {
  return result.growthAxes[0] ?? AXES[0];
}

export function getAxisInterpretation(result: Result, axis: Axis) {
  return `${AXIS_NAMES[axis]}: ${result.axisLabels[axis]} - ${AXIS_LABEL_MESSAGES[result.axisLabels[axis]]}`;
}

export function getStrengthSummary(result: Result) {
  const content = LEARNING_TYPE_CONTENT[result.primaryType];
  return content.strengths.slice(0, 3).join(" ");
}

export function getCautionSummary(result: Result) {
  const content = LEARNING_TYPE_CONTENT[result.primaryType];
  return content.cautions.slice(0, 2).join(" ");
}

export function getGrowthSummary(result: Result) {
  const axis = getMainGrowthAxis(result);
  return `${AXIS_NAMES[axis]} - ${AXIS_DESCRIPTIONS[axis]}`;
}

export function buildDetailedReport(result: Result) {
  const content = LEARNING_TYPE_CONTENT[result.primaryType];
  const secondary = result.secondaryType
    ? `\n보조 성향으로는 "${LEARNING_TYPE_NAMES[result.secondaryType]}"의 특징도 일부 보여요.`
    : "";
  const axes = AXES.map(
    (axis) =>
      `- ${AXIS_NAMES[axis]}: ${result.axisLabels[axis]} (${AXIS_DESCRIPTIONS[axis]}) ${AXIS_LABEL_MESSAGES[result.axisLabels[axis]]}`,
  ).join("\n");
  const growthAxis = getMainGrowthAxis(result);

  return [
    `${getDisplayName(result)} 상세 리포트`,
    "",
    `대표 학습 성향: ${content.name}`,
    getPrimarySentence(result),
    "이 결과는 현재 답변 기준의 참고 자료입니다.",
    secondary.trim(),
    "",
    "5개 축별 해석",
    axes,
    "",
    "주요 강점",
    ...content.strengths.map((item) => `- ${item}`),
    "",
    "주의할 점",
    ...content.cautions.map((item) => `- ${item}`),
    "",
    "잘 맞는 학습법",
    ...content.recommendedMethods.map((item) => `- ${item}`),
    "",
    "피하면 좋은 학습 방식",
    "- 계획만 오래 세우고 시작을 미루는 방식",
    "- 답만 확인하고 왜 그런지 점검하지 않는 방식",
    "- 모르는 부분을 표시하지 않은 채 오래 버티는 방식",
    "",
    "이번에 키워볼 성장 포인트",
    `${AXIS_NAMES[growthAxis]} - ${AXIS_DESCRIPTIONS[growthAxis]}`,
    "",
    "다음 수업 성장 미션",
    content.growthMission,
    "",
    "고정된 성격이나 능력이 아니라, 지금의 학습 습관과 선호를 바탕으로 한 코칭 출발점입니다.",
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}
