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

const baseUrl = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export function getIllustrationSrc(fileName: string) {
  return `${baseUrl}illustrations/${fileName}`;
}

const illustrationSrc: Record<IllustrationName, string> = {
  optionLikert1: getIllustrationSrc("option-likert-1-unsure.webp"),
  optionLikert2: getIllustrationSrc("option-likert-2-worried.webp"),
  optionLikert3: getIllustrationSrc("option-likert-3-calm.webp"),
  optionLikert4: getIllustrationSrc("option-likert-4-excited.webp"),
  optionScenarioPlan: getIllustrationSrc("option-scenario-a-plan.webp"),
  optionScenarioStart: getIllustrationSrc("option-scenario-b-start.webp"),
  optionScenarioSearch: getIllustrationSrc("option-scenario-c-search.webp"),
  optionScenarioMark: getIllustrationSrc("option-scenario-d-mark.webp"),
  optionScenarioHelp: getIllustrationSrc("option-scenario-e-help.webp"),
  resultChecklist: getIllustrationSrc("result-checklist.webp"),
  resultStudent: getIllustrationSrc("result-student.webp"),
  promptRobot: getIllustrationSrc("prompt-robot.webp"),
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
