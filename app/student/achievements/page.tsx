"use client";

import { useState, useEffect } from "react";
import { userAuth } from "@/lib/userAuth";
import { getUserData } from "@/lib/firestore";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredPoints: number;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
}

export default function AchievementsPage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [points, setPoints] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [allAdminQuests, setAllAdminQuests] = useState<Quest[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ type: string; name: string; description: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/");
    if (user) loadData();
  }, [user, loading, router]);

  const loadData = async () => {
    if (!user) return;
    const data = await getUserData(user);
    setUserBadges(data.badges || []);
    setPoints(data.points || 0);
    setQuizCompleted(data.answers.length > 0);
    setChallengeCompleted(data.challengeSelections.length > 0);
    setCompletedLevels(data.completedLevels || []);
    setCompletedQuests(data.completedQuests || []);

    const questSnapshot = await getDocs(collection(db, "quests"));
    const questList = questSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quest));
    setAllAdminQuests(questList);
  };

  const handleItemClick = (type: string, name: string, description: string) => {
    setSelectedItem({ type, name, description });
  };

  if (loading) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  const levelMap: Record<number, { name: string; icon: string; description: string }> = {
    1: { name: "Discover Your Energy", icon: "⚡", description: "Take the quiz to discover your career energy type." },
    2: { name: "Interests", icon: "🎯", description: "Discover what you enjoy and what energizes you." },
    3: { name: "Skills", icon: "🛠️", description: "Choose NACE competencies to build." },
    4: { name: "Strengths", icon: "💪", description: "Identify your top strengths." },
    5: { name: "Your Values", icon: "❤️", description: "Select what matters most to you." },
    6: { name: "Explore Careers", icon: "🗺️", description: "Save careers that match your energy." },
  };

  const completedLevelItems = completedLevels
    .filter(lvl => lvl >= 1)
    .map(lvl => ({
      name: levelMap[lvl]?.name || `Level ${lvl}`,
      icon: levelMap[lvl]?.icon || "📌",
      description: levelMap[lvl]?.description || "Complete this level to earn a badge.",
      completed: true,
    }));

  const completedAdminItems = allAdminQuests
    .filter(q => completedQuests.includes(q.id))
    .map(q => ({
      name: q.title,
      icon: "📋",
      description: q.description,
      completed: true,
    }));

  const allCompletedQuests = [...completedLevelItems, ...completedAdminItems];

  return (
    <div className="min-h-dvh bg-blue-50">
      {/* Header */}
      <div className="bg-[#1E407C] text-white px-6 py-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#1E407C] font-bold text-lg">PSU</span>
          </div>
          <h1 className="text-xl font-bold">Achievements</h1>
        </div>
        <HamburgerMenu currentPage="achievements" />
      </div>

      <div className="p-6 max-w-md mx-auto">
        <p className="text-gray-600 mb-6">Badges and quests you've earned</p>

        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Points</p>
          <p className="text-3xl font-bold">{points}</p>
        </div>

        {userBadges.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 justify-center">
            {userBadges.map((badge, idx) => {
              const emoji = badge.match(/[\p{Emoji}]/u)?.[0] || "🏅";
              return (
                <div key={idx} className="text-3xl" title={badge}>
                  {emoji}
                </div>
              );
            })}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-3">🏆 Badges</h2>
        {userBadges.length === 0 ? (
          <p className="text-gray-400 mb-6">No badges earned yet. Complete quests to earn badges!</p>
        ) : (
          <div className="flex flex-wrap gap-2 mb-6">
            {userBadges.map((badge, idx) => {
              const icon = badge.match(/[\p{Emoji}]/u)?.[0] || "🏅";
              const name = badge.replace(icon, "").trim();
              return (
                <button
                  key={idx}
                  onClick={() => handleItemClick("badge", name, `You earned the "${name}" badge.`)}
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer transition"
                >
                  <span>{icon}</span>
                  <span>{name}</span>
                  <span>✓</span>
                </button>
              );
            })}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-3">📋 Quests Completed</h2>
        <div className="space-y-3">
          {allCompletedQuests.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No quests completed yet. Start your journey!</p>
          ) : (
            allCompletedQuests.map((quest, idx) => (
              <button
                key={idx}
                onClick={() => handleItemClick("quest", quest.name, quest.description)}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl w-full text-left bg-white"
              >
                <span className="text-2xl">{quest.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{quest.name}</p>
                  <p className="text-xs text-gray-400">{quest.description.substring(0, 60)}</p>
                </div>
                <span className="text-green-500 text-xl">✅</span>
              </button>
            ))
          )}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => router.push("/student/home")} className="text-gray-600 underline hover:text-[#1E407C]">
            Back to Home Page
          </button>
        </div>

        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedItem(null)}>
            <div className="bg-white rounded-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold">{selectedItem.name}</h3>
                <button onClick={() => setSelectedItem(null)} className="text-gray-500 text-2xl">&times;</button>
              </div>
              <p className="text-gray-600">{selectedItem.description}</p>
              <button onClick={() => setSelectedItem(null)} className="mt-4 w-full bg-[#1E407C] text-white py-2 rounded-lg">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}