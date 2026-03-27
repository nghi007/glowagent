export type QuestionOption = {
  letter: string;
  text: string;
  score: number;
};

export type Question = {
  id: number;
  dim: string;
  dimKey: string;
  text: string;
  options: QuestionOption[];
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    dim: "Revenue",
    dimKey: "revenue",
    text: "How would you describe your current monthly revenue?",
    options: [
      { letter: "A", text: "Pre-revenue — not yet making money", score: 1 },
      { letter: "B", text: "Inconsistent — some months good, some zero", score: 2 },
      { letter: "C", text: "Steady but small — under NAD 20,000/month", score: 3 },
      { letter: "D", text: "Growing — NAD 20,000+ and increasing", score: 4 }
    ]
  },
  {
    id: 2,
    dim: "Revenue",
    dimKey: "revenue",
    text: "How many paying clients or customers do you currently have?",
    options: [
      { letter: "A", text: "None yet", score: 1 },
      { letter: "B", text: "1–3 clients or customers", score: 2 },
      { letter: "C", text: "4–10 clients or customers", score: 3 },
      { letter: "D", text: "More than 10 regulars", score: 4 }
    ]
  },
  {
    id: 3,
    dim: "Operations",
    dimKey: "operations",
    text: "How do you currently manage your day-to-day business tasks?",
    options: [
      { letter: "A", text: "Everything is in my head — no system", score: 1 },
      { letter: "B", text: "WhatsApp and phone notes", score: 2 },
      { letter: "C", text: "Spreadsheets or basic tools", score: 3 },
      { letter: "D", text: "Dedicated software or team systems", score: 4 }
    ]
  },
  {
    id: 4,
    dim: "Marketing",
    dimKey: "marketing",
    text: "How do new customers currently find your business?",
    options: [
      { letter: "A", text: "Word of mouth only", score: 1 },
      { letter: "B", text: "Social media (informal, no strategy)", score: 2 },
      { letter: "C", text: "Active social media or basic marketing", score: 3 },
      { letter: "D", text: "Multiple channels — online, referrals, ads", score: 4 }
    ]
  },
  {
    id: 5,
    dim: "Marketing",
    dimKey: "marketing",
    text: "Do you have a clear and documented value proposition for your business?",
    options: [
      { letter: "A", text: "No — I struggle to explain what makes me different", score: 1 },
      { letter: "B", text: "I can explain it verbally but nothing is written", score: 2 },
      { letter: "C", text: "Yes, I have a basic pitch or description", score: 3 },
      { letter: "D", text: "Yes — it is strong, documented and tested with clients", score: 4 }
    ]
  },
  {
    id: 6,
    dim: "Finance",
    dimKey: "finance",
    text: "How do you currently track your business finances?",
    options: [
      { letter: "A", text: "I don't — money comes in and goes out", score: 1 },
      { letter: "B", text: "I check my bank account occasionally", score: 2 },
      { letter: "C", text: "I have a basic spreadsheet or record", score: 3 },
      { letter: "D", text: "I use accounting software and review monthly", score: 4 }
    ]
  },
  {
    id: 7,
    dim: "Finance",
    dimKey: "finance",
    text: "How confident are you in applying for business funding or a loan?",
    options: [
      { letter: "A", text: "Not at all — I would not know where to start", score: 1 },
      { letter: "B", text: "I have tried before but was unsuccessful", score: 2 },
      { letter: "C", text: "I know the process but need help with documents", score: 3 },
      { letter: "D", text: "Very confident — I have secured funding before", score: 4 }
    ]
  },
  {
    id: 8,
    dim: "Compliance",
    dimKey: "compliance",
    text: "What is the legal and compliance status of your business?",
    options: [
      { letter: "A", text: "Unregistered — operating informally", score: 1 },
      { letter: "B", text: "Registered but tax and compliance not up to date", score: 2 },
      { letter: "C", text: "Registered and mostly compliant", score: 3 },
      { letter: "D", text: "Fully registered, tax compliant, all paperwork in order", score: 4 }
    ]
  },
  {
    id: 9,
    dim: "Operations",
    dimKey: "operations",
    text: "Do you currently have a written business plan or growth strategy?",
    options: [
      { letter: "A", text: "No — the plan is in my head", score: 1 },
      { letter: "B", text: "I have rough notes or ideas written down", score: 2 },
      { letter: "C", text: "I have a basic written plan", score: 3 },
      { letter: "D", text: "Yes — a detailed plan I review regularly", score: 4 }
    ]
  },
  {
    id: 10,
    dim: "Growth",
    dimKey: "growth",
    text: "What is your biggest barrier to growing your business right now?",
    options: [
      { letter: "A", text: "Lack of capital / funding", score: 2 },
      { letter: "B", text: "Not enough clients or customers", score: 2 },
      { letter: "C", text: "Lack of skills or knowledge", score: 2 },
      { letter: "D", text: "No time — I am too busy running daily operations", score: 2 }
    ]
  }
];

export const DIM_LABELS: Record<string, string> = {
  revenue: "Revenue",
  operations: "Operations",
  marketing: "Marketing",
  finance: "Finance",
  compliance: "Compliance",
  growth: "Growth Readiness"
};
