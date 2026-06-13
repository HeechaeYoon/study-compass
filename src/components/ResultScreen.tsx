import { useMemo, useState, type ReactNode, type RefObject } from "react";
import {
  BookOpenText,
  ChartBar,
  CheckCircle,
  Copy,
  DownloadSimple,
  FileText,
  FloppyDisk,
  GraduationCap,
  House,
  Lightbulb,
  ListChecks,
  Robot,
  ShieldCheck,
  Star,
  Target,
  WarningCircle,
} from "@phosphor-icons/react";

import { AXES } from "../data/questions";
import {
  AXIS_DESCRIPTIONS,
  AXIS_LABEL_MESSAGES,
  AXIS_NAMES,
  LEARNING_TYPE_CONTENT,
  LEARNING_TYPE_NAMES,
} from "../data/learningTypes";
import type { PromptInputs } from "../lib/promptBuilder";
import { buildAiPrompt } from "../lib/promptBuilder";
import {
  buildDetailedReport,
  getCautionSummary,
  getDisplayName,
  getGrowthSummary,
  getMainGrowthAxis,
  getPrimarySentence,
  getStrengthSummary,
} from "../lib/resultText";
import type { Result } from "../types";
import { AxisBars } from "./AxisBars";
import { IllustrationImage } from "./IllustrationImage";
import { PromptBuilder } from "./PromptBuilder";

type ResultScreenProps = {
  result: Result;
  savedCount: number;
  summaryRef: RefObject<HTMLDivElement | null>;
  onRestart: () => void;
  onOpenSaved: () => void;
  onSave: (memo: string, includeMemoInPrompt: boolean) => void;
  onCopy: (text: string, label: string) => void;
  onExportImage: () => void;
};

type ResultTab =
  | "summary"
  | "report"
  | "axes"
  | "strategy"
  | "avoid"
  | "mission"
  | "prompt"
  | "save";

const tabs: { id: ResultTab; label: string; icon: typeof House }[] = [
  { id: "summary", label: "요약", icon: House },
  { id: "report", label: "성향 리포트", icon: FileText },
  { id: "axes", label: "축별 해석", icon: ChartBar },
  { id: "strategy", label: "학습 전략", icon: Lightbulb },
  { id: "avoid", label: "피하면 좋은 방식", icon: WarningCircle },
  { id: "mission", label: "성장 미션", icon: Target },
  { id: "prompt", label: "AI 프롬프트", icon: Robot },
  { id: "save", label: "저장/내보내기", icon: FloppyDisk },
];

const avoidMethods = [
  "계획만 오래 세우고 시작을 미루는 방식",
  "답만 확인하고 왜 그런지 점검하지 않는 방식",
  "모르는 부분을 표시하지 않은 채 오래 버티는 방식",
  "AI 답변을 그대로 외우고 확인문제를 풀지 않는 방식",
];

export function ResultScreen({
  result,
  savedCount,
  summaryRef,
  onRestart,
  onOpenSaved,
  onSave,
  onCopy,
  onExportImage,
}: ResultScreenProps) {
  const [activeTab, setActiveTab] = useState<ResultTab>("summary");
  const [promptInputs, setPromptInputs] = useState<PromptInputs>({});
  const content = LEARNING_TYPE_CONTENT[result.primaryType];
  const detailedReport = useMemo(() => buildDetailedReport(result), [result]);
  const prompt = useMemo(() => buildAiPrompt(result, promptInputs), [promptInputs, result]);
  const growthAxis = getMainGrowthAxis(result);

  return (
    <section className="result-shell" aria-labelledby="result-title">
      <aside className="result-nav" aria-label="결과 상세 메뉴">
        <div className="result-nav__brand">
          <span className="result-nav__icon">
            <GraduationCap size={24} weight="duotone" />
          </span>
          <span>학습 코치</span>
        </div>
        <div className="result-tab-list">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                className={activeTab === tab.id ? "result-tab is-active" : "result-tab"}
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} weight="duotone" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </aside>
      <div className="result-main">
        <div className="result-top-actions">
          <button className="secondary-button secondary-button--compact" type="button" onClick={onRestart}>
            다시 진단
          </button>
          <button className="secondary-button secondary-button--compact" type="button" onClick={onOpenSaved}>
            저장된 결과 {savedCount}
          </button>
        </div>
        {activeTab === "summary" && (
          <div className="summary-stack">
            <article className="summary-card" ref={summaryRef}>
              <div className="summary-hero">
                <div className="summary-hero__icon" aria-hidden="true">
                  <IllustrationImage name="resultChecklist" className="illustration-image--summary" />
                </div>
                <div>
                  <p>현재 답변 기준의 학습 성향은</p>
                  <h2 id="result-title">{LEARNING_TYPE_NAMES[result.primaryType]}</h2>
                  <span>{getPrimarySentence(result)}</span>
                </div>
                <div className="student-badge" aria-hidden="true">
                  <IllustrationImage name="resultStudent" className="illustration-image--student" />
                </div>
              </div>
              <p className="summary-note">
                {content.summary} 결과는 고정된 성격이나 능력이 아니라, 다음 학습전략을
                고르는 데 도움을 주기 위한 참고 자료입니다.
              </p>
              <AxisBars scores={result.axisScores} labels={result.axisLabels} compact />
              <p className="basis-note">위 결과는 현재 응답 기준의 참고 자료입니다.</p>
            </article>

            <div className="summary-grid">
              <InfoTile
                icon={Star}
                title="나의 강점"
                body={getStrengthSummary(result)}
                tone="blue"
              />
              <InfoTile
                icon={WarningCircle}
                title="주의할 점"
                body={getCautionSummary(result)}
                tone="warm"
              />
              <InfoTile
                icon={BookOpenText}
                title="추천 학습법"
                body={content.recommendedMethods.slice(0, 3).join(", ")}
                tone="green"
              />
            </div>

            <article className="mission-strip">
              <div>
                <span>이번에 키워볼 성장 포인트</span>
                <strong>{getGrowthSummary(result)}</strong>
              </div>
              <Target size={42} weight="duotone" />
            </article>
            <button className="primary-button primary-button--wide" type="button" onClick={() => setActiveTab("report")}>
              자세히 보기
            </button>
          </div>
        )}

        {activeTab === "report" && (
          <Panel title={getDisplayName(result)} icon={FileText}>
            <p className="type-pill">대표 성향: {content.name}</p>
            <p>{content.description}</p>
            <p className="safe-copy">
              이 결과는 현재 답변 기준의 참고 자료입니다. 고정된 성격이나 능력이 아니라,
              지금의 학습 습관과 선호를 바탕으로 한 코칭 출발점입니다.
            </p>
            <div className="report-text">
              <pre>{detailedReport}</pre>
            </div>
            <button className="primary-button" type="button" onClick={() => onCopy(detailedReport, "상세 리포트")}>
              <Copy size={18} weight="bold" /> 상세 리포트 복사
            </button>
          </Panel>
        )}

        {activeTab === "axes" && (
          <Panel title="5개 축 해석" icon={ChartBar}>
            <AxisBars scores={result.axisScores} labels={result.axisLabels} />
            <div className="axis-detail-list">
              {AXES.map((axis) => (
                <article className="axis-detail" key={axis}>
                  <span className="axis-detail__badge">{result.axisLabels[axis]}</span>
                  <div>
                    <h3>{AXIS_NAMES[axis]}</h3>
                    <p>{AXIS_DESCRIPTIONS[axis]}</p>
                    <small>{AXIS_LABEL_MESSAGES[result.axisLabels[axis]]}</small>
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        )}

        {activeTab === "strategy" && (
          <Panel title="나에게 맞을 가능성이 높은 학습 전략" icon={Lightbulb}>
            <div className="strategy-grid">
              {content.recommendedMethods.map((method) => (
                <article className="strategy-card" key={method}>
                  <CheckCircle size={22} weight="fill" />
                  <span>{method}</span>
                </article>
              ))}
            </div>
            <div className="soft-callout">
              <ListChecks size={28} weight="duotone" />
              <p>계획 - 실행 - 점검의 순환을 만들면 더 효과적이에요.</p>
            </div>
          </Panel>
        )}

        {activeTab === "avoid" && (
          <Panel title="피하면 좋은 학습 방식" icon={WarningCircle}>
            <p>
              아래 내용은 단점 목록이 아니라, 현재 답변 기준에서 공부가 더 쉬워지도록 조심해볼
              지점입니다.
            </p>
            <div className="avoid-list">
              {[...content.cautions, ...avoidMethods].map((method) => (
                <article className="avoid-card" key={method}>
                  <ShieldCheck size={22} weight="duotone" />
                  <span>{method}</span>
                </article>
              ))}
            </div>
          </Panel>
        )}

        {activeTab === "mission" && (
          <Panel title="다음 수업 성장 미션" icon={Target}>
            <div className="growth-focus">
              <span>{AXIS_NAMES[growthAxis]}</span>
              <h3>{content.growthMission}</h3>
              <p>{AXIS_DESCRIPTIONS[growthAxis]}</p>
            </div>
            <div className="mission-steps">
              <article>
                <strong>1</strong>
                <span>오늘 할 목표 1개만 정하기</span>
              </article>
              <article>
                <strong>2</strong>
                <span>30분 안에 해볼 순서 만들기</span>
              </article>
              <article>
                <strong>3</strong>
                <span>끝나고 질문 1개 남기기</span>
              </article>
            </div>
          </Panel>
        )}

        {activeTab === "prompt" && (
          <PromptBuilder
            inputs={promptInputs}
            prompt={prompt}
            onInputsChange={setPromptInputs}
            onCopy={() => onCopy(prompt, "AI 프롬프트")}
          />
        )}

        {activeTab === "save" && (
          <Panel title="저장 및 내보내기" icon={FloppyDisk}>
            <p className="safe-copy">
              결과와 메모는 서버로 전송되지 않습니다. 저장 기능을 사용할 경우 이 기기의
              브라우저에만 저장되므로, 공용 태블릿에서는 사용 후 삭제해주세요.
            </p>
            <div className="save-actions">
              <button
                className="primary-button"
                type="button"
                onClick={() => onSave(promptInputs.memo ?? "", Boolean(promptInputs.includeMemo))}
              >
                <FloppyDisk size={18} weight="bold" /> 결과 저장
              </button>
              <button className="secondary-button" type="button" onClick={onExportImage}>
                <DownloadSimple size={18} weight="bold" /> 결과 이미지 저장
              </button>
              <button className="secondary-button" type="button" onClick={() => onCopy(detailedReport, "상세 리포트")}>
                <Copy size={18} weight="bold" /> 리포트 복사
              </button>
            </div>
            <p className="basis-note">
              이미지 저장이 어려우면 AI 프롬프트 복사 또는 상세 리포트 복사를 사용하세요.
            </p>
          </Panel>
        )}
      </div>
    </section>
  );
}

function InfoTile({
  icon: Icon,
  title,
  body,
  tone,
}: {
  icon: typeof Star;
  title: string;
  body: string;
  tone: "blue" | "warm" | "green";
}) {
  return (
    <article className={`info-tile info-tile--${tone}`}>
      <span>
        <Icon size={22} weight="duotone" />
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof House;
  children: ReactNode;
}) {
  return (
    <article className="detail-panel">
      <div className="panel-heading">
        <span className="panel-icon">
          <Icon size={30} weight="duotone" />
        </span>
        <h2>{title}</h2>
      </div>
      {children}
    </article>
  );
}
