import type { Axis, AxisLabel, AxisScores, LearningTypeId } from "../types";

export type LearningTypeContent = {
  name: string;
  summary: string;
  description: string;
  strengths: string[];
  cautions: string[];
  recommendedMethods: string[];
  growthMission: string;
};

export const AXIS_NAMES: Record<Axis, string> = {
  P: "계획 세우기",
  E: "실행 유지하기",
  U: "이해 방법 찾기",
  M: "점검하고 고치기",
  H: "질문과 도움 활용하기",
};

export const AXIS_DESCRIPTIONS: Record<Axis, string> = {
  P: "목표를 정하고 공부 순서를 잡는 힘",
  E: "시작한 공부를 집중해서 이어가는 힘",
  U: "나에게 맞는 방식으로 개념을 이해하는 힘",
  M: "공부가 잘 되고 있는지 확인하고 방법을 수정하는 힘",
  H: "막힐 때 자료, 친구, 선생님, AI를 적절히 활용하는 힘",
};

export const AXIS_LABEL_MESSAGES: Record<AxisLabel, string> = {
  강점: "현재 비교적 자연스럽게 쓰고 있는 전략입니다.",
  균형: "필요할 때 사용할 수 있지만 더 안정화할 수 있는 부분입니다.",
  "성장 포인트": "조금만 방법을 정하면 더 좋아질 수 있는 부분입니다.",
};

export const AXIS_COLORS: Record<Axis, string> = {
  P: "#6962F4",
  E: "#348EEA",
  U: "#38B987",
  M: "#F6B62F",
  H: "#37A9D5",
};

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
    growthMission: "공부 후 마지막 5분에 틀린 이유 1개를 적어보세요.",
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
    growthMission: "개념 정리 15분 후 바로 확인문제 3개를 풀어보세요.",
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
    growthMission: "오답마다 실수, 개념 부족, 문제 읽기 중 하나로 표시해보세요.",
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
    growthMission: "질문 전에 내가 아는 것과 막힌 곳을 한 줄씩 써보세요.",
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
    growthMission: "반복 공부 뒤 왜 그런지 설명하는 질문 2개를 만들어보세요.",
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
    growthMission: "오늘은 10분 공부, 확인문제 2개, 질문 1개만 남겨보세요.",
  },
};
