"use client";
import { useRouter } from "next/navigation";
import { userAuth } from "@/lib/userAuth";
import { getUserData } from "@/lib/firestore";
import { useEffect, useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";
import { naceQuests, NACEQuest } from "@/lib/data";

export default function StudentHomePage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [recommendedQuests, setRecommendedQuests] = useState<NACEQuest[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push("/");
    if (user) {
      getUserData(user).then((data) => {
        setUserData(data);
        setIsLoadingUserData(false);
        if (!data.name || data.name.trim() === ""|| data.name === "Not set") {
          router.replace("/student/onboarding");
          return;
        }
        // Generate recommended quests from user's NACE competencies
        if (data.naceCompetencies && data.naceCompetencies.length > 0) {
          const allQuests: NACEQuest[] = [];
          data.naceCompetencies.forEach((comp: string) => {
            if (naceQuests[comp]) {
              allQuests.push(...naceQuests[comp]);
            }
          });
          // Shuffle and take first 3
          const shuffled = allQuests.sort(() => 0.5 - Math.random());
          setRecommendedQuests(shuffled.slice(0, 3));
        } else {
          setRecommendedQuests([]);
        }
      });
    }
  }, [user, loading, router]);

  // Show loader until both auth and user data are ready
  if (loading || isLoadingUserData) {
    return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;
  }
  if (!user) return null;

  const features = [
    { title: "Quest Map", icon: "🗺️", path: "/student/quest-map", color: "bg-blue-50" },
    { title: "Activity Log", icon: "📝", path: "/student/activities", color: "bg-green-50" },
    { title: "Achievements", icon: "🏆", path: "/student/achievements", color: "bg-yellow-50" },
    { title: "Events", icon: "📅", path: "/student/events", color: "bg-purple-50" },
    { title: "Upload Resume", icon: "📄", path: "/student/resume", color: "bg-red-50" },
    { title: "Messages", icon: "💬", path: "/student/messages", color: "bg-indigo-50" },
    { title: "Social Feed", icon: "👥", path: "/student/feed", color: "bg-pink-50" },
    { title: "Career Roadmap", icon: "🗺️", path: "/student/roadmap", color: "bg-teal-50" },
    { title: "All Quests", icon: "📋", path: "/student/all-quests", color: "bg-orange-50" },
    { title: "All Badges", icon: "🏅", path: "/student/all-badges", color: "bg-amber-50" }
  ];

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Header */}
      <div className="bg-[#1E407C] text-white px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1E407C] font-bold text-lg">PSU</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Career Readiness</h1>
              <p className="text-xs text-blue-100">Penn State Abington</p>
            </div>
          </div>
          <HamburgerMenu currentPage="home" />
        </div>
        {userData && (
          <div className="mt-4 flex gap-4 text-sm">
            <div className="bg-blue-800 rounded-full px-3 py-1">
              ⚡ {userData.points || 0} points
            </div>
            {userData.energyType && (
              <div className="bg-blue-800 rounded-full px-3 py-1">
                🎯 {userData.energyType}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feature grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {features.map((f) => (
            <button
              key={f.title}
              onClick={() => router.push(f.path)}
              className={`${f.color} rounded-2xl p-6 flex flex-col items-center gap-3 border border-gray-200 hover:shadow-lg transition shadow-sm`}
            >
              <span className="text-4xl">{f.icon}</span>
              <span className="font-semibold text-gray-800">{f.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Next Steps Section */}
      {recommendedQuests.length > 0 && (
        <div className="px-6 pb-6 max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-3">📋 Recommended Next Steps</h2>
          <div className="space-y-3">
            {recommendedQuests.map((quest, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="font-semibold">{quest.title}</p>
                <p className="text-sm text-gray-500">{quest.description}</p>
                <p className="text-xs text-green-600 mt-1">+{quest.points} points</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Log these activities to earn points and build your skills.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-6 text-gray-400 text-xs border-t border-gray-200">
        <p>© 2026 Penn State Abington | Career & Professional Development</p>
        <p className="mt-1">Career Readiness Gamification Platform</p>
      </div>
    </div>
  );
}