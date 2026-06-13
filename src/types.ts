export type Axis = "P" | "E" | "U" | "M" | "H";

export type AxisScores = Record<Axis, number>;

export type AxisLabel = "강점" | "균형" | "성장 포인트";

export type AxisLabels = Record<Axis, AxisLabel>;

export type LikertValue = 1 | 2 | 3 | 4;

export type QuestionType = "likert" | "scenario";

export type LearningTypeId =
  | "strategy_designer"
  | "execution_driver"
  | "concept_explorer"
  | "reflection_grower"
  | "resource_user"
  | "balanced_coordinator"
  | "routine_stabilizer"
  | "foundation_builder";

export type Question =
  | {
      id: string;
      type: "likert";
      text: string;
      axis: Axis;
    }
  | {
      id: string;
      type: "scenario";
      text: string;
      options: ScenarioOption[];
    };

export type ScenarioOption = {
  id: string;
  text: string;
  scores: AxisScores;
};

export type Result = {
  questionnaireVersion: "16-basic";
  nickname?: string;
  answers: Record<string, LikertValue | string>;
  axisScores: AxisScores;
  axisLabels: AxisLabels;
  primaryType: LearningTypeId;
  secondaryType?: LearningTypeId;
  strengthAxes: Axis[];
  growthAxes: Axis[];
  createdAt: string;
};

export type SavedResult = Result & {
  version: "1.0.0";
  memo?: string;
  includeMemoInPrompt: boolean;
  savedAt: string;
};
