export type IllustrationName =
  | "optionLikert1"
  | "optionLikert2"
  | "optionLikert3"
  | "optionLikert4"
  | "optionScenarioPlan"
  | "optionScenarioStart"
  | "optionScenarioSearch"
  | "optionScenarioMark"
  | "optionScenarioHelp"
  | "resultChecklist"
  | "resultStudent"
  | "promptRobot";

const illustrationSrc: Record<IllustrationName, string> = {
  optionLikert1: "/illustrations/option-likert-1-unsure.webp",
  optionLikert2: "/illustrations/option-likert-2-worried.webp",
  optionLikert3: "/illustrations/option-likert-3-calm.webp",
  optionLikert4: "/illustrations/option-likert-4-excited.webp",
  optionScenarioPlan: "/illustrations/option-scenario-a-plan.webp",
  optionScenarioStart: "/illustrations/option-scenario-b-start.webp",
  optionScenarioSearch: "/illustrations/option-scenario-c-search.webp",
  optionScenarioMark: "/illustrations/option-scenario-d-mark.webp",
  optionScenarioHelp: "/illustrations/option-scenario-e-help.webp",
  resultChecklist: "/illustrations/result-checklist.webp",
  resultStudent: "/illustrations/result-student.webp",
  promptRobot: "/illustrations/prompt-robot.webp",
};

type IllustrationImageProps = {
  name: IllustrationName;
  className?: string;
};

export function IllustrationImage({ name, className = "" }: IllustrationImageProps) {
  const classes = ["illustration-image", className].filter(Boolean).join(" ");

  return (
    <img
      className={classes}
      src={illustrationSrc[name]}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}
