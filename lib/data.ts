export type EnergyType = "Explorer" | "Builder" | "Connector" | "Creator" | "Strategist";

export interface QuizQuestion {
  question: string;
  options: { label: string; icon: string; energy: EnergyType }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: "Which sounds more fun?",
    options: [
      { label: "Organizing a group project", icon: "📋", energy: "Strategist" },
      { label: "Building something yourself", icon: "🔨", energy: "Builder" },
      { label: "Brainstorming wild ideas", icon: "💡", energy: "Creator" },
      { label: "Meeting new people", icon: "🤝", energy: "Connector" },
    ],
  },
  {
    question: "What do friends come to you for?",
    options: [
      { label: "Advice", icon: "🧭", energy: "Connector" },
      { label: "Planning", icon: "📅", energy: "Strategist" },
      { label: "Solving problems", icon: "🧩", energy: "Builder" },
      { label: "Creative ideas", icon: "🎨", energy: "Creator" },
    ],
  },
  {
    question: "Pick the activity you'd enjoy most.",
    options: [
      { label: "Design a poster", icon: "🖌️", energy: "Creator" },
      { label: "Run an event", icon: "🎤", energy: "Connector" },
      { label: "Analyze data", icon: "📊", energy: "Strategist" },
      { label: "Build a prototype", icon: "⚙️", energy: "Builder" },
    ],
  },
  {
    question: "On a Saturday, you'd rather...",
    options: [
      { label: "Explore a new neighborhood", icon: "🗺️", energy: "Explorer" },
      { label: "Work on a side project", icon: "💻", energy: "Builder" },
      { label: "Hang with friends", icon: "☕", energy: "Connector" },
      { label: "Sketch or write", icon: "✏️", energy: "Creator" },
    ],
  },
  {
    question: "Which role fits you in a team?",
    options: [
      { label: "The idea person", icon: "🧠", energy: "Creator" },
      { label: "The doer", icon: "🚀", energy: "Builder" },
      { label: "The planner", icon: "📐", energy: "Strategist" },
      { label: "The connector", icon: "🔗", energy: "Connector" },
    ],
  },
  {
    question: "What excites you most about a job?",
    options: [
      { label: "Trying new things", icon: "✨", energy: "Explorer" },
      { label: "Making something real", icon: "🏗️", energy: "Builder" },
      { label: "Working with people", icon: "👥", energy: "Connector" },
      { label: "Solving big puzzles", icon: "🧮", energy: "Strategist" },
    ],
  },
];

export const energyProfiles: Record<EnergyType, { emoji: string; description: string; color: string }> = {
  Explorer: {
    emoji: "🧭",
    description: "You enjoy trying new ideas and exploring different paths. You thrive when there's something new to discover.",
    color: "from-gray-700 to-gray-900",
  },
  Builder: {
    emoji: "🔨",
    description: "You love making things happen. Give you a problem and you'll build the solution — hands on, no waiting.",
    color: "from-gray-700 to-gray-900",
  },
  Connector: {
    emoji: "🤝",
    description: "You energize people and bring groups together. Your superpower is understanding what others need.",
    color: "from-gray-700 to-gray-900",
  },
  Creator: {
    emoji: "🎨",
    description: "You see the world differently and love expressing ideas. You turn blank canvases into something meaningful.",
    color: "from-gray-700 to-gray-900",
  },
  Strategist: {
    emoji: "📐",
    description: "You love planning, systems, and figuring out the best approach. You see patterns others miss.",
    color: "from-gray-700 to-gray-900",
  },
};

export const challengeEnvironments = [
  { label: "Startup", icon: "🚀" },
  { label: "Research Lab", icon: "🔬" },
  { label: "Creative Studio", icon: "🎨" },
  { label: "Tech Company", icon: "💻" },
  { label: "Nonprofit", icon: "💚" },
  { label: "Corporate Team", icon: "🏢" },
];

export function getReflection(selections: string[]): string {
  const creative = ["Creative Studio", "Startup"];
  const analytical = ["Research Lab", "Tech Company"];
  const people = ["Nonprofit", "Corporate Team"];

  const creativeCount = selections.filter((s) => creative.includes(s)).length;
  const analyticalCount = selections.filter((s) => analytical.includes(s)).length;
  const peopleCount = selections.filter((s) => people.includes(s)).length;

  if (creativeCount >= analyticalCount && creativeCount >= peopleCount) {
    return "You tend to choose environments that involve experimentation and creativity. You thrive where ideas flow freely.";
  }
  if (analyticalCount >= peopleCount) {
    return "You're drawn to structured, innovation-driven environments. You like solving hard problems with smart people.";
  }
  return "You gravitate toward people-focused environments. Making an impact on others energizes you.";
}

export function calculateEnergyType(answers: EnergyType[]): EnergyType {
  const counts: Record<string, number> = {};
  for (const a of answers) {
    counts[a] = (counts[a] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as EnergyType;
}
