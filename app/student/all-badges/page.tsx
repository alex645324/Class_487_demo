"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userAuth } from "@/lib/userAuth";
import { getUserData } from "@/lib/firestore";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredPoints: number;
}

// Hardcoded milestone badges (same as in lib/storage.ts getBadges)
const DEFAULT_BADGES: Badge[] = [
  { id: "first-quiz", name: "First Quiz", description: "Completed the career energy quiz.", icon: "🎓", requiredPoints: 100 },
  { id: "explorer", name: "Explorer", description: "Completed the environment challenge.", icon: "🌍", requiredPoints: 150 },
  { id: "interests-explorer", name: "Interests Explorer", description: "Completed Quest Map Level 2 (Interests).", icon: "🎯", requiredPoints: 200 },
  { id: "skill-builder", name: "Skill Builder", description: "Completed Quest Map Level 3 (Skills).", icon: "🛠️", requiredPoints: 250 },
  { id: "strength-finder", name: "Strength Finder", description: "Completed Quest Map Level 4 (Strengths).", icon: "💪", requiredPoints: 300 },
  { id: "value-seeker", name: "Value Seeker", description: "Completed Quest Map Level 5 (Values).", icon: "❤️", requiredPoints: 350 },
  { id: "career-visionary", name: "Career Visionary", description: "Completed Quest Map Level 6 (Careers).", icon: "🗺️", requiredPoints: 400 },
  { id: "100-points", name: "100 Points", description: "Reached 100 total points.", icon: "🏅", requiredPoints: 100 },
  { id: "200-points", name: "200 Points", description: "Reached 200 total points.", icon: "🌟", requiredPoints: 200 },
  { id: "300-points", name: "300 Points", description: "Reached 300 total points.", icon: "⚡", requiredPoints: 300 },
  { id: "400-points", name: "400 Points", description: "Reached 400 total points.", icon: "🔥", requiredPoints: 400 },
  { id: "500-points", name: "500 Points", description: "Reached 500 total points.", icon: "🏆", requiredPoints: 500 },
  { id: "1000-points", name: "1000 Points", description: "Reached 1000 total points.", icon: "💎", requiredPoints: 1000 },
];

export default function AllBadgesPage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/");
    if (user) {
      Promise.all([fetchBadges(), getUserData(user)]).then(([firestoreBadges, userData]) => {
        let allBadges: Badge[];
        if (firestoreBadges.length === 0) {
          // Fallback to hardcoded milestone badges
          allBadges = DEFAULT_BADGES;
        } else {
          // Combine Firestore badges with hardcoded ones (avoid duplicates by name)
          const existingNames = new Set(firestoreBadges.map(b => b.name));
          const extra = DEFAULT_BADGES.filter(b => !existingNames.has(b.name));
          allBadges = [...firestoreBadges, ...extra];
        }
        // Sort by required points
        const sorted = allBadges.sort((a, b) => a.requiredPoints - b.requiredPoints);
        setBadges(sorted);
        setUserPoints(userData.points || 0);
        setIsLoading(false);
      });
    }
  }, [user, loading, router]);

  const fetchBadges = async () => {
    try {
      const snapshot = await getDocs(collection(db, "badges"));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Badge));
    } catch (error) {
      console.error(error);
      return [];
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
          <h1 className="text-xl font-bold">All Badges</h1>
        </div>
        <HamburgerMenu currentPage="all-badges" />
      </div>
      <div className="p-6 max-w-md mx-auto">
        <p className="text-gray-500 text-sm mb-4">Your current points: <strong>{userPoints}</strong></p>
        <div className="space-y-3">
          {badges.map(badge => {
            const earned = userPoints >= badge.requiredPoints;
            return (
              <div key={badge.id} className={`bg-white rounded-xl border p-4 shadow-sm ${earned ? 'border-green-300' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{badge.icon}</span>
                  <div className="flex-1">
                    <h2 className="font-semibold">{badge.name}</h2>
                    <p className="text-sm text-gray-500">{badge.description}</p>
                    <p className="text-xs text-gray-400">Need {badge.requiredPoints} points</p>
                  </div>
                  {earned && <span className="text-green-500 text-xl">✓</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          <button onClick={() => router.push("/student/home")} className="text-gray-500 underline text-sm">Back to Home</button>
        </div>
      </div>
    </div>
  );
}