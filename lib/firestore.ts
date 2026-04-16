import { db } from "./firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { EnergyType } from "./data";
import { getBadges as computeBadges } from "./storage";

export interface UserData {
  answers: EnergyType[];
  energyType: EnergyType | null;
  challengeSelections: string[];
  interests: string[];
  strengths: string[];
  savedCareers: string[];
  completedLevels: number[];
  points: number;
  badges: string[];
  totalPoints?: number;
  resumeUrl?: string;
  resumeFeedback?: string;
  email?: string;
  role?: "student" | "counselor" | "admin";
  name?: string;
  year?: string;
  major?: string;
}

const DEFAULT_USER_DATA: UserData = {
  answers: [],
  energyType: null,
  challengeSelections: [],
  interests: [],
  strengths: [],
  savedCareers: [],
  completedLevels: [1],
  points: 0,
  badges: [],
  role: "student",
  name: "",
  year: "",
  major: "",
};

export async function initializeUserWithRole(user: User, selectedRole?: "student" | "counselor" | "admin"): Promise<{ role: string }> {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  const role = selectedRole || "student";

  if (!snap.exists()) {
    await setDoc(userRef, { ...DEFAULT_USER_DATA, email: user.email, role, createdAt: new Date() });
    return { role };
  } else {
    if (selectedRole) {
      await updateDoc(userRef, { role: selectedRole });
      return { role: selectedRole };
    }
    const existingRole = snap.data().role || "student";
    if (!snap.data().role) {
      await updateDoc(userRef, { role: "student" });
    }
    return { role: existingRole };
  }
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
  if (!user) return { ...DEFAULT_USER_DATA };

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return { ...DEFAULT_USER_DATA };

  const data = { ...DEFAULT_USER_DATA, ...snap.data() } as UserData;
  const computedBadges = computeBadges(data);
  if (JSON.stringify(computedBadges) !== JSON.stringify(data.badges)) {
    await updateDoc(userRef, { badges: computedBadges });
  }
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