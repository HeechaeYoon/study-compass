import { useMemo, useState, type ReactNode, type RefObject } from "react";
import {
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

import {
  LEARNING_TYPE_CONTENT,
  LEARNING_TYPE_NAMES,
  type LearningTypeContent,
} from "../data/learningTypes";
import type { PromptInputs } from "../lib/promptBuilder";
import { buildAiPrompt } from "../lib/promptBuilder";
import {
  buildDetailedReport,
  buildDetailedReportModel,
  getPrimarySentence,
  type DetailedReportModel,
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
  | "prompt"
  | "save";

const tabs: { id: ResultTab; label: string; icon: typeof House }[] = [
  { id: "summary", label: "요약", icon: House },
  { id: "report", label: "전체 리포트", icon: FileText },
  { id: "prompt", label: "AI 프롬프트", icon: Robot },
  { id: "save", label: "저장/내보내기", icon: FloppyDisk },
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
  const reportModel = useMemo(() => buildDetailedReportModel(result), [result]);
  const prompt = useMemo(() => buildAiPrompt(result, promptInputs), [promptInputs, result]);

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
          {activeTab === "summary" && (
            <button className="primary-button result-export-button" type="button" onClick={onExportImage}>
              <DownloadSimple size={18} weight="bold" /> 결과 이미지 저장
            </button>
          )}
          <button className="secondary-button secondary-button--compact" type="button" onClick={onRestart}>
            다시 진단
          </button>
          <button className="secondary-button secondary-button--compact" type="button" onClick={onOpenSaved}>
            저장된 결과 {savedCount}
          </button>
        </div>
        {activeTab === "summary" && (
          <div className="summary-stack">
            <ResultSummaryCard result={result} content={content} titleId="result-title" />

            <ResultSummaryHighlights content={content} />
            <button className="primary-button primary-button--wide" type="button" onClick={() => setActiveTab("report")}>
              전체 리포트 보기
            </button>
          </div>
        )}

        {activeTab === "report" && (
          <Panel title={reportModel.title} icon={FileText}>
            <DetailedReportView
              report={reportModel}
              detailedReport={detailedReport}
              onCopy={onCopy}
            />
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
      <div className="export-capture-layer" aria-hidden="true">
        <div className="summary-export-card" ref={summaryRef}>
          <ResultSummaryCard result={result} content={content} />
          <ResultSummaryHighlights content={content} />
        </div>
      </div>
    </section>
  );
}

function ResultSummaryCard({
  result,
  content,
  summaryRef,
  titleId,
}: {
  result: Result;
  content: LearningTypeContent;
  summaryRef?: RefObject<HTMLDivElement | null>;
  titleId?: string;
}) {
  return (
    <article className="summary-card" ref={summaryRef}>
      <div className="summary-hero">
        <div className="summary-hero__icon" aria-hidden="true">
          <IllustrationImage name="resultChecklist" className="illustration-image--summary" />
        </div>
        <div>
          <p>현재 답변 기준의 학습 성향은</p>
          <h2 id={titleId}>{LEARNING_TYPE_NAMES[result.primaryType]}</h2>
          <span>{getPrimarySentence(result)}</span>
        </div>
        <div className="student-badge" aria-hidden="true">
          <IllustrationImage name="resultStudent" className="illustration-image--student" />
        </div>
      </div>
      <p className="summary-note">
        {content.summary} 결과는 고정된 성격이나 능력이 아니라, 다음 학습전략을 고르는 데
        도움을 주기 위한 참고 자료입니다.
      </p>
      <AxisBars scores={result.axisScores} labels={result.axisLabels} compact />
      <p className="basis-note">위 결과는 현재 응답 기준의 참고 자료입니다.</p>
    </article>
  );
}

function ResultSummaryHighlights({ content }: { content: LearningTypeContent }) {
  return (
    <div className="summary-grid">
      <InfoTile icon={Star} title="핵심 강점" body={content.strengths[0]} tone="blue" />
      <InfoTile icon={Target} title="오늘 실행할 성장 행동" body={content.growthMission} tone="green" />
    </div>
  );
}

function DetailedReportView({
  report,
  detailedReport,
  onCopy,
}: {
  report: DetailedReportModel;
  detailedReport: string;
  onCopy: (text: string, label: string) => void;
}) {
  return (
    <div className="detailed-report">
      <section className="report-hero">
        <div>
          <p className="type-pill">대표 성향: {report.primaryName}</p>
          <h3>{report.primaryName}</h3>
          <p>{report.overview}</p>
          {report.secondaryNote && <p className="report-secondary-note">{report.secondaryNote}</p>}
        </div>
        <div className="report-method-note">
          <ShieldCheck size={26} weight="duotone" />
          <p>{report.methodNote}</p>
        </div>
      </section>

      <section className="report-evidence" aria-label="진단 근거">
        {report.evidenceCards.map((item) => (
          <div className="report-evidence__item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.body}</p>
          </div>
        ))}
      </section>

      <section className="report-section">
        <div className="report-section-heading">
          <Star size={24} weight="duotone" />
          <div>
            <h3>잘 작동하는 강점</h3>
            <p>{report.strengthSummary}</p>
          </div>
        </div>
        <p>{report.typeGuide.strengthDetail}</p>
      </section>

      <section className="report-section">
        <div className="report-section-heading">
          <WarningCircle size={24} weight="duotone" />
          <div>
            <h3>조심하면 더 좋아지는 지점</h3>
            <p>{report.cautionSummary}</p>
          </div>
        </div>
        <p>{report.typeGuide.cautionDetail}</p>
      </section>

      <section className="report-section">
        <div className="report-section-heading">
          <Lightbulb size={24} weight="duotone" />
          <div>
            <h3>나에게 맞을 가능성이 높은 학습 전략</h3>
            <p>현재 답변 기준에서 바로 시도하기 좋은 방법입니다.</p>
          </div>
        </div>
        <div className="strategy-grid">
          {report.recommendedMethods.map((method) => (
            <article className="strategy-card" key={method}>
              <CheckCircle size={22} weight="fill" />
              <span>{method}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="report-section">
        <div className="report-section-heading">
          <ChartBar size={24} weight="duotone" />
          <div>
            <h3>5개 축별 심층 해석</h3>
            <p>점수는 현재 응답에서 해당 전략이 얼마나 자주 드러났는지를 보여줍니다.</p>
          </div>
        </div>
        <div className="report-axis-list">
          {report.axisInsights.map((axis) => (
            <article className="report-axis-row" key={axis.axis}>
              <div className="report-axis-score">
                <strong>{axis.score}</strong>
                <span>점</span>
              </div>
              <div className="report-axis-body">
                <div className="report-axis-title">
                  <h4>{axis.name}</h4>
                  <span className={`axis-label axis-label--${axis.label.replace(" ", "-")}`}>
                    {axis.label}
                  </span>
                </div>
                <p className="report-axis-description">{axis.description}</p>
                <p>{axis.meaning}</p>
                <strong>{axis.action}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="report-section report-section--growth">
        <div className="report-section-heading">
          <Target size={24} weight="duotone" />
          <div>
            <h3>오늘 바로 써볼 학습 처방</h3>
            <p>{report.typeGuide.coachFocus}</p>
          </div>
        </div>
        <ol className="report-routine-list">
          {report.typeGuide.routine.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="report-section">
        <div className="report-section-heading">
          <ListChecks size={24} weight="duotone" />
          <div>
            <h3>성장 미션과 점검 질문</h3>
            <p>{report.growthFocus}</p>
          </div>
        </div>
        <p className="report-mission-text">{report.growthMission}</p>
        <ul className="report-question-list">
          {report.selfCheckQuestions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="report-copy-row">
        <p>공유나 기록이 필요할 때는 화면 내용을 텍스트 리포트로 복사할 수 있어요.</p>
        <button className="primary-button" type="button" onClick={() => onCopy(detailedReport, "상세 리포트")}>
          <Copy size={18} weight="bold" /> 상세 리포트 복사
        </button>
      </div>
    </div>
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
