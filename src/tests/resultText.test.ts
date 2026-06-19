import { describe, expect, it } from "vitest";

import { buildDetailedReport, buildDetailedReportModel } from "../lib/resultText";
import type { Result } from "../types";

const sampleResult: Result = {
  questionnaireVersion: "16-basic",
  nickname: "민트고래",
  answers: {},
  axisScores: { P: 78, E: 62, U: 74, M: 58, H: 52 },
  axisLabels: {
    P: "강점",
    E: "균형",
    U: "강점",
    M: "균형",
    H: "균형",
  },
  primaryType: "strategy_designer",
  secondaryType: "concept_explorer",
  strengthAxes: ["P", "U"],
  growthAxes: ["H"],
  createdAt: "2026-06-13T00:00:00.000Z",
};

describe("resultText", () => {
  it("keeps the consolidated report model as the source for detailed result content", () => {
    const model = buildDetailedReportModel(sampleResult);

    expect(model.axisInsights).toHaveLength(5);
    expect(model.recommendedMethods).toContain("오늘 목표 1개 쓰기");
    expect(model.growthMission).toBe(
      "오늘 공부할 단원에서 목표 1개, 순서 3개만 정하고 바로 시작해보세요.",
    );
  });

  it("builds copy text with consolidated sections and without generic avoid-method filler", () => {
    const report = buildDetailedReport(sampleResult);

    expect(report).toContain("5. 5개 축별 해석");
    expect(report).toContain("7. 나에게 맞을 가능성이 높은 학습 전략");
    expect(report).toContain("8. 성장 미션과 점검 질문");
    expect(report).not.toContain("9. 스스로 점검할 질문");
    expect(report).not.toContain("계획만 오래 세우고 시작을 미루는 방식");
  });
});
