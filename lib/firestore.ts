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
  role?:"student"| "counselor" | "admin" //role checking functionality so we can redirect users accordingly
  name?: string;
  year?: string;
  major?: string;
}

//initializing user with the defualt roll of student upon sign up, will give counselors and admins different rolls through firebase
export async function initializeUserWithRole(user: User, selectedRole?: "student" | "counselor" | "admin"): Promise<{ role: string }> {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    // New user – create document with the role they selected (defaults to student)
    const newUserData = {
      email: user.email,
      role: selectedRole || "student",
      points: 0,
      badges: [],
      completedLevels: [1],
      answers: [],
      energyType: null,
      challengeSelections: [],
      interests: [],
      strengths: [],
      savedCareers: [],
      name: "",
      year: "",
      major: "",
      createdAt: new Date(),
    };
    await setDoc(userRef, newUserData);
    console.log("[Firestore] Created new user with role:", selectedRole || "student", user.email);
    return { role: selectedRole || "student" };
  } else {
    // Existing user – update role if one was explicitly selected, otherwise keep existing
    const data = snap.data();
    if (selectedRole) {
      await updateDoc(userRef, { role: selectedRole });
      return { role: selectedRole };
    }
    const role = data.role || "student";
    if (!data.role) {
      await updateDoc(userRef, { role: "student" });
    }
    return { role };
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
  if (!user) {
    return {
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
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    console.log("[Firestore] No existing data for user, returning defaults");
    return {
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
  }
  const data = snap.data() as UserData;
  if (!data.role) data.role = "student";
  if (data.name === undefined) data.name = "";
  if (data.year === undefined) data.year = "";
  if (data.major === undefined) data.major = "";
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