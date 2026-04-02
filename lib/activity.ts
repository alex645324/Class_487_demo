import { db } from "./firebase";
import { doc, updateDoc, arrayUnion, increment, getDoc } from "firebase/firestore";
import { User } from "firebase/auth";

export interface Activity {
  id?: string;
  type: string; // "Internship", "Workshop", "Club", "Event", etc.
  description: string;
  date: string; // ISO date string
  pointsAwarded: number;
  timestamp: Date;
}

// Points for different activity types
const POINTS = {
  Internship: 500,
  Workshop: 50,
  Club: 100,
  Event: 50,
  Other: 25,
};

// Add an activity to the user's activities array and update the total points
export async function addActivity(user: User, activity: Omit<Activity, "pointsAwarded" | "timestamp">) {
  if (!user) throw new Error("No user");

  const points = POINTS[activity.type as keyof typeof POINTS] || POINTS.Other;
  const newActivity: Activity = {
    ...activity,
    pointsAwarded: points,
    timestamp: new Date(),
  };

  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, {
    activities: arrayUnion(newActivity),
    points: increment(points),
  });

  return newActivity;
}

// Fetch user's completed activities
export async function getUserActivities(user: User): Promise<Activity[]> {
  if (!user) return [];
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data().activities || [];
  }
  return [];
}