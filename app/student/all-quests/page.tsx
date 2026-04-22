"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userAuth } from "@/lib/userAuth";
import { getUserData } from "@/lib/firestore";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";
import { addActivity } from "@/lib/activity";

interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  isActive: boolean;
}

export default function AllQuestsPage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/");
    if (user) {
      Promise.all([fetchQuests(), getUserData(user)]).then(([questsList, userData]) => {
        setQuests(questsList.filter(q => q.isActive));
        setCompletedQuests(userData.completedQuests || []);
        setIsLoading(false);
      });
    }
  }, [user, loading, router]);

  const fetchQuests = async () => {
    try {
      const snapshot = await getDocs(collection(db, "quests"));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quest));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const completeQuest = async (quest: Quest) => {
    if (completedQuests.includes(quest.id)) {
      setMessage("You already completed this quest!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    try {
      await addActivity(user!, {
        type: "Quest",
        description: `Completed: ${quest.title}`,
        date: new Date().toISOString().split("T")[0],
      });
      const userRef = doc(db, "users", user!.uid);
      await updateDoc(userRef, {
        completedQuests: arrayUnion(quest.id),
        points: (await getUserData(user!)).points + quest.points,
      });
      setCompletedQuests([...completedQuests, quest.id]);
      setMessage(`+${quest.points} points for completing "${quest.title}"!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to complete quest.");
    }
  };

  if (loading || isLoading) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="bg-[#1E407C] text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#1E407C] font-bold text-lg">PSU</span>
          </div>
          <h1 className="text-xl font-bold">All Quests</h1>
        </div>
        <HamburgerMenu currentPage="all-quests" />
      </div>
      <div className="p-6 max-w-md mx-auto">
        <p className="text-gray-500 text-sm mb-4">Available quests to complete for points</p>
        {message && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">{message}</div>}
        {quests.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No quests available yet.</div>
        ) : (
          <div className="space-y-3">
            {quests.map(quest => {
              const isCompleted = completedQuests.includes(quest.id);
              return (
                <div key={quest.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <h2 className="font-semibold text-gray-900">{quest.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{quest.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{quest.category}</span>
                    <span className="text-green-600 font-bold">+{quest.points} pts</span>
                  </div>
                  <button
                    onClick={() => completeQuest(quest)}
                    disabled={isCompleted}
                    className={`mt-3 w-full py-2 rounded-lg text-sm font-semibold ${
                      isCompleted
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#1E407C] text-white hover:bg-[#0F2B55]"
                    }`}
                  >
                    {isCompleted ? "✓ Completed" : "Complete Quest"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-6 text-center">
          <button onClick={() => router.push("/student/home")} className="text-gray-500 underline text-sm">Back to Home</button>
        </div>
      </div>
    </div>
  );
}