import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  EnvelopeSimple,
  House,
  Info,
  Sparkle,
  X,
} from "@phosphor-icons/react";

import { QUESTIONS_16 } from "./data/questions";
import { copyText } from "./lib/clipboard";
import { exportNodeAsPng } from "./lib/imageExport";
import { generateResult } from "./lib/scoring";
import {
  clearSavedResults,
  deleteSavedResult,
  loadSavedResults,
  saveResult,
} from "./lib/storage";
import type { LikertValue, Result, SavedResult } from "./types";
import { QuestionScreen } from "./components/QuestionScreen";
import { ResultScreen } from "./components/ResultScreen";
import { SavedResultPanel } from "./components/SavedResultPanel";
import { StartScreen } from "./components/StartScreen";

type Screen = "start" | "question" | "result" | "saved";
type ConfirmState =
  | { type: "delete"; savedAt: string }
  | { type: "clear" }
  | null;

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [nickname, setNickname] = useState("");
  const [answers, setAnswers] = useState<Record<string, LikertValue | string>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [toast, setToast] = useState("");
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSavedResults(loadSavedResults());
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  const question = QUESTIONS_16[questionIndex];
  const stageClass = useMemo(() => {
    if (screen === "result") return "stage stage--wide";
    if (screen === "saved") return "stage stage--saved";
    return "stage";
  }, [screen]);

  const startDiagnosis = () => {
    setAnswers({});
    setQuestionIndex(0);
    setResult(null);
    setScreen("question");
  };

  const moveNext = () => {
    if (questionIndex < QUESTIONS_16.length - 1) {
      setQuestionIndex((index) => index + 1);
      return;
    }

    try {
      const nextResult = generateResult(answers, nickname);
      setResult(nextResult);
      setScreen("result");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "응답을 확인해주세요.");
    }
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await copyText(text);
      setToast(`${label}를 복사했어요.`);
    } catch {
      setToast("복사가 어려워요. 텍스트를 직접 선택해 복사해주세요.");
    }
  };

  const handleSave = (memo: string, includeMemoInPrompt: boolean) => {
    if (!result) return;
    try {
      const saved = saveResult(result, memo, includeMemoInPrompt);
      setSavedResults(loadSavedResults());
      setToast(`${saved.nickname ? `${saved.nickname}님의 ` : ""}결과를 저장했어요.`);
    } catch {
      setToast("저장이 어려워요. 브라우저 저장 설정을 확인해주세요.");
    }
  };

  const handleExportImage = async () => {
    if (!summaryRef.current) return;
    try {
      await exportNodeAsPng(summaryRef.current, "self-directed-learning-result.png");
      setToast("결과 요약 이미지를 저장했어요.");
    } catch {
      setToast("이미지 저장이 어려워요. 프롬프트나 리포트 복사를 사용해주세요.");
    }
  };

  const handleConfirm = () => {
    if (!confirmState) return;
    try {
      if (confirmState.type === "clear") {
        clearSavedResults();
        setToast("저장된 결과를 모두 삭제했어요.");
      } else {
        deleteSavedResult(confirmState.savedAt);
        setToast("저장된 결과를 삭제했어요.");
      }
      setSavedResults(loadSavedResults());
    } catch {
      setToast("삭제가 어려워요. 브라우저 저장 설정을 확인해주세요.");
    } finally {
      setConfirmState(null);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>자기주도학습 성향 진단 앱</h1>
          <p>중학교 2학년 대상 · 자기이해와 성장 중심 · 현재 답변 기준</p>
        </div>
      </header>

      <main className={stageClass}>
        {screen === "start" && (
          <StartScreen
            nickname={nickname}
            savedCount={savedResults.length}
            onNicknameChange={setNickname}
            onStart={startDiagnosis}
            onOpenSaved={() => setScreen("saved")}
          />
        )}

        {screen === "question" && (
          <QuestionScreen
            question={question}
            currentIndex={questionIndex}
            total={QUESTIONS_16.length}
            answer={answers[question.id]}
            onAnswer={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
            onPrev={() => setQuestionIndex((index) => Math.max(0, index - 1))}
            onNext={moveNext}
          />
        )}

        {screen === "result" && result && (
          <ResultScreen
            result={result}
            savedCount={savedResults.length}
            summaryRef={summaryRef}
            onRestart={startDiagnosis}
            onOpenSaved={() => setScreen("saved")}
            onSave={handleSave}
            onCopy={handleCopy}
            onExportImage={handleExportImage}
          />
        )}

        {screen === "saved" && (
          <SavedResultPanel
            results={savedResults}
            onBack={() => setScreen(result ? "result" : "start")}
            onRestart={startDiagnosis}
            onView={(selected) => {
              setResult(selected);
              setScreen("result");
            }}
            onDelete={(savedAt) => setConfirmState({ type: "delete", savedAt })}
            onClear={() => setConfirmState({ type: "clear" })}
          />
        )}
      </main>

      <footer className="app-footer">
        <button type="button" onClick={() => setScreen("start")}>
          <House size={20} weight="duotone" /> 홈
        </button>
        <button type="button" onClick={() => setGuideOpen(true)}>
          <Info size={20} weight="duotone" /> 사용 안내
        </button>
        <button type="button" onClick={() => setFeedbackOpen(true)}>
          <EnvelopeSimple size={20} weight="duotone" /> 문의/피드백
        </button>
      </footer>

      {toast && (
        <div className="toast" role="status">
          <Sparkle size={18} weight="fill" /> {toast}
        </div>
      )}

      {confirmState && (
        <Dialog title="삭제할까요?" onClose={() => setConfirmState(null)}>
          <p>
            {confirmState.type === "clear"
              ? "이 기기에 저장된 결과를 모두 삭제합니다."
              : "선택한 저장 결과를 이 기기에서 삭제합니다."}
          </p>
          <div className="dialog-actions">
            <button className="secondary-button" type="button" onClick={() => setConfirmState(null)}>
              취소
            </button>
            <button className="danger-button" type="button" onClick={handleConfirm}>
              삭제
            </button>
          </div>
        </Dialog>
      )}

      {guideOpen && (
        <Dialog title="사용 안내" onClose={() => setGuideOpen(false)}>
          <ul className="dialog-list">
            <li>이 앱은 나를 평가하거나 비교하기 위한 도구가 아닙니다.</li>
            <li>결과는 현재 답변 기준의 자기주도학습 전략 참고 자료입니다.</li>
            <li>답변, 결과, 메모는 서버로 전송되지 않습니다.</li>
            <li>공용 기기에서는 저장된 결과를 사용 후 삭제해주세요.</li>
          </ul>
        </Dialog>
      )}

      {feedbackOpen && (
        <Dialog title="문의/피드백" onClose={() => setFeedbackOpen(false)}>
          <p>
            수업 중 문항 표현이 어렵거나 결과 문구가 어색하게 느껴지면 선생님께 알려주세요.
            실제 학생 반응을 보고 문항과 설명을 조정할 수 있습니다.
          </p>
        </Dialog>
      )}
    </div>
  );
}

function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog-header">
          <h2 id="dialog-title">{title}</h2>
          <button className="icon-button" type="button" aria-label="닫기" onClick={onClose}>
            <X size={20} weight="bold" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
