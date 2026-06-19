import { AXES } from "../data/questions";
import {
  AXIS_DESCRIPTIONS,
  AXIS_LABEL_MESSAGES,
  AXIS_NAMES,
  LEARNING_TYPE_CONTENT,
  LEARNING_TYPE_NAMES,
} from "../data/learningTypes";
import type { Axis, AxisLabel, LearningTypeId, Result } from "../types";

type TypeReportGuide = {
  pattern: string;
  strengthDetail: string;
  cautionDetail: string;
  coachFocus: string;
  routine: string[];
};

export type AxisReportInsight = {
  axis: Axis;
  name: string;
  score: number;
  label: AxisLabel;
  description: string;
  meaning: string;
  action: string;
};

export type DetailedReportModel = {
  title: string;
  primaryName: string;
  overview: string;
  methodNote: string;
  secondaryNote?: string;
  evidenceCards: {
    label: string;
    value: string;
    body: string;
  }[];
  typeGuide: TypeReportGuide;
  axisInsights: AxisReportInsight[];
  strengthSummary: string;
  cautionSummary: string;
  growthFocus: string;
  growthMission: string;
  recommendedMethods: string[];
  selfCheckQuestions: string[];
};

const TYPE_REPORT_GUIDES: Record<LearningTypeId, TypeReportGuide> = {
  strategy_designer: {
    pattern:
      "공부를 시작하기 전에 목표, 범위, 순서를 먼저 잡아야 학습이 안정되는 편입니다. 해야 할 일이 많을수록 전체를 작은 단계로 나누는 힘이 성과로 이어지기 쉽습니다.",
    strengthDetail:
      "시험 범위가 넓거나 수행평가처럼 준비 과정이 긴 과제에서 강점이 잘 드러납니다. 오늘 무엇을 끝낼지, 어떤 순서로 움직일지 정하면 불안이 줄고 실행 기준이 분명해집니다.",
    cautionDetail:
      "계획을 더 완벽하게 만들려는 시간이 길어지면 실제 공부 시간이 줄어들 수 있습니다. 계획은 출발선을 만드는 도구이지, 공부를 대신하는 결과물이 아니라는 점을 기억하면 좋습니다.",
    coachFocus:
      "계획은 5분 안에 작게 세우고, 바로 첫 문제나 첫 예시로 들어가세요. 마지막에는 계획대로 했는지보다 무엇을 이해했고 무엇이 남았는지를 확인하는 것이 중요합니다.",
    routine: [
      "오늘 끝낼 목표를 한 문장으로 적기",
      "공부 순서를 3단계로만 나누기",
      "25분 실행 후 확인문제 2~3개 풀기",
      "남은 질문 1개를 다음 공부 첫 단계로 넘기기",
    ],
  },
  execution_driver: {
    pattern:
      "오래 고민하기보다 먼저 시작하면서 공부의 속도를 만드는 편입니다. 짧은 시간 안에 분량을 밀고 나가는 힘이 있어 루틴이 잡히면 성취감이 빠르게 쌓입니다.",
    strengthDetail:
      "공부를 시작하는 장벽이 비교적 낮고, 정한 분량을 끝내려는 추진력이 강점입니다. 반복 과제, 문제풀이, 단기 암기처럼 손을 움직여야 하는 학습에서 특히 힘을 발휘할 수 있습니다.",
    cautionDetail:
      "속도와 완료감에 집중하다 보면 왜 맞고 틀렸는지 확인하는 시간이 부족해질 수 있습니다. 같은 실수가 반복된다면 실행력이 부족해서가 아니라 점검 단계가 짧았을 가능성이 큽니다.",
    coachFocus:
      "공부 시간을 늘리기보다 마지막 5분을 반드시 오답 확인 시간으로 고정해보세요. 빨리 끝내는 힘에 작은 점검을 붙이면 성적 향상으로 연결될 가능성이 커집니다.",
    routine: [
      "시작 전 오늘 최소분량을 정하기",
      "타이머로 20~25분 집중 실행하기",
      "틀린 문제를 실수, 개념, 문제 읽기 중 하나로 표시하기",
      "다음에 고칠 행동 1개만 적기",
    ],
  },
  concept_explorer: {
    pattern:
      "새로운 내용을 그대로 외우기보다 예시, 그림, 내 말 설명으로 바꾸며 이해하려는 편입니다. 개념 사이의 연결을 찾을 때 학습 몰입이 높아질 수 있습니다.",
    strengthDetail:
      "낯선 개념을 자기 언어로 바꾸고, 비슷한 예시를 찾아보며 의미를 파악하는 데 강점이 있습니다. 단순 암기보다 원리 이해가 필요한 단원에서 깊이가 생기기 쉽습니다.",
    cautionDetail:
      "탐색이 길어지면 문제풀이와 마무리가 뒤로 밀릴 수 있습니다. 이해한 느낌이 실제 풀이 능력으로 이어졌는지는 확인문제를 통해 검증해야 합니다.",
    coachFocus:
      "개념 정리 시간을 정해두고, 바로 확인문제로 넘어가는 연결 장치를 만드세요. '설명할 수 있다'와 '문제에서 적용할 수 있다'를 둘 다 확인하는 것이 핵심입니다.",
    routine: [
      "핵심 개념을 내 말로 3문장 설명하기",
      "예시 1개와 반례 또는 헷갈리는 예 1개 만들기",
      "확인문제 3개로 적용 여부 확인하기",
      "틀린 문제에서 어떤 개념이 흔들렸는지 표시하기",
    ],
  },
  reflection_grower: {
    pattern:
      "공부가 잘 되고 있는지 확인하고, 방법을 고치면서 성장하는 편입니다. 결과만 보기보다 과정의 원인을 찾으려는 태도가 강점으로 작동합니다.",
    strengthDetail:
      "오답, 헷갈림, 집중 저하의 원인을 찾아 다음 방법을 조정할 수 있습니다. 작은 테스트나 자기점검 질문을 활용하면 학습 품질을 꾸준히 높이기 좋습니다.",
    cautionDetail:
      "점검이 지나치게 많아지면 자신감이 떨어지거나 공부 속도가 느려질 수 있습니다. 모든 것을 완벽하게 고치려 하기보다 가장 큰 원인 하나부터 다루는 편이 효과적입니다.",
    coachFocus:
      "점검은 짧고 구체적으로 하세요. '못했다'가 아니라 '무엇 때문에 막혔는지'를 이름 붙이고, 다음 공부에서 바꿀 행동 한 가지를 정하면 충분합니다.",
    routine: [
      "공부 전 확인할 기준 1개 정하기",
      "공부 후 미니 테스트 또는 가리고 떠올리기",
      "오답 원인을 3분류로 표시하기",
      "다음 공부법 수정 1개만 선택하기",
    ],
  },
  resource_user: {
    pattern:
      "막혔을 때 혼자 오래 버티기보다 자료, 사람, AI 같은 자원을 활용해 길을 찾는 편입니다. 질문을 잘 만들수록 학습 속도와 정확도가 함께 좋아질 수 있습니다.",
    strengthDetail:
      "도움이 필요한 순간을 알아차리고 적절한 자료를 찾는 힘이 있습니다. 친구, 선생님, 교과서, AI를 연결해 공부 방향을 빠르게 재정렬할 수 있습니다.",
    cautionDetail:
      "답을 너무 빨리 받으면 스스로 생각하는 시간이 줄어들 수 있습니다. 질문이 구체적이지 않으면 좋은 도움을 받아도 내 공부로 연결되기 어렵습니다.",
    coachFocus:
      "질문 전 3분 동안 혼자 시도하고, 내가 아는 것과 막힌 곳을 분리해 적어보세요. 도움을 받은 뒤에는 반드시 확인문제로 내 이해가 맞는지 검증해야 합니다.",
    routine: [
      "막힌 문제에서 내가 아는 조건 표시하기",
      "3분 혼자 풀이 방향 시도하기",
      "질문을 '어디까지 알았고 어디서 막혔는지'로 정리하기",
      "답변을 받은 뒤 비슷한 문제 1개 다시 풀기",
    ],
  },
  balanced_coordinator: {
    pattern:
      "계획, 실행, 이해, 점검, 도움 활용을 비교적 고르게 섞어 쓰는 편입니다. 한 가지 방식에 고정되기보다 상황에 맞게 전략을 바꿀 수 있습니다.",
    strengthDetail:
      "과목이나 단원 성격에 따라 다른 전략을 선택할 수 있다는 점이 큰 장점입니다. 기본 균형이 있어서 새로운 학습법도 비교적 안정적으로 받아들일 가능성이 있습니다.",
    cautionDetail:
      "모든 축이 비슷하면 오히려 이번에 무엇을 집중적으로 키울지 흐려질 수 있습니다. 균형이 좋을수록 가장 낮은 축 하나를 골라 의도적으로 연습하는 것이 도움이 됩니다.",
    coachFocus:
      "전체를 더 잘하려 하기보다 이번 주의 초점 하나를 정하세요. 강점은 유지하고, 가장 낮은 축을 보완하는 작은 미션을 붙이면 성장 방향이 선명해집니다.",
    routine: [
      "과목별로 필요한 전략 하나 고르기",
      "이번 주 가장 낮은 축 하나 정하기",
      "공부 후 전략이 맞았는지 한 줄로 평가하기",
      "다음 공부에서 바꿀 점 1개만 선택하기",
    ],
  },
  routine_stabilizer: {
    pattern:
      "정해진 시간과 흐름을 반복할 때 학습이 안정되는 편입니다. 꾸준히 이어가는 힘이 있어 루틴이 분명할수록 공부 부담이 줄어듭니다.",
    strengthDetail:
      "반복, 복습, 정해진 분량 수행처럼 일정한 리듬이 필요한 공부에서 강점이 나타납니다. 작은 루틴을 오래 유지하면 기본기가 탄탄해질 가능성이 큽니다.",
    cautionDetail:
      "익숙한 방식만 반복하면 새로운 개념 이해나 질문이 부족해질 수 있습니다. '했다'는 느낌은 남지만 실제로 설명하거나 적용하는 힘은 따로 확인해야 합니다.",
    coachFocus:
      "기존 루틴을 유지하되, 반복 뒤에 왜 그런지 설명하는 질문을 붙여보세요. 안정적인 실행에 이해 확인을 더하면 루틴의 효과가 훨씬 커집니다.",
    routine: [
      "항상 같은 시작 신호 만들기",
      "짧은 복습 후 새 내용으로 넘어가기",
      "반복 뒤 핵심 이유를 한 문장으로 설명하기",
      "주 1회 루틴이 효과 있었는지 점검하기",
    ],
  },
  foundation_builder: {
    pattern:
      "아직 특정 전략이 자동으로 자리 잡기 전 단계에 가깝습니다. 이는 부족함의 표시가 아니라, 나에게 맞는 공부 방식을 작게 실험해볼 여지가 크다는 뜻입니다.",
    strengthDetail:
      "새로운 루틴을 만들 수 있는 공간이 넓습니다. 한 번에 큰 변화를 만들기보다 작은 성공 경험을 반복하면 자신에게 맞는 전략을 빠르게 찾아갈 수 있습니다.",
    cautionDetail:
      "계획, 실행, 점검을 모두 한꺼번에 바꾸려 하면 금방 지칠 수 있습니다. 오늘 당장 할 수 있는 쉬운 행동 하나를 정하고, 성공 경험을 쌓는 것이 먼저입니다.",
    coachFocus:
      "공부 시간을 길게 잡기보다 10분 시작 루틴을 안정시키세요. 짧게라도 시작하고 확인문제 1~2개를 풀면 다음 루틴을 만들 근거가 생깁니다.",
    routine: [
      "10분만 공부할 쉬운 목표 정하기",
      "첫 문제 또는 첫 문단부터 바로 시작하기",
      "확인문제 2개로 이해 여부 확인하기",
      "남은 질문 1개를 적고 다음 공부로 넘기기",
    ],
  },
};

const AXIS_LABEL_GUIDES: Record<
  Axis,
  Record<AxisLabel, { meaning: string; action: string }>
> = {
  P: {
    강점: {
      meaning:
        "공부를 시작하기 전 목표와 순서를 잡는 일이 비교적 자연스럽습니다. 큰 범위도 작게 나누면 실행 기준이 선명해집니다.",
      action: "계획을 길게 쓰기보다 오늘 목표 1개와 순서 3개로 압축해 바로 시작해보세요.",
    },
    균형: {
      meaning:
        "필요할 때 계획을 세울 수 있지만, 바쁘거나 어려운 단원에서는 순서가 흐려질 수 있습니다.",
      action: "공부 시작 전 3분 동안 '먼저, 다음, 마지막'만 정해도 안정감이 높아집니다.",
    },
    "성장 포인트": {
      meaning:
        "해야 할 일이 한 덩어리로 느껴져 시작이 늦어질 수 있습니다. 계획 능력이 낮다는 뜻보다 계획 방식이 아직 간단해지지 않았다는 뜻에 가깝습니다.",
      action: "오늘은 전체 계획 대신 가장 쉬운 첫 행동 하나만 정하고 시작하세요.",
    },
  },
  E: {
    강점: {
      meaning:
        "공부를 시작한 뒤 정한 시간이나 분량을 이어가는 힘이 좋습니다. 작은 루틴이 잡히면 꾸준함이 빠르게 성과로 연결될 수 있습니다.",
      action: "집중 블록을 유지하되 마지막 5분은 반드시 점검 시간으로 남겨두세요.",
    },
    균형: {
      meaning:
        "시작과 지속이 어느 정도 가능하지만, 난도가 올라가거나 흥미가 낮은 과목에서는 흐름이 끊길 수 있습니다.",
      action: "처음부터 오래 하려 하지 말고 20분 실행, 3분 휴식처럼 짧은 단위로 고정해보세요.",
    },
    "성장 포인트": {
      meaning:
        "공부를 시작하거나 이어가는 과정에서 에너지가 빨리 떨어질 수 있습니다. 의지가 약하다는 뜻이 아니라 시작 단위가 너무 클 가능성이 있습니다.",
      action: "10분만 해도 성공으로 인정하는 최소 루틴을 만들어 시작 부담을 낮추세요.",
    },
  },
  U: {
    강점: {
      meaning:
        "개념을 예시, 그림, 내 말 설명으로 바꾸며 이해하려는 힘이 좋습니다. 원리와 연결을 찾는 공부에 강점이 있습니다.",
      action: "개념 정리 뒤 바로 확인문제 3개를 풀어 이해가 적용으로 이어졌는지 확인하세요.",
    },
    균형: {
      meaning:
        "기본적인 이해 전략을 사용할 수 있지만, 낯선 단원에서는 외우기와 이해하기가 섞여 헷갈릴 수 있습니다.",
      action: "외울 것과 이해할 것을 먼저 구분하고, 이해할 내용은 예시 하나로 바꿔보세요.",
    },
    "성장 포인트": {
      meaning:
        "새 개념을 자기 말로 바꾸는 과정이 아직 익숙하지 않을 수 있습니다. 문제풀이가 막힌다면 개념 연결이 약해진 신호일 수 있습니다.",
      action: "정답 풀이를 보기 전 '이 문제에서 쓰인 개념은 무엇인가'를 한 줄로 적어보세요.",
    },
  },
  M: {
    강점: {
      meaning:
        "공부가 잘 되고 있는지 확인하고 방법을 수정하는 힘이 좋습니다. 오답과 헷갈림을 성장 재료로 바꾸기 쉽습니다.",
      action: "점검 결과를 길게 적기보다 다음 공부에서 바꿀 행동 1개로 마무리하세요.",
    },
    균형: {
      meaning:
        "필요할 때 점검할 수 있지만, 시간이 부족하면 확인 단계를 건너뛰기 쉽습니다.",
      action: "공부 끝 3분을 고정해서 '맞힌 이유, 틀린 이유, 남은 질문' 중 하나만 적어보세요.",
    },
    "성장 포인트": {
      meaning:
        "공부를 끝낸 뒤 이해 여부를 확인하지 않아 빈틈이 늦게 발견될 수 있습니다. 점검을 크게 하려 하지 말고 아주 작게 붙이는 것이 좋습니다.",
      action: "단원 끝이 아니라 20~30분마다 확인문제 1개로 중간 점검을 해보세요.",
    },
  },
  H: {
    강점: {
      meaning:
        "막힐 때 필요한 자료나 도움을 찾는 힘이 좋습니다. 질문을 잘 정리하면 혼자 막혀 있는 시간을 줄일 수 있습니다.",
      action: "도움을 받은 뒤 비슷한 문제를 혼자 다시 풀어 답변이 내 이해로 바뀌었는지 확인하세요.",
    },
    균형: {
      meaning:
        "도움이 필요하다는 것을 알 수 있지만, 어떤 질문을 해야 할지 정리하는 과정이 더 안정화될 수 있습니다.",
      action: "질문 전 '아는 것, 막힌 곳, 궁금한 것'을 한 줄씩 나누어 적어보세요.",
    },
    "성장 포인트": {
      meaning:
        "막혔을 때 혼자 오래 버티거나, 반대로 답만 빠르게 확인할 가능성이 있습니다. 도움 활용은 의존이 아니라 학습 전략입니다.",
      action: "3분 혼자 시도한 뒤에도 막히면 질문 템플릿을 써서 도움을 요청하세요.",
    },
  },
};

export function getDisplayName(result: Pick<Result, "nickname">) {
  return result.nickname ? `${result.nickname}님의 학습 성향` : "나의 학습 성향";
}

export function getPrimarySentence(result: Result) {
  const primary = LEARNING_TYPE_NAMES[result.primaryType];
  if (result.secondaryType) {
    return `현재 답변 기준으로는 "${primary}"에 가장 가깝고, "${LEARNING_TYPE_NAMES[result.secondaryType]}"의 특징도 일부 보여요.`;
  }

  return `현재 답변 기준으로는 "${primary}"에 가장 가까워요.`;
}

export function getMainGrowthAxis(result: Result): Axis {
  return result.growthAxes[0] ?? AXES[0];
}

export function getAxisInterpretation(result: Result, axis: Axis) {
  return `${AXIS_NAMES[axis]}: ${result.axisLabels[axis]} - ${AXIS_LABEL_MESSAGES[result.axisLabels[axis]]}`;
}

export function getStrengthSummary(result: Result) {
  const content = LEARNING_TYPE_CONTENT[result.primaryType];
  return content.strengths.slice(0, 3).join(" ");
}

export function getCautionSummary(result: Result) {
  const content = LEARNING_TYPE_CONTENT[result.primaryType];
  return content.cautions.slice(0, 2).join(" ");
}

export function getGrowthSummary(result: Result) {
  const axis = getMainGrowthAxis(result);
  return `${AXIS_NAMES[axis]} - ${AXIS_DESCRIPTIONS[axis]}`;
}

const axisNames = (axes: Axis[]) => axes.map((axis) => AXIS_NAMES[axis]).join(", ");

export function buildDetailedReportModel(result: Result): DetailedReportModel {
  const content = LEARNING_TYPE_CONTENT[result.primaryType];
  const typeGuide = TYPE_REPORT_GUIDES[result.primaryType];
  const growthAxis = getMainGrowthAxis(result);
  const secondaryNote = result.secondaryType
    ? `보조 성향으로는 "${LEARNING_TYPE_NAMES[result.secondaryType]}"의 특징도 함께 보입니다. 그래서 한 가지 방식만 쓰기보다, 대표 성향을 중심으로 보조 성향의 장점을 일부 섞어 쓰면 더 자연스럽습니다.`
    : undefined;
  const axisInsights = AXES.map((axis) => {
    const label = result.axisLabels[axis];
    const guide = AXIS_LABEL_GUIDES[axis][label];
    return {
      axis,
      name: AXIS_NAMES[axis],
      score: result.axisScores[axis],
      label,
      description: AXIS_DESCRIPTIONS[axis],
      meaning: guide.meaning,
      action: guide.action,
    };
  });

  return {
    title: `${getDisplayName(result)} 심층 리포트`,
    primaryName: content.name,
    overview: `${getPrimarySentence(result)} ${typeGuide.pattern}`,
    methodNote:
      "이 리포트는 16개 문항 응답을 바탕으로 계획, 실행, 이해, 점검, 도움 활용의 5개 축을 해석한 코칭 자료입니다. 점수는 성적이나 능력의 높고 낮음이 아니라, 현재 공부할 때 자주 쓰는 전략의 경향을 보여줍니다.",
    secondaryNote,
    evidenceCards: [
      {
        label: "대표 성향",
        value: content.name,
        body: `5개 축의 조합이 "${content.name}" 프로필과 가장 가깝습니다.`,
      },
      {
        label: "강점 축",
        value: axisNames(result.strengthAxes),
        body: "비교적 자연스럽게 사용하고 있는 자기주도학습 전략입니다.",
      },
      {
        label: "성장 초점",
        value: AXIS_NAMES[growthAxis],
        body: "부족함의 표시가 아니라, 다음 학습에서 가장 작게 실험해볼 출발점입니다.",
      },
    ],
    typeGuide,
    axisInsights,
    strengthSummary: getStrengthSummary(result),
    cautionSummary: getCautionSummary(result),
    growthFocus: `${AXIS_NAMES[growthAxis]} - ${AXIS_DESCRIPTIONS[growthAxis]}`,
    growthMission: content.growthMission,
    recommendedMethods: content.recommendedMethods,
    selfCheckQuestions: [
      "오늘 내가 끝내려는 목표가 한 문장으로 분명한가?",
      "공부가 끝난 뒤 이해 여부를 확인할 방법이 있는가?",
      `막히면 ${AXIS_DESCRIPTIONS[growthAxis]}을 조금 더 쉽게 만들 행동을 정했는가?`,
    ],
  };
}

export function buildDetailedReport(result: Result) {
  const report = buildDetailedReportModel(result);
  const axisLines = report.axisInsights.flatMap((axis) => [
    `- ${axis.name}: ${axis.score}점, ${axis.label}`,
    `  의미: ${axis.meaning}`,
    `  실천: ${axis.action}`,
  ]);

  return [
    report.title,
    "",
    "읽는 방법",
    report.methodNote,
    "",
    "1. 종합 해석",
    `대표 학습 성향: ${report.primaryName}`,
    report.overview,
    report.secondaryNote,
    "",
    "2. 진단 근거",
    ...report.evidenceCards.map((item) => `- ${item.label}: ${item.value} - ${item.body}`),
    "",
    "3. 잘 작동하는 강점",
    report.typeGuide.strengthDetail,
    ...report.strengthSummary.split(". ").filter(Boolean).map((item) => `- ${item.replace(/\.$/, "")}.`),
    "",
    "4. 조심하면 더 좋아지는 지점",
    report.typeGuide.cautionDetail,
    ...report.cautionSummary.split(". ").filter(Boolean).map((item) => `- ${item.replace(/\.$/, "")}.`),
    "",
    "5. 5개 축별 해석",
    ...axisLines,
    "",
    "6. 오늘 바로 써볼 학습 처방",
    report.typeGuide.coachFocus,
    ...report.typeGuide.routine.map((item) => `- ${item}`),
    "",
    "7. 나에게 맞을 가능성이 높은 학습 전략",
    ...report.recommendedMethods.map((item) => `- ${item}`),
    "",
    "8. 성장 미션과 점검 질문",
    report.growthFocus,
    report.growthMission,
    ...report.selfCheckQuestions.map((item) => `- ${item}`),
    "",
    "마무리",
    "이 결과는 고정된 성격이나 능력이 아니라, 지금의 학습 습관과 선호를 바탕으로 한 코칭 출발점입니다. 한 번에 모두 바꾸기보다 오늘 가장 작은 행동 하나를 실험해보세요.",
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}
