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

export const interestsByType: Record<EnergyType, { label: string; icon: string }[]> = {
  Explorer: [
    { label: "Traveling & Cultures", icon: "🌍" },
    { label: "Trying New Tech", icon: "📱" },
    { label: "Learning New Skills", icon: "📚" },
    { label: "Outdoor Adventures", icon: "🏕️" },
    { label: "Startups & Ideas", icon: "💡" },
    { label: "Podcasts & Talks", icon: "🎙️" },
  ],
  Builder: [
    { label: "Coding & Dev", icon: "💻" },
    { label: "Engineering", icon: "⚙️" },
    { label: "DIY Projects", icon: "🛠️" },
    { label: "Robotics", icon: "🤖" },
    { label: "3D Printing / Making", icon: "🖨️" },
    { label: "Problem Solving", icon: "🧩" },
  ],
  Connector: [
    { label: "Volunteering", icon: "🤲" },
    { label: "Networking Events", icon: "🤝" },
    { label: "Mentoring Others", icon: "🧑‍🏫" },
    { label: "Team Sports", icon: "⚽" },
    { label: "Community Work", icon: "🏘️" },
    { label: "Public Speaking", icon: "🎤" },
  ],
  Creator: [
    { label: "Visual Art", icon: "🎨" },
    { label: "Writing & Storytelling", icon: "✍️" },
    { label: "Music & Sound", icon: "🎵" },
    { label: "Photography", icon: "📷" },
    { label: "UI/UX Design", icon: "🖼️" },
    { label: "Video Making", icon: "🎬" },
  ],
  Strategist: [
    { label: "Business & Finance", icon: "📈" },
    { label: "Data & Analytics", icon: "📊" },
    { label: "Chess & Strategy Games", icon: "♟️" },
    { label: "Research", icon: "🔬" },
    { label: "Project Management", icon: "📋" },
    { label: "Systems Thinking", icon: "🔄" },
  ],
};

export const strengthsByType: Record<EnergyType, { label: string; description: string }[]> = {
  Explorer: [
    { label: "Adaptability", description: "You adjust quickly to new situations" },
    { label: "Curiosity", description: "You always want to learn more" },
    { label: "Resilience", description: "You bounce back from setbacks" },
    { label: "Open-mindedness", description: "You embrace different perspectives" },
    { label: "Initiative", description: "You take the first step without waiting" },
    { label: "Versatility", description: "You thrive in many different roles" },
  ],
  Builder: [
    { label: "Problem Solving", description: "You find practical solutions fast" },
    { label: "Focus", description: "You stay locked in until the job is done" },
    { label: "Craftsmanship", description: "You care deeply about quality output" },
    { label: "Reliability", description: "People count on you to deliver" },
    { label: "Innovation", description: "You find better ways to build things" },
    { label: "Persistence", description: "You push through when things get hard" },
  ],
  Connector: [
    { label: "Empathy", description: "You truly understand how others feel" },
    { label: "Communication", description: "You express ideas clearly and warmly" },
    { label: "Collaboration", description: "You make teams work better together" },
    { label: "Networking", description: "You build relationships effortlessly" },
    { label: "Listening", description: "You make people feel genuinely heard" },
    { label: "Influence", description: "You inspire others to act" },
  ],
  Creator: [
    { label: "Creativity", description: "You generate original ideas constantly" },
    { label: "Vision", description: "You see what could be, not just what is" },
    { label: "Expression", description: "You communicate through your work" },
    { label: "Aesthetic Sense", description: "You have an eye for what looks right" },
    { label: "Originality", description: "Your approach is uniquely yours" },
    { label: "Storytelling", description: "You make ideas come alive" },
  ],
  Strategist: [
    { label: "Analytical Thinking", description: "You break down complex problems" },
    { label: "Planning", description: "You map out paths before moving" },
    { label: "Decision Making", description: "You weigh options and choose well" },
    { label: "Pattern Recognition", description: "You spot trends others miss" },
    { label: "Organization", description: "You bring order to chaos" },
    { label: "Critical Thinking", description: "You question assumptions carefully" },
  ],
};

export interface CareerSuggestion {
  title: string;
  icon: string;
  description: string;
  matchReason: string;
}

export const careersByType: Record<EnergyType, CareerSuggestion[]> = {
  Explorer: [
    { title: "Travel Coordinator", icon: "✈️", description: "Plan and manage travel experiences for clients or organizations", matchReason: "Your love for discovery and new experiences" },
    { title: "UX Researcher", icon: "🔍", description: "Study how people interact with products to improve design", matchReason: "Your curiosity about how people think and behave" },
    { title: "Journalist / Reporter", icon: "📰", description: "Investigate and share stories that matter", matchReason: "Your drive to uncover new perspectives" },
    { title: "Entrepreneur", icon: "🚀", description: "Launch new ventures and explore untested ideas", matchReason: "Your willingness to take risks and try new things" },
    { title: "Environmental Scientist", icon: "🌿", description: "Study and protect natural systems", matchReason: "Your passion for exploring the world around you" },
    { title: "Product Manager", icon: "📋", description: "Guide products from concept to launch", matchReason: "Your ability to navigate uncertainty and adapt" },
  ],
  Builder: [
    { title: "Software Engineer", icon: "💻", description: "Design, build, and maintain software systems", matchReason: "Your drive to build practical solutions" },
    { title: "Mechanical Engineer", icon: "⚙️", description: "Design and build physical machines and systems", matchReason: "Your hands-on problem-solving instincts" },
    { title: "Data Engineer", icon: "🗄️", description: "Build systems that collect and process data at scale", matchReason: "Your focus on reliable, quality output" },
    { title: "Architect", icon: "🏗️", description: "Design buildings and physical spaces", matchReason: "Your craftsmanship and attention to detail" },
    { title: "DevOps Engineer", icon: "🔧", description: "Build and maintain deployment and infrastructure", matchReason: "Your persistence in making things work" },
    { title: "Hardware Designer", icon: "🖥️", description: "Design circuit boards, devices, and electronics", matchReason: "Your love for making things from scratch" },
  ],
  Connector: [
    { title: "Human Resources Manager", icon: "👥", description: "Support employees and shape company culture", matchReason: "Your empathy and people skills" },
    { title: "Counselor / Therapist", icon: "💬", description: "Help people navigate challenges and grow", matchReason: "Your ability to listen and understand others" },
    { title: "Community Manager", icon: "🏘️", description: "Build and nurture online or local communities", matchReason: "Your talent for bringing people together" },
    { title: "Sales / Account Manager", icon: "🤝", description: "Build client relationships and grow business", matchReason: "Your networking and influence skills" },
    { title: "Teacher / Professor", icon: "🎓", description: "Educate and inspire the next generation", matchReason: "Your passion for mentoring others" },
    { title: "Public Relations Specialist", icon: "📢", description: "Manage public image and communications", matchReason: "Your strong communication skills" },
  ],
  Creator: [
    { title: "Graphic Designer", icon: "🎨", description: "Create visual content for brands and media", matchReason: "Your aesthetic sense and creativity" },
    { title: "Content Creator", icon: "🎬", description: "Produce videos, podcasts, or written content", matchReason: "Your storytelling and expression skills" },
    { title: "UI/UX Designer", icon: "🖼️", description: "Design beautiful, intuitive digital experiences", matchReason: "Your eye for what looks and feels right" },
    { title: "Writer / Author", icon: "✍️", description: "Craft stories, articles, or copy that resonates", matchReason: "Your originality and way with words" },
    { title: "Music Producer", icon: "🎵", description: "Create and produce music and audio experiences", matchReason: "Your creative vision and expression" },
    { title: "Art Director", icon: "🖌️", description: "Lead the visual direction of creative projects", matchReason: "Your vision for what could be" },
  ],
  Strategist: [
    { title: "Management Consultant", icon: "📊", description: "Advise organizations on strategy and operations", matchReason: "Your analytical and systems thinking" },
    { title: "Financial Analyst", icon: "📈", description: "Analyze financial data to guide business decisions", matchReason: "Your pattern recognition and critical thinking" },
    { title: "Data Scientist", icon: "🔬", description: "Extract insights from complex datasets", matchReason: "Your ability to break down complex problems" },
    { title: "Operations Manager", icon: "📋", description: "Optimize processes and manage teams", matchReason: "Your planning and organizational skills" },
    { title: "Policy Analyst", icon: "⚖️", description: "Research and recommend policies for organizations", matchReason: "Your critical thinking and decision-making" },
    { title: "Supply Chain Manager", icon: "🔄", description: "Manage the flow of goods and logistics", matchReason: "Your talent for systems and optimization" },
  ],
};

export function getInterestReflection(energyType: EnergyType, interests: string[]): string {
  const count = interests.length;
  if (count === 0) return "";
  if (count === 1) return `Your focus on ${interests[0]} aligns perfectly with your ${energyType} energy. Going deep on one thing is a strength.`;
  if (count <= 3) return `You're drawn to ${interests.slice(0, -1).join(", ")} and ${interests[interests.length - 1]}. As a ${energyType}, these focused interests can become real career advantages.`;
  return `You light up across many areas — ${interests.slice(0, 2).join(", ")} and more. Your broad curiosity is a core ${energyType} trait. The next step is finding where these overlap.`;
}

export function getStrengthSummary(energyType: EnergyType, strengths: string[]): string {
  return `As a ${energyType}, your combination of ${strengths.join(", ")} sets you apart. These aren't just traits — they're the foundation of the career path that will energize you most.`;
}

export function getCareerReflection(energyType: EnergyType, selectedCareers: string[]): string {
  if (selectedCareers.length === 0) return "";
  if (selectedCareers.length === 1) return `${selectedCareers[0]} caught your eye — that's a strong signal. As a ${energyType}, dig deeper into what this role looks like day-to-day.`;
  if (selectedCareers.length === 2) return `You're drawn to ${selectedCareers[0]} and ${selectedCareers[1]}. Both tap into your ${energyType} energy in different ways — explore what they have in common.`;
  return `You've flagged ${selectedCareers.length} careers that resonate. As a ${energyType}, look for the thread connecting them — that's where your sweet spot is.`;
}
