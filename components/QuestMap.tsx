"use client";

import { motion } from "framer-motion";
import { EnergyType, energyProfiles } from "@/lib/data";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";

interface Props {
  energyType: EnergyType;
  completedLevels: number[];
  onStartLevel: (level: number) => void;
}

const levels = [
  { level: 1, title: "Discover Your Energy", icon: "⚡" },
  { level: 2, title: "Interests", icon: "🎯" },
  { level: 3, title: "Skills", icon: "🛠️" },
  { level: 4, title: "Strengths", icon: "💪" },
  { level: 5, title: "Your Values", icon: "❤️" },
  { level: 6, title: "Explore Careers", icon: "🗺️" },
];

export default function QuestMap({ energyType, completedLevels, onStartLevel }: Props) {
  const profile = energyProfiles[energyType];
  const router = useRouter();
  const maxCompleted = Math.max(...completedLevels);

  return (
    <div className="min-h-dvh bg-blue-50 flex flex-col">
      {/* Header with PSU branding */}
      <div className="bg-[#1E407C] text-white px-6 py-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#1E407C] font-bold text-lg">PSU</span>
          </div>
          <h1 className="text-xl font-bold">Quest Map</h1>
        </div>
        <HamburgerMenu currentPage="questmap" />
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 pt-4 pb-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow">
            {profile.emoji}
          </div>
          <div>
            <p className="text-gray-900 font-bold text-lg">{energyType}</p>
            <p className="text-gray-500 text-sm">Level {maxCompleted} Complete</p>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-gray-900 mb-6"
        >
          Your Quest Map
        </motion.h1>

        <div className="w-full max-w-xs mx-auto space-y-0">
          {levels.map((level, i) => {
            const completed = completedLevels.includes(level.level);
            const unlocked = level.level <= maxCompleted + 1;
            const tappable = unlocked && !completed && level.level <= 6;

            return (
              <motion.div
                key={level.level}
                initial={{ x: i % 2 === 0 ? -30 : 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex flex-col items-center"
              >
                {i > 0 && (
                  <div
                    className={`w-0.5 h-6 ${
                      unlocked ? "bg-gray-300" : "bg-gray-100"
                    }`}
                  />
                )}

                <button
                  onClick={() => tappable && onStartLevel(level.level)}
                  disabled={!tappable}
                  className={`relative w-full rounded-2xl p-4 flex items-center gap-4 transition-all ${
                    completed
                      ? "bg-gray-50 border-2 border-gray-300"
                      : tappable
                      ? "bg-white border-2 border-[#1E407C] active:scale-95 shadow"
                      : unlocked
                      ? "bg-gray-50 border-2 border-gray-200"
                      : "bg-gray-50 border-2 border-gray-100"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                      completed
                        ? "bg-white shadow-lg border border-gray-200"
                        : tappable
                        ? "bg-[#1E407C]"
                        : unlocked
                        ? "bg-gray-100"
                        : "bg-gray-50"
                    }`}
                  >
                    {completed ? (
                      <span>✅</span>
                    ) : tappable ? (
                      <span className="text-white">{level.icon}</span>
                    ) : unlocked ? (
                      <span>{level.icon}</span>
                    ) : (
                      <span className="text-gray-300">🔒</span>
                    )}
                  </div>

                  <div className="flex-1 text-left">
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        completed || tappable ? "text-gray-900" : unlocked ? "text-gray-500" : "text-gray-300"
                      }`}
                    >
                      Level {level.level}
                    </p>
                    <p
                      className={`font-bold ${
                        completed || tappable ? "text-gray-900" : unlocked ? "text-gray-600" : "text-gray-300"
                      }`}
                    >
                      {level.title}
                    </p>
                    {tappable && (
                      <p className="text-xs text-[#1E407C] mt-0.5">Tap to start →</p>
                    )}
                  </div>

                  {completed && <span className="text-yellow-500 text-xl">🏆</span>}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/student/home")}
            className="text-[#1E407C] underline text-sm hover:text-[#0F2B55]"
          >
            Back to Home Page
          </button>
        </div>

        {maxCompleted < 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 text-sm">More levels coming soon...</p>
            <p className="text-gray-300 text-xs mt-1">Complete all levels to unlock more</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}