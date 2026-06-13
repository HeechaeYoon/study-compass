import { describe, expect, it } from "vitest";

import { buildAiPrompt } from "../lib/promptBuilder";
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

describe("promptBuilder", () => {
  it("reflects subject, unit, and goal inputs", () => {
    const prompt = buildAiPrompt(sampleResult, {
      subject: "수학",
      unit: "일차함수",
      goal: "그래프 해석 연습",
    });

    expect(prompt).toContain('이번에 공부할 과목은 "수학"입니다.');
    expect(prompt).toContain('이번에 공부할 단원은 "일차함수"입니다.');
    expect(prompt).toContain('이번 학습 목표는 "그래프 해석 연습"입니다.');
  });

  it("uses a missing input phrase when optional fields are empty", () => {
    const prompt = buildAiPrompt(sampleResult);
    expect(prompt).toContain('이번에 공부할 과목은 "미입력"입니다.');
    expect(prompt).toContain('이번에 공부할 단원은 "미입력"입니다.');
    expect(prompt).toContain('이번 학습 목표는 "미입력"입니다.');
  });

  it("does not include memo when includeMemo is false", () => {
    const prompt = buildAiPrompt(sampleResult, {
      memo: "최근 영어 단어 암기가 어렵다.",
      includeMemo: false,
    });

    expect(prompt).not.toContain("최근 영어 단어 암기가 어렵다.");
  });

  it("includes memo when includeMemo is true", () => {
    const prompt = buildAiPrompt(sampleResult, {
      memo: "최근 영어 단어 암기가 어렵다.",
      includeMemo: true,
    });

    expect(prompt).toContain("내가 보기엔 이런 점도 있습니다:");
    expect(prompt).toContain("최근 영어 단어 암기가 어렵다.");
  });

  it("includes the current-answer-basis notice", () => {
    expect(buildAiPrompt(sampleResult)).toContain("현재 답변 기준");
  });
});
