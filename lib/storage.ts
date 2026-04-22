// Handles saving and loading the  user data to localStorage
// Used to hold the quiz answers, energy type, challenge selections, and user info data
import { EnergyType } from "./data";

// I chose to store the mock login info of users in localStorage because it's simple, and works without a backend
// For a demo, this is ideal.
// Later on, we will replace this with a database and user authentication

export interface UserData {
  answers: EnergyType[];
  energyType: EnergyType | null;
  challengeSelections: string[];
  points: number;
  badges: string[];
  completedLevels?: number[];  // added for milestone badges
  user?: {
    email: string;
    name: string;
    isAuthenticated: boolean;
  };
}

// I'm using a single key for all users because this is a demo
// In a real app, I'd use a key that includes the user's email to separate data
const STORAGE_KEY = "career-energy-user";

// This function merges new data with existing data instead of overwriting so we don't accidentally lose progress when saving only part of the user's info
export function saveUserData(data: Partial<UserData>) {
  console.log("[storage] Saving user data:", data);
  const existing = loadUserData();
  const updated = { ...existing, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

//Load user data from localStorage and if no data exists, return default values so the app doesn't crash
// This provides a clean starting point for new users
export function loadUserData(): UserData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    console.log("[storage] No existing data, returning defaults");
    return {
      answers: [],
      energyType: null,
      challengeSelections: [],
      points: 0,
      badges: [],
    };
  }
  const parsed = JSON.parse(stored);
  console.log("[storage] Loaded data:", parsed);
  return parsed;
}

// Calculate total points based on completed actions
// Points are awarded for completing the quiz (100) and each challenges (50).
// This is a simple gamification element that can be expanded later.
export function calculatePoints(userData: UserData): number {
  let points = 0;
  if (userData.answers.length > 0) points += 100;   // quiz completed
  if (userData.challengeSelections.length > 0) points += 50; // challenge completed
  console.log(`[storage] Calculated points: ${points}`);
  return points;
}

// Awards users badges based on their completed tasks and milestones
export function getBadges(userData: UserData): string[] {
  const badges: string[] = [];
  if (userData.answers.length > 0) badges.push("🎓 First Quiz");
  if (userData.challengeSelections.length > 0) badges.push("🌍 Explorer");
  if (userData.energyType) badges.push(`⚡ ${userData.energyType}`);

  // Level completion badges (based on completedLevels array)
  const completed = userData.completedLevels || [];
  if (completed.includes(2)) badges.push("🎯 Interests Explorer");
  if (completed.includes(3)) badges.push("🛠️ Skill Builder");
  if (completed.includes(4)) badges.push("💪 Strength Finder");
  if (completed.includes(5)) badges.push("❤️ Value Seeker");
  if (completed.includes(6)) badges.push("🗺️ Career Visionary");

  // Point milestone badges
  const points = userData.points || 0;
  if (points >= 100) badges.push("🏅 100 Points");
  if (points >= 200) badges.push("🌟 200 Points");
  if (points >= 300) badges.push("⚡ 300 Points");
  if (points >= 400) badges.push("🔥 400 Points");
  if (points >= 500) badges.push("🏆 500 Points");
  if (points >= 1000) badges.push("💎 1000 Points");

  // Remove duplicates
  return [...new Set(badges)];
}