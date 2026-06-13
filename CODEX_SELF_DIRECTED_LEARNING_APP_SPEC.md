# Codex Implementation Brief: 자기주도학습 성향 진단 웹앱

> 대상: Codex / AI coding agent  
> 목적: 중학교 2학년 자기주도학습 수업용 정적 웹앱 구현  
> 기본 구현 범위: GitHub Pages 배포 가능한 React + Vite + TypeScript 정적 웹앱  
> 중요: 이 앱은 심리검사나 성격검사가 아니라, 현재 응답 기준으로 자기주도학습 전략을 찾기 위한 자기이해 활동 도구다.

---

## 0. Codex 작업 방식 지시

이 문서를 기준으로 구현하라.

### 반드시 지킬 것

- 사용자가 추가 지시하지 않는 한 **16문항 기본형**을 먼저 구현한다.
- 서버 API, DB, 로그인, 외부 AI 호출을 만들지 않는다.
- 학생의 답변, 결과, 메모를 외부로 전송하지 않는다.
- 모든 점수 계산, 유형 매칭, 결과 문구 생성은 브라우저 내부에서 수행한다.
- 결과는 “현재 답변 기준”이라는 표현을 반복해서 사용한다.
- 학생을 고정된 유형으로 단정하는 표현을 쓰지 않는다.
- 낮은 축은 “부족”이 아니라 “성장 포인트”라고 표시한다.
- 구현 후 점수 계산과 유형 매칭 로직은 반드시 테스트한다.
- 기존 repo에 코드가 있으면 먼저 구조를 파악하고, 불필요한 대규모 리팩터링을 피한다.

### 하지 말 것

- MBTI식 성격 유형처럼 보이게 만들지 말 것.
- 시각형/청각형/운동감각형 학습스타일 분류를 사용하지 말 것.
- 동물 유형, 캐릭터 유형처럼 유치한 결과명을 쓰지 말 것.
- 외부 분석 스크립트, 광고, 트래킹 코드를 넣지 말 것.
- 결과 숫자를 학생 화면에서 과도하게 강조하지 말 것.
- 학생 간 비교, 등급, 순위 기능을 만들지 말 것.

---

## 1. 앱 목표

중학교 2학년 학생이 객관식 문항에 답하면 다음을 확인할 수 있게 한다.

1. 현재 답변 기준으로 가장 가까운 학습 성향
2. 5개 자기주도학습 축의 현재 상태
3. 나의 강점
4. 주의할 점
5. 가장 중요한 성장 포인트
6. 나에게 맞을 가능성이 높은 학습법
7. 다음 수업에서 Gemini 같은 AI 챗봇에 붙여넣을 수 있는 구체 프롬프트

앱의 본질은 학생 분류가 아니라 다음 질문을 돕는 것이다.

- 나는 어떤 방식으로 공부할 때 잘 되는 편인가?
- 나는 어떤 부분을 보완하면 자기주도학습이 더 쉬워질까?
- AI에게 내 상황을 어떻게 설명하면 나에게 맞는 공부법을 추천받을 수 있을까?

---

## 2. 기술 스택과 배포 전제

### 기본 스택

- React
- Vite
- TypeScript
- CSS Modules 또는 plain CSS
- Vitest

### 선택 라이브러리

- 결과 이미지 저장이 필요하면 `html-to-image` 사용 가능
- 무거운 UI 컴포넌트 라이브러리는 사용하지 않는다

### 배포

- GitHub Pages 정적 배포
- 가능하면 `vite.config.ts`에서 `base: "./"`를 사용해 repo path 의존성을 줄인다
- 라우터는 사용하지 않거나 hash 기반만 사용한다
- 새로고침해도 blank page가 발생하지 않게 한다

### 데이터 저장

- `localStorage`만 사용
- 저장 전 안내 표시
- 삭제 기능 제공
- 공용 태블릿에서 저장 결과가 남을 수 있음을 안내

---

## 3. 권장 파일 구조

```text
src/
  App.tsx
  main.tsx
  styles/
    global.css
  data/
    questions.ts
    learningTypes.ts
  lib/
    scoring.ts
    resultText.ts
    promptBuilder.ts
    storage.ts
    clipboard.ts
    imageExport.ts
  components/
    StartScreen.tsx
    PrivacyNotice.tsx
    QuestionScreen.tsx
    ProgressBar.tsx
    ResultScreen.tsx
    AxisBars.tsx
    ReportSection.tsx
    PromptBuilder.tsx
    SavedResultPanel.tsx
  tests/
    scoring.test.ts
    promptBuilder.test.ts
```

파일 구조는 기존 repo 상황에 맞게 조정해도 된다. 단, 점수 계산과 문구 생성 로직은 컴포넌트에서 분리하라.

---

## 4. 핵심 도메인 타입

```ts
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
```

---

## 5. 5개 축 정의

| 코드 | 학생 화면 이름 | 학생용 정의 | 내부 의미 |
|---|---|---|---|
| P | 계획 세우기 | 목표를 정하고 공부 순서를 잡는 힘 | 목표설정, 전략계획, 시간·분량 계획 |
| E | 실행 유지하기 | 시작한 공부를 집중해서 이어가는 힘 | 자기통제, 주의집중, 노력조절 |
| U | 이해 방법 찾기 | 나에게 맞는 방식으로 개념을 이해하는 힘 | 정교화, 조직화, 자기설명, 예시화 |
| M | 점검하고 고치기 | 공부가 잘 되고 있는지 확인하고 방법을 수정하는 힘 | 메타인지 점검, 자기평가, 오류 분석 |
| H | 질문과 도움 활용하기 | 막힐 때 자료, 친구, 선생님, AI를 적절히 활용하는 힘 | 도움요청, 동료학습, 자원활용 |

---

## 6. 문항 데이터

### 6.1 동의형 선택지

```ts
export const LIKERT_OPTIONS = [
  { value: 1, label: "전혀 아니다" },
  { value: 2, label: "별로 아니다" },
  { value: 3, label: "대체로 그렇다" },
  { value: 4, label: "매우 그렇다" },
] as const;
```

### 6.2 16문항 기본형

```ts
export const QUESTIONS_16: Question[] = [
  {
    id: "Q01",
    type: "likert",
    axis: "P",
    text: "공부를 시작하기 전에 오늘 끝낼 목표를 짧게 정하는 편이다.",
  },
  {
    id: "Q02",
    type: "likert",
    axis: "P",
    text: "해야 할 공부가 여러 개 있으면 무엇부터 할지 순서를 정하고 시작한다.",
  },
  {
    id: "Q03",
    type: "likert",
    axis: "P",
    text: "공부할 양이 많아 보이면 작은 단위로 나누어 시작한다.",
  },
  {
    id: "Q04",
    type: "likert",
    axis: "E",
    text: "공부를 시작하면 정한 시간 동안 다른 일을 줄이려고 노력한다.",
  },
  {
    id: "Q05",
    type: "likert",
    axis: "E",
    text: "하기 싫은 과목도 최소한 정한 분량은 끝내려고 한다.",
  },
  {
    id: "Q06",
    type: "likert",
    axis: "E",
    text: "집중이 흐트러져도 다시 공부로 돌아오려는 나만의 방법이 있다.",
  },
  {
    id: "Q07",
    type: "likert",
    axis: "U",
    text: "새 개념을 배울 때 예시, 그림, 표, 내 말 설명 중 하나로 바꿔 이해하려고 한다.",
  },
  {
    id: "Q08",
    type: "likert",
    axis: "U",
    text: "문제를 풀 때 답만 확인하기보다 왜 그런 답이 나오는지 생각해본다.",
  },
  {
    id: "Q09",
    type: "likert",
    axis: "U",
    text: "외워야 할 내용과 이해해야 할 내용을 구분해서 공부하려고 한다.",
  },
  {
    id: "Q10",
    type: "likert",
    axis: "M",
    text: "공부 중간이나 끝에 내가 제대로 이해했는지 확인한다.",
  },
  {
    id: "Q11",
    type: "likert",
    axis: "M",
    text: "틀린 문제나 헷갈린 부분은 이유를 찾아 다음 공부 방법을 바꿔본다.",
  },
  {
    id: "Q12",
    type: "likert",
    axis: "H",
    text: "막힐 때 교과서, 필기, 친구, 선생님, AI 같은 도움을 적절히 활용한다.",
  },
  {
    id: "Q13",
    type: "scenario",
    text: "공부를 시작하기 전에 나는 보통 무엇을 먼저 하나요?",
    options: [
      {
        id: "A",
        text: "오늘 끝낼 목표와 순서를 먼저 정한다.",
        scores: { P: 3, E: 0, U: 0, M: 1, H: 0 },
      },
      {
        id: "B",
        text: "쉬운 문제 하나부터 풀면서 공부를 시작한다.",
        scores: { P: 1, E: 3, U: 0, M: 0, H: 0 },
      },
      {
        id: "C",
        text: "개념 설명이나 예시를 먼저 찾아본다.",
        scores: { P: 0, E: 0, U: 3, M: 0, H: 1 },
      },
      {
        id: "D",
        text: "아는 것과 모르는 것을 먼저 표시한다.",
        scores: { P: 1, E: 0, U: 0, M: 3, H: 0 },
      },
      {
        id: "E",
        text: "공부 방향을 친구, 선생님, AI, 자료에서 먼저 확인한다.",
        scores: { P: 0, E: 0, U: 0, M: 1, H: 3 },
      },
    ],
  },
  {
    id: "Q14",
    type: "scenario",
    text: "어려운 문제를 만났을 때 나는 주로 어떻게 하나요?",
    options: [
      {
        id: "A",
        text: "문제를 작게 나누고 풀이 순서를 세운다.",
        scores: { P: 3, E: 0, U: 0, M: 1, H: 0 },
      },
      {
        id: "B",
        text: "내가 풀 수 있는 부분부터 시도한다.",
        scores: { P: 0, E: 3, U: 0, M: 1, H: 0 },
      },
      {
        id: "C",
        text: "비슷한 예시나 개념 설명을 찾아 다시 이해한다.",
        scores: { P: 0, E: 0, U: 3, M: 0, H: 1 },
      },
      {
        id: "D",
        text: "어디에서 막혔는지 표시하고 이유를 찾는다.",
        scores: { P: 0, E: 0, U: 1, M: 3, H: 0 },
      },
      {
        id: "E",
        text: "질문을 정리해 친구, 선생님, AI에게 도움을 구한다.",
        scores: { P: 0, E: 0, U: 0, M: 1, H: 3 },
      },
    ],
  },
  {
    id: "Q15",
    type: "scenario",
    text: "시험이나 수행평가가 일주일 남았다면 나는 무엇부터 하나요?",
    options: [
      {
        id: "A",
        text: "남은 분량과 날짜를 보고 공부표를 만든다.",
        scores: { P: 3, E: 1, U: 0, M: 0, H: 0 },
      },
      {
        id: "B",
        text: "매일 정한 시간에 공부를 시작한다.",
        scores: { P: 1, E: 3, U: 0, M: 0, H: 0 },
      },
      {
        id: "C",
        text: "단원의 핵심 개념을 내 말로 연결해본다.",
        scores: { P: 0, E: 0, U: 3, M: 1, H: 0 },
      },
      {
        id: "D",
        text: "작은 테스트나 오답으로 약한 부분을 확인한다.",
        scores: { P: 0, E: 0, U: 1, M: 3, H: 0 },
      },
      {
        id: "E",
        text: "친구나 AI와 예상 질문, 퀴즈를 만들어본다.",
        scores: { P: 0, E: 0, U: 1, M: 0, H: 3 },
      },
    ],
  },
  {
    id: "Q16",
    type: "scenario",
    text: "공부를 마친 뒤 나는 보통 어떻게 하나요?",
    options: [
      {
        id: "A",
        text: "다음에 무엇을 할지 공부 순서를 고친다.",
        scores: { P: 3, E: 0, U: 0, M: 1, H: 0 },
      },
      {
        id: "B",
        text: "정한 분량을 끝냈는지 보고 남은 부분을 이어간다.",
        scores: { P: 1, E: 3, U: 0, M: 0, H: 0 },
      },
      {
        id: "C",
        text: "오늘 배운 내용을 3문장이나 예시로 설명해본다.",
        scores: { P: 0, E: 0, U: 3, M: 1, H: 0 },
      },
      {
        id: "D",
        text: "헷갈린 것과 오답 원인을 짧게 기록한다.",
        scores: { P: 0, E: 0, U: 1, M: 3, H: 0 },
      },
      {
        id: "E",
        text: "남은 질문을 정리해 자료, 친구, 선생님, AI에 물어본다.",
        scores: { P: 0, E: 0, U: 0, M: 1, H: 3 },
      },
    ],
  },
];
```

---

## 7. 점수 계산 로직

### 7.1 기본 계산

- 동의형 문항은 선택값 1~4를 해당 축에 더한다.
- 상황형 문항은 선택지의 `scores` 벡터를 더한다.
- 축별 raw score를 구한 뒤, 축별 가능한 min/max 기준으로 0~100 정규화한다.
- 축별 min/max는 하드코딩하지 말고 질문 데이터에서 자동 계산하라.

```ts
const AXES: Axis[] = ["P", "E", "U", "M", "H"];

const emptyScores = (): AxisScores => ({
  P: 0,
  E: 0,
  U: 0,
  M: 0,
  H: 0,
});
```

### 7.2 정규화 공식

```ts
normalized = Math.round(((raw - min) / (max - min)) * 100);
```

주의:

- `max === min`인 경우 0으로 나누지 않도록 방어 코드를 둔다.
- 결과는 반드시 0~100 범위로 clamp한다.

### 7.3 라벨 변환

```ts
export function toAxisLabel(score: number): AxisLabel {
  if (score >= 70) return "강점";
  if (score >= 40) return "균형";
  return "성장 포인트";
}
```

---

## 8. 대표 성향 기준 프로필

```ts
export const LEARNING_TYPE_PROFILES: Record<LearningTypeId, AxisScores> = {
  strategy_designer: { P: 85, E: 60, U: 70, M: 60, H: 55 },
  execution_driver: { P: 60, E: 85, U: 55, M: 50, H: 45 },
  concept_explorer: { P: 50, E: 50, U: 85, M: 55, H: 60 },
  reflection_grower: { P: 55, E: 55, U: 65, M: 85, H: 50 },
  resource_user: { P: 50, E: 50, U: 60, M: 60, H: 85 },
  balanced_coordinator: { P: 70, E: 70, U: 70, M: 70, H: 70 },
  routine_stabilizer: { P: 60, E: 80, U: 50, M: 65, H: 50 },
  foundation_builder: { P: 45, E: 45, U: 45, M: 45, H: 45 },
};
```

### 8.1 대표 성향 표시명

```ts
export const LEARNING_TYPE_NAMES: Record<LearningTypeId, string> = {
  strategy_designer: "전략 설계형",
  execution_driver: "실행 추진형",
  concept_explorer: "개념 탐색형",
  reflection_grower: "점검 성장형",
  resource_user: "자원 활용형",
  balanced_coordinator: "균형 조율형",
  routine_stabilizer: "루틴 안정형",
  foundation_builder: "기반 정리형",
};
```

---

## 9. 유형 매칭 알고리즘

### 9.1 우선 규칙

```ts
const mean = average(Object.values(axisScores));
const sd = standardDeviation(Object.values(axisScores));
const maxScore = Math.max(...Object.values(axisScores));

if (mean < 50 && maxScore < 60) {
  primaryType = "foundation_builder";
} else if (sd < 8 && mean >= 60) {
  primaryType = "balanced_coordinator";
} else {
  // prototype matching
}
```

### 9.2 거리 기반 매칭

```ts
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
```

### 9.3 보조 성향 처리

- 1위와 2위의 similarity 차이가 `0.03` 미만이면 secondaryType 표시
- 또는 1위와 2위의 distance 차이가 `5` 미만이면 secondaryType 표시
- 대표 성향은 항상 하나만 표시
- 보조 성향은 설명 문장에만 반영

문구 예:

```text
현재 답변 기준으로는 “전략 설계형”에 가장 가깝고, “개념 탐색형”의 특징도 일부 보여요.
```

---

## 10. 성향별 결과 문구 데이터

구현 편의를 위해 성향별 문구는 `src/data/learningTypes.ts`에 객체로 관리한다.

```ts
export type LearningTypeContent = {
  name: string;
  summary: string;
  description: string;
  strengths: string[];
  cautions: string[];
  recommendedMethods: string[];
  growthMission: string;
};
```

### 10.1 성향별 콘텐츠

```ts
export const LEARNING_TYPE_CONTENT: Record<LearningTypeId, LearningTypeContent> = {
  strategy_designer: {
    name: "전략 설계형",
    summary: "공부를 시작하기 전에 방향과 순서를 잡을 때 강점이 잘 드러나요.",
    description:
      "공부를 시작하기 전에 길을 먼저 그리는 지도 제작자처럼 목표와 순서를 정할 때 강점이 드러납니다.",
    strengths: [
      "목표와 순서를 정리하기 좋습니다.",
      "공부할 양이 많을 때 작게 나누어 시작하기 좋습니다.",
      "개념 이해와 계획을 연결하기 쉽습니다.",
    ],
    cautions: [
      "계획을 세우는 데 시간이 길어지면 실행이 늦어질 수 있습니다.",
      "이해했다고 느껴도 확인문제를 풀지 않으면 빈틈이 남을 수 있습니다.",
    ],
    recommendedMethods: [
      "오늘 목표 1개 쓰기",
      "공부 순서 3단계로 나누기",
      "25분 실행 블록 사용하기",
      "마지막 5분에 확인문제 풀기",
    ],
    growthMission:
      "오늘 공부할 단원에서 목표 1개, 순서 3개만 정하고 바로 시작해보세요.",
  },

  execution_driver: {
    name: "실행 추진형",
    summary: "일단 시작하고 정한 분량을 밀고 나가는 힘이 좋아요.",
    description:
      "생각이 너무 길어지기보다 일단 움직이면서 공부의 속도를 만드는 편입니다.",
    strengths: [
      "공부를 시작하는 힘이 좋습니다.",
      "정한 분량을 끝까지 밀고 가는 데 강점이 있습니다.",
      "짧은 루틴을 만들면 빠르게 성과를 낼 수 있습니다.",
    ],
    cautions: [
      "왜 틀렸는지 점검하지 않으면 같은 실수가 반복될 수 있습니다.",
      "속도에 집중하다 보면 개념 이해가 얕아질 수 있습니다.",
    ],
    recommendedMethods: [
      "타이머 공부",
      "최소분량 루틴",
      "공부 후 5분 오답 점검",
      "틀린 이유 한 줄 기록",
    ],
    growthMission:
      "공부 후 마지막 5분에 틀린 이유 1개를 적어보세요.",
  },

  concept_explorer: {
    name: "개념 탐색형",
    summary: "개념을 여러 방식으로 이해하려는 탐색력이 좋아요.",
    description:
      "개념을 예시, 그림, 내 말 설명 등으로 바꾸며 이해하려는 힘이 좋습니다.",
    strengths: [
      "개념을 깊이 이해하려는 태도가 있습니다.",
      "예시와 설명을 활용해 내용을 연결하기 좋습니다.",
      "새로운 관점으로 문제를 바라볼 수 있습니다.",
    ],
    cautions: [
      "탐색이 길어지면 문제풀이와 마무리가 늦어질 수 있습니다.",
      "이해한 느낌만으로 넘어가면 실제 문제에서 막힐 수 있습니다.",
    ],
    recommendedMethods: [
      "자기설명",
      "예시 만들기",
      "개념도 그리기",
      "개념 정리 후 확인문제 풀기",
    ],
    growthMission:
      "개념 정리 15분 후 바로 확인문제 3개를 풀어보세요.",
  },

  reflection_grower: {
    name: "점검 성장형",
    summary: "공부가 잘 되고 있는지 확인하고 고치는 힘이 좋아요.",
    description:
      "공부가 잘 되고 있는지 확인하고 방법을 고치는 데 강점이 있습니다.",
    strengths: [
      "오답 원인을 찾는 힘이 있습니다.",
      "공부 방법을 수정하려는 태도가 있습니다.",
      "작은 테스트나 확인 활동과 잘 맞습니다.",
    ],
    cautions: [
      "점검이 많아지면 자신감이 떨어질 수 있습니다.",
      "완벽하게 고치려다 공부 속도가 느려질 수 있습니다.",
    ],
    recommendedMethods: [
      "오답 원인 3분류",
      "미니 테스트",
      "학습 후 자기점검 질문",
      "다음 공부 방법 한 가지 수정",
    ],
    growthMission:
      "오답마다 실수, 개념 부족, 문제 읽기 중 하나로 표시해보세요.",
  },

  resource_user: {
    name: "자원 활용형",
    summary: "막힐 때 필요한 자료와 도움을 찾는 힘이 좋아요.",
    description:
      "혼자만 버티지 않고 필요한 자료, 사람, AI를 활용하는 힘이 좋습니다.",
    strengths: [
      "모르는 부분을 해결하기 위해 도움을 찾을 수 있습니다.",
      "친구, 선생님, 자료, AI를 학습에 활용하기 좋습니다.",
      "질문을 통해 공부 방향을 빠르게 잡을 수 있습니다.",
    ],
    cautions: [
      "바로 답을 받으면 스스로 생각하는 시간이 줄어들 수 있습니다.",
      "질문이 vague하면 원하는 도움을 받기 어렵습니다.",
    ],
    recommendedMethods: [
      "3분 혼자 시도 후 질문하기",
      "내가 아는 것과 막힌 곳 나누기",
      "AI 답변을 그대로 믿지 말고 확인문제 풀기",
      "질문 템플릿 사용하기",
    ],
    growthMission:
      "질문 전에 내가 아는 것과 막힌 곳을 한 줄씩 써보세요.",
  },

  balanced_coordinator: {
    name: "균형 조율형",
    summary: "여러 학습전략을 상황에 맞게 조율하는 편이에요.",
    description:
      "한쪽에 치우치기보다 여러 전략을 상황에 맞게 섞어 쓰는 편입니다.",
    strengths: [
      "여러 학습전략을 비교적 고르게 사용할 수 있습니다.",
      "과목과 상황에 따라 방법을 바꿀 수 있습니다.",
      "자기주도학습의 기본 균형이 좋습니다.",
    ],
    cautions: [
      "뚜렷한 성장 초점이 흐려질 수 있습니다.",
      "잘하는 축이 많아도 한 가지 약한 축을 놓칠 수 있습니다.",
    ],
    recommendedMethods: [
      "단원별 전략 선택표",
      "주간 점검",
      "가장 낮은 축 하나 집중하기",
      "학습 후 다음 전략 고르기",
    ],
    growthMission:
      "이번 주에는 가장 낮은 축 하나만 골라 미션 1개를 실천해보세요.",
  },

  routine_stabilizer: {
    name: "루틴 안정형",
    summary: "정한 흐름을 유지하고 반복하면서 안정적으로 공부하는 편이에요.",
    description:
      "정한 흐름을 유지하며 반복할 때 공부가 안정적으로 이어지는 편입니다.",
    strengths: [
      "반복과 꾸준함에 강점이 있습니다.",
      "정해진 시간과 분량을 지키기 좋습니다.",
      "복습 루틴을 만들면 효과를 보기 쉽습니다.",
    ],
    cautions: [
      "새로운 방식으로 이해하거나 질문하는 데 소극적일 수 있습니다.",
      "반복만 하고 이해 점검을 놓칠 수 있습니다.",
    ],
    recommendedMethods: [
      "고정 공부 루틴",
      "인출연습",
      "주기적 복습",
      "반복 후 왜 질문 만들기",
    ],
    growthMission:
      "반복 공부 뒤 왜 그런지 설명하는 질문 2개를 만들어보세요.",
  },

  foundation_builder: {
    name: "기반 정리형",
    summary: "지금은 나에게 맞는 기본 루틴을 작게 정리해보면 좋아요.",
    description:
      "아직 한 가지 성향이 뚜렷하지 않거나 기본 학습 루틴을 정리하는 단계입니다.",
    strengths: [
      "새 루틴을 만들 여지가 큽니다.",
      "작은 성공 경험을 쌓으면 빠르게 달라질 수 있습니다.",
      "지금부터 자신에게 맞는 방식을 찾아갈 수 있습니다.",
    ],
    cautions: [
      "한 번에 많이 바꾸려 하면 금방 지칠 수 있습니다.",
      "계획, 실행, 점검을 모두 완벽하게 하려 하기보다 하나부터 시작해야 합니다.",
    ],
    recommendedMethods: [
      "10분 시작 루틴",
      "쉬운 목표 1개",
      "확인문제 2개",
      "질문 1개 남기기",
    ],
    growthMission:
      "오늘은 10분 공부, 확인문제 2개, 질문 1개만 남겨보세요.",
  },
};
```

---

## 11. 결과 화면 UX 요구사항

### 11.1 시작 화면

포함 요소:

- 앱 제목
- 앱 목적 안내
- 개인정보·안전 안내
- 이름/별명 선택 입력
- 저장된 결과가 있으면 “저장된 결과 보기”
- 시작 버튼

필수 문구:

```text
이 앱은 성격검사나 심리검사가 아닙니다.
자기주도학습 전략을 찾기 위한 자기이해 활동입니다.
결과는 고정된 성향이 아니라 현재 답변 기준의 참고 자료입니다.
```

```text
이름이나 별명 입력은 선택입니다.
입력하지 않아도 앱을 사용할 수 있습니다.
```

```text
답변, 결과, 메모는 서버로 전송되지 않습니다.
저장 기능을 사용할 경우 결과는 이 기기의 브라우저에만 저장됩니다.
저장된 결과와 메모는 언제든 삭제할 수 있습니다.
```

### 11.2 문항 화면

- 한 화면에 한 문항
- 진행률 표시: 예: `5 / 16`
- 이전 / 다음 버튼
- 마지막 문항에서는 `결과 보기`
- 미응답 상태에서는 다음 버튼 비활성화
- 선택지 터치 영역은 충분히 크게 한다
- 문항 표현은 차분하고 신뢰감 있게 유지한다

### 11.3 결과 요약 화면

상단 카드:

- `[닉네임]님의 학습 성향` 또는 `나의 학습 성향`
- 대표 성향명
- 현재 응답 기준 안내
- 핵심 설명
- 5개 축 막대 그래프
- 강점 요약
- 주의할 점 요약
- 추천 학습법 요약
- 가장 중요한 성장 포인트 1개

### 11.4 상세 영역

아코디언 또는 접기/펼치기 구조:

- 나의 성향 상세 리포트
- 축별 해석
- 나에게 맞는 학습 전략
- 피하면 좋은 학습 방식
- 다음 성장 미션
- AI 챗봇 입력용 구체 프롬프트
- 복사 버튼
- 결과 저장
- 결과 이미지 저장
- 저장된 결과 삭제

---

## 12. 축별 결과 문구

축 라벨별 기본 문구를 조합해서 사용한다.

```ts
export const AXIS_NAMES: Record<Axis, string> = {
  P: "계획 세우기",
  E: "실행 유지하기",
  U: "이해 방법 찾기",
  M: "점검하고 고치기",
  H: "질문과 도움 활용하기",
};
```

```ts
export const AXIS_DESCRIPTIONS: Record<Axis, string> = {
  P: "목표를 정하고 공부 순서를 잡는 힘",
  E: "시작한 공부를 집중해서 이어가는 힘",
  U: "나에게 맞는 방식으로 개념을 이해하는 힘",
  M: "공부가 잘 되고 있는지 확인하고 방법을 수정하는 힘",
  H: "막힐 때 자료, 친구, 선생님, AI를 적절히 활용하는 힘",
};
```

라벨별 문장 예:

```ts
export const AXIS_LABEL_MESSAGES: Record<AxisLabel, string> = {
  "강점": "현재 비교적 자연스럽게 쓰고 있는 전략입니다.",
  "균형": "필요할 때 사용할 수 있지만 더 안정화할 수 있는 부분입니다.",
  "성장 포인트": "조금만 방법을 정하면 더 좋아질 수 있는 부분입니다.",
};
```

---

## 13. 상세 리포트 생성 규칙

상세 리포트에는 다음 항목을 포함한다.

1. 대표 학습 성향
2. 현재 응답 기준이라는 안내
3. 보조 성향이 있으면 보조 성향 문장
4. 5개 축별 해석
5. 주요 강점
6. 주의할 점
7. 잘 맞는 학습법
8. 피하면 좋은 학습 방식
9. 이번에 키워볼 성장 포인트
10. 다음 수업 성장 미션
11. 결과가 고정 성격이 아니라 현재 학습 습관과 선호를 바탕으로 한 코칭 출발점이라는 안내

필수 안내 문구:

```text
이 결과는 현재 답변 기준의 참고 자료입니다.
고정된 성격이나 능력이 아니라, 지금의 학습 습관과 선호를 바탕으로 한 코칭 출발점입니다.
```

---

## 14. AI 챗봇 프롬프트 생성

### 14.1 입력 필드

- 과목: 선택
- 단원: 선택
- 이번 학습 목표: 선택
- 학생 메모: 선택
- 메모 포함 체크박스: 기본값 false

입력하지 않아도 기본 프롬프트 복사가 가능해야 한다.

### 14.2 프롬프트 템플릿

```text
나는 현재 답변 기준으로 “[대표 성향명]”에 가까운 학습 성향입니다.
이 결과는 고정된 성격이 아니라, 지금의 학습 습관과 선호를 바탕으로 한 자기주도학습 코칭 출발점입니다.

나의 학습 프로필은 다음과 같습니다.

- 계획 세우기: [강점/균형/성장 포인트]
- 실행 유지하기: [강점/균형/성장 포인트]
- 이해 방법 찾기: [강점/균형/성장 포인트]
- 점검하고 고치기: [강점/균형/성장 포인트]
- 질문과 도움 활용하기: [강점/균형/성장 포인트]

나의 주요 강점:
[강점 요약 2~3문장]

주의할 점:
[주의점 1~2문장]

이번에 키워볼 성장 포인트:
[성장 포인트 축] - [성장 포인트 설명]

나에게 잘 맞을 가능성이 높은 학습 방식:
[추천 학습법 3~5개]

이번에 공부할 과목은 “[과목 입력 또는 미입력]”입니다.
이번에 공부할 단원은 “[단원 입력 또는 미입력]”입니다.
이번 학습 목표는 “[목표 입력 또는 미입력]”입니다.

[학생 메모 포함 체크 시]
내가 보기엔 이런 점도 있습니다:
[학생 메모]

내 성향을 고려해서 오늘 바로 실천할 수 있는 자기주도학습 계획을 추천해주세요.
계획은 너무 복잡하지 않게 30~40분 안에 실행 가능한 순서로 제안해주세요.
각 단계마다 내가 무엇을 하면 되는지 구체적으로 써주세요.
마지막에는 내가 스스로 점검할 수 있는 질문 3개를 만들어주세요.
내가 막혔을 때 AI에게 다시 물어볼 수 있는 질문 예시도 2개 만들어주세요.
```

---

## 15. 저장, 복사, 내보내기

### 15.1 저장 key

```ts
export const STORAGE_KEY = "srl-coach-result-v1";
```

### 15.2 저장 기능

- 결과 저장
- 저장된 결과 보기
- 현재 결과 삭제
- 저장된 결과 전체 삭제
- 삭제 전 확인 modal
- 저장 실패 시 안내 표시

### 15.3 복사 기능

- AI 프롬프트 복사
- 상세 리포트 복사
- Clipboard API 우선 사용
- 실패 시 textarea fallback 사용
- 복사 성공/실패 toast 표시

### 15.4 이미지 저장

- 결과 요약 카드만 이미지로 저장
- 실패 가능성을 고려해 보조 기능으로 구현
- 실패 시 “이미지 저장이 어려우면 AI 프롬프트 복사 또는 상세 리포트 복사를 사용하세요.” 안내

---

## 16. 접근성 및 태블릿 UX

- 모든 버튼은 키보드로 접근 가능해야 한다.
- 포커스 표시를 제거하지 않는다.
- 색상만으로 강점/균형/성장 포인트를 구분하지 않는다.
- 막대 그래프에는 텍스트 라벨을 함께 표시한다.
- 터치 영역은 충분히 크게 한다. 권장 최소 44px 이상.
- 모바일/태블릿 portrait 화면에서 결과 카드가 깨지지 않아야 한다.
- 긴 문장은 적절히 줄바꿈한다.
- 버튼 문구는 명확하게 쓴다.

---

## 17. 테스트 요구사항

`src/lib/scoring.ts`는 반드시 단위 테스트를 작성한다.

### 17.1 필수 테스트

1. 모든 문항에 응답하면 5축 점수가 0~100 범위에 들어온다.
2. P 중심 응답 패턴은 전략 설계형 또는 전략 설계형에 가까운 결과가 나온다.
3. E 중심 응답 패턴은 실행 추진형 또는 루틴 안정형에 가까운 결과가 나온다.
4. U 중심 응답 패턴은 개념 탐색형에 가까운 결과가 나온다.
5. M 중심 응답 패턴은 점검 성장형에 가까운 결과가 나온다.
6. H 중심 응답 패턴은 자원 활용형에 가까운 결과가 나온다.
7. 모든 축이 고르게 중상위면 균형 조율형이 나온다.
8. 평균이 낮고 최고점도 낮으면 기반 정리형이 나온다.
9. 1위와 2위 유사도 차이가 작으면 secondaryType이 설정된다.
10. 라벨 변환 기준이 정확하다.
    - 0~39: 성장 포인트
    - 40~69: 균형
    - 70~100: 강점

### 17.2 PromptBuilder 테스트

1. 과목/단원/목표가 입력되면 프롬프트에 반영된다.
2. 입력하지 않으면 `[미입력]` 또는 자연스러운 미입력 문구가 들어간다.
3. 메모 포함 체크가 false이면 메모가 포함되지 않는다.
4. 메모 포함 체크가 true이면 메모가 포함된다.
5. “현재 답변 기준” 안내가 프롬프트에 포함된다.

---

## 18. 완료 기준

구현 완료는 다음 조건을 만족해야 한다.

### 기능 완료

- 16문항 응답 가능
- 결과 생성 가능
- 5축 막대 그래프 표시
- 대표 성향 표시
- 보조 성향 처리
- 상세 리포트 표시
- AI 프롬프트 생성
- 프롬프트 복사
- 상세 리포트 복사
- localStorage 저장/삭제
- 결과 이미지 저장 시도 및 실패 안내
- 시작 화면 개인정보 안내

### 품질 완료

- `npm run build` 성공
- `npm test` 또는 `npm run test` 성공
- TypeScript 에러 없음
- 브라우저 콘솔 주요 에러 없음
- 태블릿 크기 화면에서 사용 가능
- 외부 데이터 전송 없음
- README에 실행/배포 방법 작성

### README 필수 내용

- 프로젝트 설명
- 로컬 실행 방법
- 빌드 방법
- 테스트 방법
- GitHub Pages 배포 방법
- 개인정보 처리 원칙
- 앱의 한계: 심리검사 아님, 현재 응답 기준 참고 자료

---

## 19. 수업용 안내 문구

시작 화면에 넣을 짧은 문구:

```text
이 앱은 나를 평가하거나 비교하기 위한 도구가 아닙니다.
지금의 공부 습관과 선호를 돌아보고, 나에게 맞는 자기주도학습 전략을 찾기 위한 활동입니다.
```

결과 화면에 넣을 짧은 문구:

```text
현재 답변 기준으로 가장 가까운 학습 성향입니다.
고정된 성격이나 능력이 아니라, 다음 학습전략을 고르는 데 도움을 주기 위한 참고 자료입니다.
```

AI 프롬프트 영역 안내:

```text
다음 수업에서 Gemini 같은 AI 챗봇에 아래 내용을 붙여넣으면, 내 성향에 맞는 공부 계획을 추천받을 수 있습니다.
과목, 단원, 목표를 입력하면 더 구체적인 프롬프트가 만들어집니다.
```

메모 영역 안내:

```text
결과가 나와 조금 다르게 느껴질 수 있습니다.
내가 보기엔 다른 점이 있다면 여기에 적어보세요.
메모는 기본적으로 AI 프롬프트에 포함되지 않습니다.
```

---

## 20. 파일럿 후 조정 후보

초기 구현 후 실제 학생 반응을 보고 다음을 조정할 수 있다.

- 문항 표현이 어렵거나 길면 단순화
- 상황형 선택지가 너무 길면 4개 선택지로 축소
- 결과 유형이 특정 유형에 과도하게 몰리면 기준 프로필 조정
- 성장 포인트 문구가 부정적으로 느껴지면 더 부드럽게 수정
- 이미지 저장 실패가 많으면 기능을 보조 위치로 낮춤
- 학교망에서 GitHub Pages가 차단되면 대체 배포 또는 Gemini Gems 방식 검토

---

## 21. 20문항 확장안은 v1 이후 옵션

기본 구현에서는 16문항만 사용한다.  
문항 안정성을 높이고 싶을 때 아래 4문항을 추가할 수 있도록 데이터 구조만 확장 가능하게 둔다.

```ts
export const EXTENSION_QUESTIONS = [
  {
    id: "Q17",
    type: "likert",
    axis: "H",
    text: "질문하기 전에 내가 아는 부분과 막힌 부분을 나누어 말하려고 한다.",
  },
  {
    id: "Q18",
    type: "likert",
    axis: "M",
    text: "다음에 같은 실수를 줄이기 위해 오답 원인을 짧게 기록한다.",
  },
  {
    id: "Q19",
    type: "likert",
    axis: "P",
    text: "한 번에 몰아서 하기보다 여러 번 나누어 복습하려고 한다.",
  },
  {
    id: "Q20",
    type: "likert",
    axis: "U",
    text: "외운 뒤에는 가리고 떠올리거나 스스로 문제를 내본다.",
  },
] satisfies Question[];
```

---

## 22. 개발 순서 제안

1. Vite + React + TypeScript 프로젝트 생성 또는 기존 구조 파악
2. 문항 데이터와 성향 데이터 작성
3. scoring.ts 구현
4. scoring.test.ts 작성
5. StartScreen 구현
6. QuestionScreen 구현
7. ResultScreen과 AxisBars 구현
8. resultText.ts 구현
9. promptBuilder.ts 구현
10. clipboard.ts 구현
11. storage.ts 구현
12. imageExport.ts 구현
13. 스타일 정리
14. README 작성
15. build/test 확인

---

## 23. 최종 검증 체크리스트

### 앱 동작

- [ ] 시작 화면이 표시된다.
- [ ] 개인정보 안내가 표시된다.
- [ ] 이름/별명을 입력하지 않아도 시작할 수 있다.
- [ ] 16문항에 모두 응답할 수 있다.
- [ ] 미응답 상태에서는 다음으로 넘어가지 않는다.
- [ ] 이전 문항으로 돌아가도 답변이 유지된다.
- [ ] 결과 화면이 생성된다.
- [ ] 대표 성향이 하나 표시된다.
- [ ] 5개 축이 모두 표시된다.
- [ ] 강점/균형/성장 포인트 라벨이 표시된다.
- [ ] 상세 리포트가 표시된다.
- [ ] AI 프롬프트가 생성된다.
- [ ] 과목/단원/목표 입력값이 프롬프트에 반영된다.
- [ ] 메모 포함 체크박스가 동작한다.
- [ ] 복사 버튼이 동작한다.
- [ ] 저장/삭제가 동작한다.

### 로직

- [ ] 축별 점수가 0~100 범위다.
- [ ] 축별 min/max가 질문 데이터에서 계산된다.
- [ ] 특수 규칙이 먼저 적용된다.
- [ ] 거리 기반 유형 매칭이 적용된다.
- [ ] 애매한 유형일 때 secondaryType이 표시된다.
- [ ] 성장 포인트는 낮은 축 기준으로 표시된다.

### 안전

- [ ] 답변/결과/메모가 외부로 전송되지 않는다.
- [ ] 외부 분석도구가 없다.
- [ ] localStorage 삭제가 가능하다.
- [ ] 공용 기기 주의 문구가 있다.
- [ ] 결과가 고정 성격이 아니라는 문구가 있다.

### 배포

- [ ] `npm run build` 성공
- [ ] `npm test` 성공
- [ ] GitHub Pages에서 정상 표시
- [ ] Padlet 또는 Canva 링크에서 정상 진입
- [ ] 태블릿 브라우저에서 정상 사용

---

## 24. 한계 문구

README와 앱 안내에 아래 한계를 명시한다.

```text
이 앱은 심리검사나 성격검사가 아닙니다.
16문항 기반의 짧은 수업용 자기이해 활동이므로, 검증 척도 수준의 신뢰도와 타당도를 보장하지 않습니다.
결과는 현재 답변 기준의 참고 자료이며, 과목, 단원, 컨디션, 최근 학습 경험에 따라 달라질 수 있습니다.
```

---

## 25. Codex에게 전달할 첫 지시 예시

아래 문장을 Codex에 붙여넣고, 이 md 파일을 함께 제공하라.

```text
이 저장소에 중학교 2학년 자기주도학습 수업용 정적 웹앱을 구현해줘.
구현 기준은 docs/CODEX_SELF_DIRECTED_LEARNING_APP_SPEC.md 문서를 따라줘.

우선 16문항 기본형만 구현하고, 20문항 확장안은 데이터 구조상 확장 가능하게만 둬.
서버 API, DB, 로그인, 외부 AI 호출은 만들지 마.
모든 점수 계산과 결과 생성은 브라우저 내부에서 수행해.
학생 답변, 결과, 메모는 외부로 전송하지 마.
점수 계산과 유형 매칭 로직은 반드시 Vitest로 테스트해.
완료 후 README에 실행, 테스트, 빌드, GitHub Pages 배포 방법을 적어줘.
```
