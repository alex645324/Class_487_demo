import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { EnergyType } from "./data";

export interface UserData {
  answers: EnergyType[];
  energyType: EnergyType | null;
  challengeSelections: string[];
  points: number;
  badges: string[];
}

// Saves the users data to Firestore
export async function saveUserData(user: User, data: Partial<UserData>) {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const existing = await getUserData(user);
  const updated = { ...existing, ...data };
  await setDoc(userRef, updated, { merge: true });
  console.log("[Firestore] Saved user data:", updated);
}

// Loads users data from Firestore
export async function getUserData(user: User): Promise<UserData> {
  if (!user) {
    return {
      answers: [],
      energyType: null,
      challengeSelections: [],
      points: 0,
      badges: [],
    };
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    console.log("[Firestore] No existing data for user, returning defaults");
    return {
      answers: [],
      energyType: null,
      challengeSelections: [],
      points: 0,
      badges: [],
    };
  }
  return snap.data() as UserData;
}

// Calculate users points based on their completed actions
export function calculatePoints(userData: UserData): number {
  let points = 0;
  if (userData.answers.length > 0) points += 100;
  if (userData.challengeSelections.length > 0) points += 50;
  return points;
}

// Users gain badges based on completed actions
export function getBadges(userData: UserData): string[] {
  const badges: string[] = [];
  if (userData.answers.length > 0) badges.push("🎓 First Quiz");
  if (userData.challengeSelections.length > 0) badges.push("🌍 Explorer");
  if (userData.energyType) badges.push(`⚡ ${userData.energyType}`);
  return badges;
}