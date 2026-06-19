import {
  CaretLeft,
  CaretRight,
  CheckCircle,
} from "@phosphor-icons/react";

import { LIKERT_OPTIONS } from "../data/questions";
import type { LikertValue, Question } from "../types";
import { IllustrationImage, type IllustrationName } from "./IllustrationImage";
import { ProgressBar } from "./ProgressBar";

type QuestionScreenProps = {
  question: Question;
  currentIndex: number;
  total: number;
  answer?: LikertValue | string;
  onAnswer: (value: LikertValue | string) => void;
  onPrev: () => void;
  onNext: () => void;
};

const likertIcons = {
  1: "optionLikert1",
  2: "optionLikert2",
  3: "optionLikert3",
  4: "optionLikert4",
} as const satisfies Record<LikertValue, IllustrationName>;

const scenarioIcons: Record<string, IllustrationName> = {
  A: "optionScenarioPlan",
  B: "optionScenarioStart",
  C: "optionScenarioSearch",
  D: "optionScenarioMark",
  E: "optionScenarioHelp",
};

export function QuestionScreen({
  question,
  currentIndex,
  total,
  answer,
  onAnswer,
  onPrev,
  onNext,
}: QuestionScreenProps) {
  const canMoveNext = answer !== undefined;
  const isLast = currentIndex === total - 1;

  return (
    <section className="question-card" aria-labelledby="question-title">
      <ProgressBar current={currentIndex + 1} total={total} />
      <div className="question-body">
        <h2 id="question-title">{question.text}</h2>
      </div>
      <div className={question.type === "likert" ? "option-list" : "option-list option-list--scenario"}>
        {question.type === "likert"
          ? LIKERT_OPTIONS.map((option) => {
              const icon = likertIcons[option.value];
              const selected = answer === option.value;
              return (
                <button
                  className={`option-card option-card--likert option-card--${option.value} ${
                    selected ? "is-selected" : ""
                  }`}
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onAnswer(option.value)}
                >
                  <span className="option-illustration">
                    <IllustrationImage name={icon} className="illustration-image--option" />
                    {selected && (
                      <span className="option-check" aria-hidden="true">
                        <CheckCircle size={18} weight="fill" />
                      </span>
                    )}
                  </span>
                  <span className="option-label">{option.label}</span>
                </button>
              );
            })
          : question.options.map((option) => {
              const icon = scenarioIcons[option.id] ?? "optionScenarioMark";
              const selected = answer === option.id;
              return (
                <button
                  className={`option-card option-card--scenario option-card--${option.id} ${
                    selected ? "is-selected" : ""
                  }`}
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onAnswer(option.id)}
                >
                  <span className="option-illustration">
                    <IllustrationImage name={icon} className="illustration-image--option" />
                    {selected && (
                      <span className="option-check" aria-hidden="true">
                        <CheckCircle size={18} weight="fill" />
                      </span>
                    )}
                  </span>
                  <span className="option-label">{option.text}</span>
                </button>
              );
            })}
      </div>
      <div className="question-actions">
        <button className="secondary-button" type="button" onClick={onPrev} disabled={currentIndex === 0}>
          <CaretLeft size={18} weight="bold" /> 이전
        </button>
        <button className="primary-button" type="button" onClick={onNext} disabled={!canMoveNext}>
          {isLast ? "결과 보기" : "다음"} <CaretRight size={18} weight="bold" />
        </button>
      </div>
    </section>
  );
}
