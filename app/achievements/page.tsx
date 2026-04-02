"use client";

import { useState, useEffect } from "react";
import { userAuth } from "@/lib/userAuth";
import { getUserData } from "@/lib/firestore";
import { useRouter } from "next/navigation";

export default function AchievementsPage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [badges, setBadges] = useState<string[]>([]);
  const [points, setPoints] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/");
    if (user) loadData();
  }, [user, loading, router]);

  const loadData = async () => {
    if (!user) return;
    const data = await getUserData(user);
    setBadges(data.badges);
    setPoints(data.points);
    setQuizCompleted(data.answers.length > 0);
    setChallengeCompleted(data.challengeSelections.length > 0);
  };

  if (loading) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;
  if (!user) return null;
  return (
    <div className="min-h-dvh bg-white p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2">Your Achievements</h1>
      <p className="text-gray-500 mb-6">Badges and quests you've earned</p>

      <div className="bg-gray-50 rounded-2xl p-4 mb-6">
        <p className="text-sm text-gray-500">Total Points</p>
        <p className="text-3xl font-bold">{points}</p>
      </div>

      <h2 className="text-xl font-semibold mb-3">🏆 Badges</h2>
      {badges.length === 0 ? (
        <p className="text-gray-400 mb-6">No badges yet. Complete quests to earn badges!</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-6">
          {badges.map((badge, idx) => (
            <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm">{badge}</span>
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-3">📋 Quests Completed</h2>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
          <span className="text-2xl">⚡</span>
          <div className="flex-1">
            <p className="font-medium">Discover Your Energy</p>
            <p className="text-xs text-gray-400">Take the quiz</p>
          </div>
          {quizCompleted ? <span className="text-green-500 text-xl">✅</span> : <span className="text-gray-300">🔒</span>}
        </div>

        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
          <span className="text-2xl">🌍</span>
          <div className="flex-1">
            <p className="font-medium">Explore Your Environments</p>
            <p className="text-xs text-gray-400">Pick your preferred work settings</p>
          </div>
          {challengeCompleted ? <span className="text-green-500 text-xl">✅</span> : <span className="text-gray-300">🔒</span>}
        </div>
        <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl opacity-50">
          <span className="text-2xl">🎯</span>
          <div className="flex-1">
            <p className="font-medium">Interests</p>
            <p className="text-xs text-gray-400">Discover what you enjoy</p>
          </div>
          <span className="text-gray-300">🔒</span>
        </div>

        <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl opacity-50">
          <span className="text-2xl">💪</span>
          <div className="flex-1">
            <p className="font-medium">Strengths</p>
            <p className="text-xs text-gray-400">Identify your skills</p>
          </div>
          <span className="text-gray-300">🔒</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button onClick={() => router.push("/")} className="text-gray-500 underline">
          Back to Quest Map
        </button>
      </div>
    </div>
  );
}