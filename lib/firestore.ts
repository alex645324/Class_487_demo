import { db } from "./firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { EnergyType } from "./data";
import { getBadges as computeBadges } from "./storage";
import { Activity } from "./activity";

export interface UserData {
  answers: EnergyType[];
  energyType: EnergyType | null;
  challengeSelections: string[];
  points: number;
  badges: string[];
  totalPoints?: number;
  resumeUrl?: string;
  resumeFeedback?: string;
  email?: string;
}

// Saves the users data to Firestore
export async function saveUserData(user: User, data: Partial<UserData>) {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const existing = await getUserData(user);
  const updated = { ...existing, ...data };

  // Making sure the email is stored correctly
  if (!updated.email && user.email) {
    updated.email = user.email;
  }

  await setDoc(userRef, updated, { merge: true });
  console.log("[Firestore] Saved user data:", updated);
}

// Loads data from Firestore regarding the user
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
    const data = snap.data() as UserData;
    const computedBadges = computeBadges(data);
    if (JSON.stringify(computedBadges) !== JSON.stringify(data.badges)) {
        // updates Firestore if badges change
        await updateDoc(userRef, { badges: computedBadges });
  }

    // Returns data with the badges
    return { ...data, badges: computedBadges };
}


// Calculate users points based on their completed actions
export function calculatePoints(userData: UserData): number {
  let points = 0;
  if (userData.answers.length > 0) points += 100;
  if (userData.challengeSelections.length > 0) points += 50;
  return points;
}

// Users gain badges based on actions that theyve completed
export function getBadges(userData: UserData): string[] {
  const badges: string[] = [];
  if (userData.answers.length > 0) badges.push("🎓 First Quiz");
  if (userData.challengeSelections.length > 0) badges.push("🌍 Explorer");
  if (userData.energyType) badges.push(`⚡ ${userData.energyType}`);
  return badges;
}