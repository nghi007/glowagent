import { QUESTIONS, DIM_LABELS } from '../data/questions';

export interface DimensionScores {
  [key: string]: number;
}

export interface BenchmarkData {
  dimension: string;
  yourScore: number;
  avgScore: number;
  topQuartile: number;
  percentile: number;
}

export interface AnalysisResult {
  overallScore: number;
  dimensionScores: DimensionScores;
  tier: 'low' | 'mid' | 'high';
  topGaps: Array<{ dimension: string; score: number; insight: string }>;
  actionPlan: string[];
  strengths: Array<{ dimension: string; score: number; insight: string }>;
  mainBarrier: string;
  benchmarks: BenchmarkData[];
  percentileRank: number;
}

const BENCHMARK_DATA = {
  revenue: { avg: 52, topQuartile: 75, median: 50 },
  operations: { avg: 48, topQuartile: 72, median: 45 },
  marketing: { avg: 51, topQuartile: 73, median: 48 },
  finance: { avg: 46, topQuartile: 70, median: 43 },
  compliance: { avg: 54, topQuartile: 78, median: 52 },
  growth: { avg: 49, topQuartile: 71, median: 47 }
};

function calculatePercentile(score: number, dimension: string): number {
  const { avg, topQuartile, median } = BENCHMARK_DATA[dimension as keyof typeof BENCHMARK_DATA];

  if (score >= topQuartile) {
    return 75 + ((score - topQuartile) / (100 - topQuartile)) * 25;
  } else if (score >= median) {
    return 50 + ((score - median) / (topQuartile - median)) * 25;
  } else if (score >= avg - 15) {
    return 25 + ((score - (avg - 15)) / (median - (avg - 15))) * 25;
  } else {
    return Math.max(1, (score / (avg - 15)) * 25);
  }
}

export function analyzeResults(answers: Record<number, number>): AnalysisResult {
  const dimScores: Record<string, number[]> = {
    revenue: [],
    operations: [],
    marketing: [],
    finance: [],
    compliance: [],
    growth: []
  };

  QUESTIONS.forEach((q, i) => {
    const ansIdx = answers[i] ?? 0;
    const score = q.options[ansIdx].score;
    dimScores[q.dimKey].push(score);
  });

  const dimAvgs: DimensionScores = {};
  Object.keys(dimScores).forEach((k) => {
    const scores = dimScores[k];
    dimAvgs[k] = scores.length
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 25)
      : 25;
  });

  const overall = Math.round(
    Object.values(dimAvgs).reduce((a, b) => a + b, 0) / Object.keys(dimAvgs).length
  );

  const tier = overall >= 70 ? 'high' : overall >= 45 ? 'mid' : 'low';

  const mainBarrier = QUESTIONS[9].options[answers[9] ?? 0].text;

  const sorted = Object.entries(dimAvgs).sort((a, b) => b[1] - a[1]);
  const weakest = sorted.slice().reverse().slice(0, 3);
  const strongest = sorted.slice(0, 2);

  const topGaps = weakest.map(([key, score]) => ({
    dimension: DIM_LABELS[key],
    score,
    insight: getGapInsight(key, score)
  }));

  const strengths = strongest.map(([key, score]) => ({
    dimension: DIM_LABELS[key],
    score,
    insight: getStrengthInsight(key, score)
  }));

  const actionPlan = get30DayPlan(weakest, mainBarrier);

  const benchmarks: BenchmarkData[] = Object.entries(dimAvgs).map(([key, score]) => {
    const benchData = BENCHMARK_DATA[key as keyof typeof BENCHMARK_DATA];
    return {
      dimension: DIM_LABELS[key],
      yourScore: score,
      avgScore: benchData.avg,
      topQuartile: benchData.topQuartile,
      percentile: Math.round(calculatePercentile(score, key))
    };
  });

  const allPercentiles = benchmarks.map(b => b.percentile);
  const percentileRank = Math.round(
    allPercentiles.reduce((a, b) => a + b, 0) / allPercentiles.length
  );

  return {
    overallScore: overall,
    dimensionScores: dimAvgs,
    tier,
    topGaps,
    actionPlan,
    strengths,
    mainBarrier,
    benchmarks,
    percentileRank
  };
}

function getGapInsight(dim: string, score: number): string {
  const insights: Record<string, string> = {
    revenue:
      score < 50
        ? 'Your revenue is inconsistent or non-existent. The priority is landing your first 3 paying clients and creating a repeatable sales process.'
        : 'Revenue exists but needs systemisation. Focus on client retention and referral mechanisms.',
    operations:
      score < 50
        ? 'Your business runs on memory and improvisation. This creates risk — one busy week and things fall through. You need basic systems immediately.'
        : 'Your operations work but rely too heavily on you. Document core processes to free up your time.',
    marketing:
      score < 50
        ? 'You have no reliable way to attract new clients. Word of mouth alone cannot build a scalable business. A basic digital presence is urgent.'
        : 'Your marketing exists but lacks strategy. Define your ideal client and build a focused acquisition channel.',
    finance:
      score < 50
        ? 'You are operating financially blind. Without tracking income and expenses, you cannot make good business decisions or qualify for funding.'
        : 'Basic financial tracking exists. The next step is building forward-looking projections and understanding your unit economics.',
    compliance:
      score < 50
        ? 'Operating informally limits your ability to win corporate clients, access funding, and protect yourself legally. Registration is a non-negotiable next step.'
        : 'Compliance foundations exist. Ensure tax submissions are current and B-BBEE status is documented.',
    growth:
      score < 50
        ? 'Your growth is blocked by foundational gaps. Solve your top 2 dimension issues before pursuing aggressive expansion.'
        : 'You are close to a growth inflection point. The right support and capital could unlock significant scale.'
  };
  return insights[dim] || 'This area needs attention. GlowAgent can help you build a specific improvement plan.';
}

function getStrengthInsight(dim: string, score: number): string {
  const baseInsights: Record<string, string> = {
    revenue: 'You have demonstrated revenue and client traction. This is your strongest foundation to build on.',
    operations: 'Your business runs with some structure. This gives you capacity to focus on growth rather than firefighting.',
    marketing: 'You have marketing awareness and some channels working. Build on this with more strategic targeting.',
    finance: 'Your financial awareness is above average for an early-stage SME. Use this to access capital.',
    compliance: 'Your legal and compliance foundations are solid. This unlocks corporate clients and formal funding channels.',
    growth: 'Your growth mindset and clarity about barriers puts you ahead. Channel this into structured execution.'
  };

  const baseInsight = baseInsights[dim] || 'This is a relative strength — continue investing here.';

  if (score >= 75) {
    return baseInsight + ' You score in the top 25% of SMEs in this area.';
  } else if (score >= 60) {
    return baseInsight + ' You are above average compared to peer businesses.';
  }

  return baseInsight;
}

function get30DayPlan(
  weakest: Array<[string, number]>,
  barrier: string
): string[] {
  const plans: Record<string, string> = {
    revenue: 'Identify your 5 ideal clients by name. Reach out to each with a personalised proposal this week.',
    operations: 'Spend 2 hours documenting your 3 most repeated tasks as step-by-step checklists.',
    marketing: 'Create or update your WhatsApp Business profile and post consistently 3 times per week for 30 days.',
    finance: 'Open a dedicated business bank account today. Record every transaction for the next 30 days.',
    compliance: 'Register your business with BIPA (Namibia) or CIPC (South Africa) — both can be done online in under a week.',
    growth: 'Write a one-page business summary including what you do, who you serve, and what results you deliver.'
  };

  const actions = weakest.map(([key]) => plans[key]);

  if (barrier.includes('capital') || barrier.includes('funding')) {
    actions.push(
      'Identify 3 accessible funding sources in your country and check your eligibility. GlowAgent can write your funding application.'
    );
  } else if (barrier.includes('clients') || barrier.includes('customers')) {
    actions.push(
      'Write a professional business proposal template you can send to prospective clients within 24 hours of any enquiry.'
    );
  } else if (barrier.includes('skills') || barrier.includes('knowledge')) {
    actions.push(
      'Start a daily 15-minute learning habit — use GlowAgent to learn one business concept per day inside your actual work.'
    );
  } else {
    actions.push(
      'Audit how you spend your time this week. Identify 2 tasks to automate or delegate using AI tools.'
    );
  }

  return actions.slice(0, 5);
}

export function getTierDescription(tier: 'low' | 'mid' | 'high'): string {
  const descriptions = {
    high: 'Your business shows strong foundations across multiple dimensions. With the right support, you\'re positioned to scale meaningfully within the next 12 months.',
    mid: 'Your business has real momentum but key gaps are holding back your growth. Targeted action on your weakest dimensions could transform your trajectory within 90 days.',
    low: 'Your business is at a critical early stage. The good news — every gap you have is solvable with the right tools and guidance. GlowAgent was built for exactly where you are now.'
  };
  return descriptions[tier];
}

export function getTierLabel(tier: 'low' | 'mid' | 'high'): { title: string; description: string } {
  const labels = {
    high: {
      title: 'Strong Foundation',
      description: 'Your systems and strategy are working. Time to scale.'
    },
    mid: {
      title: 'Promising but Patchy',
      description: 'Clear strengths, but critical gaps are blocking your potential.'
    },
    low: {
      title: 'Early Stage',
      description: 'Your business needs foundational support — and that\'s exactly what we\'re here for.'
    }
  };
  return labels[tier];
}
