import {
  BookOpen,
  CaretLeft,
  CaretRight,
  CheckCircle,
  MagnifyingGlass,
  PencilSimpleLine,
  PlayCircle,
  Smiley,
  SmileyMeh,
  SmileyNervous,
  SmileySad,
  UsersThree,
} from "@phosphor-icons/react";

import { LIKERT_OPTIONS } from "../data/questions";
import type { LikertValue, Question } from "../types";
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
  1: SmileySad,
  2: SmileyNervous,
  3: SmileyMeh,
  4: Smiley,
} as const;

const scenarioIcons = {
  A: MagnifyingGlass,
  B: UsersThree,
  C: PlayCircle,
  D: PencilSimpleLine,
  E: BookOpen,
} as const;

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
        <span className="question-kicker">
          {question.type === "likert" ? "동의 정도 선택형" : "상황 선택형"}
        </span>
        <h2 id="question-title">{question.text}</h2>
      </div>
      <div className={question.type === "likert" ? "option-list" : "option-list option-list--scenario"}>
        {question.type === "likert"
          ? LIKERT_OPTIONS.map((option) => {
              const Icon = likertIcons[option.value];
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
                  <span className="option-icon">
                    {selected ? (
                      <CheckCircle size={26} weight="fill" />
                    ) : (
                      <Icon size={28} weight="duotone" />
                    )}
                  </span>
                  <span>{option.label}</span>
                </button>
              );
            })
          : question.options.map((option) => {
              const Icon = scenarioIcons[option.id as keyof typeof scenarioIcons] ?? BookOpen;
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
                  <span className="option-icon">
                    {selected ? (
                      <CheckCircle size={26} weight="fill" />
                    ) : (
                      <Icon size={30} weight="duotone" />
                    )}
                  </span>
                  <span>{option.text}</span>
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
