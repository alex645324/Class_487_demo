"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userAuth } from "@/lib/userAuth";
import { useRouter } from "next/navigation";

interface UserData {
  uid: string;
  email: string;
  name: string;
  energyType: string | null;
  points: number;
  badges: string[];
  resumeUrl?: string;
  resumeFeedback?: string;
}

export default function CounselorPage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && !user) router.push("/");
    if (user) fetchUsers();
  }, [user, loading, router]);

  const fetchUsers = async () => {
    try {
      const usersCol = collection(db, "users");
      const snapshot = await getDocs(usersCol);
      const usersList = snapshot.docs.map((doc) => ({
        uid: doc.id,
        email: doc.data().email || "unknown",
        name: doc.data().name || "Not set",
        energyType: doc.data().energyType || "Not set",
        points: doc.data().totalPoints || doc.data().points || 0,
        badges: doc.data().badges || [],
        resumeUrl: doc.data().resumeUrl,
        resumeFeedback: doc.data().resumeFeedback,
      }));
      setUsers(usersList);
      // Initialize feedback inputs with the current feedback
      const initFeedback: Record<string, string> = {};
      usersList.forEach((u) => {
        initFeedback[u.uid] = u.resumeFeedback || "";
      });
      setFeedbackInput(initFeedback);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackChange = (uid: string, value: string) => {
    setFeedbackInput((prev) => ({ ...prev, [uid]: value }));
  };

  const saveFeedback = async (uid: string) => {
    const feedback = feedbackInput[uid];
    if (feedback === undefined) return;

    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { resumeFeedback: feedback });
      // Update local state to reflect the saved feedback
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, resumeFeedback: feedback } : u))
      );
      alert("Feedback saved.");
    } catch (err) {
      console.error("Error saving feedback:", err);
      alert("Failed to save feedback.");
    }
  };

  if (loading || isLoading) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-dvh bg-white p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Counselor Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Energy Type</th>
              <th className="text-left py-2">Points</th>
              <th className="text-left py-2">Badges</th>
              <th className="text-left py-2">Resume</th>
              <th className="text-left py-2">Feedback</th>
              <th className="text-left py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.uid} className="border-b border-gray-100">
                <td className="py-2">{u.name}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.energyType}</td>
                <td className="py-2">{u.points}</td>
                <td className="py-2">{u.badges.join(", ")}</td>
                <td className="py-2">
                  {u.resumeUrl ? (
                    <a
                      href={u.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    "No resume"
                  )}
                </td>
                <td className="py-2">
                  <textarea
                    rows={2}
                    className="w-full p-1 border border-gray-200 rounded"
                    placeholder="Feedback..."
                    value={feedbackInput[u.uid] || ""}
                    onChange={(e) => handleFeedbackChange(u.uid, e.target.value)}
                  />
                </td>
                <td className="py-2">
                  <button
                    onClick={() => saveFeedback(u.uid)}
                    className="px-2 py-1 bg-gray-900 text-white text-xs rounded"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-center">
        <button onClick={() => router.push("/")} className="text-gray-500 underline">
          Back to Quest Map
        </button>
      </div>
    </div>
  );
}