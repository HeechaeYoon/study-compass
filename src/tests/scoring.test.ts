import { describe, expect, it } from "vitest";

import { AXES, QUESTIONS_16 } from "../data/questions";
import {
  calculateAxisScores,
  generateResult,
  matchLearningType,
  toAxisLabel,
} from "../lib/scoring";
import type { Axis, LikertValue } from "../types";

const scenarioChoiceByAxis: Record<Axis, Record<string, string>> = {
  P: { Q13: "A", Q14: "A", Q15: "C", Q16: "E" },
  E: { Q13: "B", Q14: "B", Q15: "B", Q16: "B" },
  U: { Q13: "C", Q14: "C", Q15: "C", Q16: "E" },
  M: { Q13: "D", Q14: "D", Q15: "D", Q16: "E" },
  H: { Q13: "E", Q14: "E", Q15: "E", Q16: "E" },
};

function answersForAxis(target: Axis) {
  return QUESTIONS_16.reduce<Record<string, LikertValue | string>>((answers, question) => {
    if (question.type === "likert") {
      answers[question.id] = 4;
    } else {
      answers[question.id] = scenarioChoiceByAxis[target][question.id];
    }
    return answers;
  }, {});
}

describe("scoring", () => {
  it("keeps all axis scores in the 0 to 100 range", () => {
    const scores = calculateAxisScores(answersForAxis("P"));
    for (const axis of AXES) {
      expect(scores[axis]).toBeGreaterThanOrEqual(0);
      expect(scores[axis]).toBeLessThanOrEqual(100);
    }
  });

  it("matches P-centered answers to strategy designer", () => {
    expect(generateResult(answersForAxis("P")).primaryType).toBe("strategy_designer");
  });

  it("matches E-centered answers to execution or routine types", () => {
    expect(["execution_driver", "routine_stabilizer"]).toContain(
      generateResult(answersForAxis("E")).primaryType,
    );
  });

  it("matches U-centered answers to concept explorer", () => {
    expect(generateResult(answersForAxis("U")).primaryType).toBe("concept_explorer");
  });

  it("matches M-centered answers to reflection grower", () => {
    expect(generateResult(answersForAxis("M")).primaryType).toBe("reflection_grower");
  });

  it("matches H-centered answers to resource user", () => {
    expect(generateResult(answersForAxis("H")).primaryType).toBe("resource_user");
  });

  it("uses the balanced coordinator rule for evenly high scores", () => {
    expect(matchLearningType({ P: 72, E: 70, U: 69, M: 73, H: 71 }).primaryType).toBe(
      "balanced_coordinator",
    );
  });

  it("uses the foundation builder rule for low scores", () => {
    expect(matchLearningType({ P: 35, E: 45, U: 40, M: 32, H: 38 }).primaryType).toBe(
      "foundation_builder",
    );
  });

  it("sets a secondary type when the top two matches are close", () => {
    const result = matchLearningType({ P: 68, E: 55, U: 78, M: 58, H: 58 });
    expect(result.secondaryType).toBeDefined();
    expect(result.secondaryType).not.toBe(result.primaryType);
  });

  it("converts axis labels at the required thresholds", () => {
    expect(toAxisLabel(0)).toBe("성장 포인트");
    expect(toAxisLabel(39)).toBe("성장 포인트");
    expect(toAxisLabel(40)).toBe("균형");
    expect(toAxisLabel(69)).toBe("균형");
    expect(toAxisLabel(70)).toBe("강점");
    expect(toAxisLabel(100)).toBe("강점");
  });
});
