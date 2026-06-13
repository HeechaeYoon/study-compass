import { AXES, QUESTIONS_16, emptyScores } from "../data/questions";
import { LEARNING_TYPE_PROFILES } from "../data/learningTypes";
import type {
  Axis,
  AxisLabel,
  AxisLabels,
  AxisScores,
  LearningTypeId,
  LikertValue,
  Question,
  Result,
} from "../types";

export type TypeMatch = {
  primaryType: LearningTypeId;
  secondaryType?: LearningTypeId;
  ranking: { type: LearningTypeId; distance: number; similarity: number }[];
};

export const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

export const average = (values: number[]) =>
  values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;

export function standardDeviation(values: number[]) {
  if (values.length === 0) return 0;
  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance);
}

export function toAxisLabel(score: number): AxisLabel {
  if (score >= 70) return "강점";
  if (score >= 40) return "균형";
  return "성장 포인트";
}

export function toAxisLabels(scores: AxisScores): AxisLabels {
  return AXES.reduce((labels, axis) => {
    labels[axis] = toAxisLabel(scores[axis]);
    return labels;
  }, {} as AxisLabels);
}

export function getAxisRanges(questions: Question[] = QUESTIONS_16) {
  const min = emptyScores();
  const max = emptyScores();

  for (const question of questions) {
    if (question.type === "likert") {
      min[question.axis] += 1;
      max[question.axis] += 4;
      continue;
    }

    for (const axis of AXES) {
      const optionScores = question.options.map((option) => option.scores[axis]);
      min[axis] += Math.min(...optionScores);
      max[axis] += Math.max(...optionScores);
    }
  }

  return { min, max };
}

export function calculateRawScores(
  answers: Record<string, LikertValue | string>,
  questions: Question[] = QUESTIONS_16,
): AxisScores {
  const scores = emptyScores();

  for (const question of questions) {
    const answer = answers[question.id];

    if (question.type === "likert") {
      if (typeof answer !== "number") {
        throw new Error(`${question.id} 문항의 응답이 없습니다.`);
      }
      scores[question.axis] += answer;
      continue;
    }

    const option = question.options.find((candidate) => candidate.id === answer);
    if (!option) {
      throw new Error(`${question.id} 문항의 응답이 없습니다.`);
    }

    for (const axis of AXES) {
      scores[axis] += option.scores[axis];
    }
  }

  return scores;
}

export function normalizeScores(
  rawScores: AxisScores,
  questions: Question[] = QUESTIONS_16,
): AxisScores {
  const ranges = getAxisRanges(questions);
  return AXES.reduce((normalized, axis) => {
    const span = ranges.max[axis] - ranges.min[axis];
    normalized[axis] =
      span === 0
        ? 0
        : clamp(Math.round(((rawScores[axis] - ranges.min[axis]) / span) * 100));
    return normalized;
  }, emptyScores());
}

export function calculateAxisScores(
  answers: Record<string, LikertValue | string>,
  questions: Question[] = QUESTIONS_16,
): AxisScores {
  return normalizeScores(calculateRawScores(answers, questions), questions);
}

export function distance(a: AxisScores, b: AxisScores): number {
  const sum = AXES.reduce((acc, axis) => {
    const diff = a[axis] - b[axis];
    return acc + diff * diff;
  }, 0);

  return Math.sqrt(sum / AXES.length);
}

export function similarity(a: AxisScores, b: AxisScores): number {
  return 1 - distance(a, b) / 100;
}

export function getTypeRanking(axisScores: AxisScores) {
  return (Object.keys(LEARNING_TYPE_PROFILES) as LearningTypeId[])
    .map((type) => ({
      type,
      distance: distance(axisScores, LEARNING_TYPE_PROFILES[type]),
      similarity: similarity(axisScores, LEARNING_TYPE_PROFILES[type]),
    }))
    .sort((a, b) => b.similarity - a.similarity);
}

export function matchLearningType(axisScores: AxisScores): TypeMatch {
  const values = Object.values(axisScores);
  const mean = average(values);
  const sd = standardDeviation(values);
  const maxScore = Math.max(...values);
  const ranking = getTypeRanking(axisScores);

  let primaryType: LearningTypeId;

  if (mean < 50 && maxScore < 60) {
    primaryType = "foundation_builder";
  } else if (sd < 8 && mean >= 60) {
    primaryType = "balanced_coordinator";
  } else {
    primaryType = ranking[0].type;
  }

  const ordered = [ranking.find((item) => item.type === primaryType), ...ranking].filter(
    Boolean,
  ) as typeof ranking;
  const uniqueRanking = ordered.filter(
    (item, index, list) => list.findIndex((candidate) => candidate.type === item.type) === index,
  );
  const first = uniqueRanking[0];
  const second = uniqueRanking[1];
  const closeBySimilarity =
    first && second ? Math.abs(first.similarity - second.similarity) < 0.03 : false;
  const closeByDistance =
    first && second ? Math.abs(first.distance - second.distance) < 5 : false;

  return {
    primaryType,
    secondaryType: closeBySimilarity || closeByDistance ? second.type : undefined,
    ranking,
  };
}

export function getStrengthAxes(scores: AxisScores, labels: AxisLabels): Axis[] {
  const strengths = AXES.filter((axis) => labels[axis] === "강점");
  if (strengths.length > 0) return strengths;

  const topScore = Math.max(...AXES.map((axis) => scores[axis]));
  return AXES.filter((axis) => scores[axis] === topScore);
}

export function getGrowthAxes(scores: AxisScores, labels: AxisLabels): Axis[] {
  const growthAxes = AXES.filter((axis) => labels[axis] === "성장 포인트");
  if (growthAxes.length > 0) return growthAxes;

  const lowScore = Math.min(...AXES.map((axis) => scores[axis]));
  return AXES.filter((axis) => scores[axis] === lowScore);
}

export function generateResult(
  answers: Record<string, LikertValue | string>,
  nickname?: string,
): Result {
  const axisScores = calculateAxisScores(answers);
  const axisLabels = toAxisLabels(axisScores);
  const typeMatch = matchLearningType(axisScores);

  return {
    questionnaireVersion: "16-basic",
    nickname: nickname?.trim() || undefined,
    answers,
    axisScores,
    axisLabels,
    primaryType: typeMatch.primaryType,
    secondaryType: typeMatch.secondaryType,
    strengthAxes: getStrengthAxes(axisScores, axisLabels),
    growthAxes: getGrowthAxes(axisScores, axisLabels),
    createdAt: new Date().toISOString(),
  };
}
