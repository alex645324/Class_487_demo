"use client";

import { motion } from "framer-motion";
import { EnergyType, energyProfiles } from "@/lib/data";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

interface Props {
  energyType: EnergyType;
}

const levels = [
  { level: 1, title: "Discover Your Energy", icon: "⚡", unlocked: true, completed: true },
  { level: 2, title: "Interests", icon: "🎯", unlocked: false, completed: false },
  { level: 3, title: "Strengths", icon: "💪", unlocked: false, completed: false },
  { level: 4, title: "Explore Careers", icon: "🗺️", unlocked: false, completed: false },
  { level: 5, title: "Real Experiences", icon: "🌟", unlocked: false, completed: false },
];

export default function QuestMap({ energyType }: Props) {
  const profile = energyProfiles[energyType];
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
            {profile.emoji}
          </div>
          <div>
            <p className="text-gray-900 font-bold text-lg">{energyType}</p>
            <p className="text-gray-400 text-sm">Level 1 Complete</p>
          </div>
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="ml-auto flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition"
          >
            <span className="text-gray-600">🚪</span>
            <span className="text-gray-900 font-bold text-sm">Logout</span>
          </button>
        </motion.div>

        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-gray-900"
        >
          Your Quest Map
        </motion.h1>
      </div>

      {/* Map */}
      <div className="flex-1 px-6 pb-8 flex flex-col items-center">
        <div className="w-full max-w-xs space-y-0">
          {levels.map((level, i) => (
            <motion.div
              key={level.level}
              initial={{ x: i % 2 === 0 ? -30 : 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex flex-col items-center"
            >
              {/* Connector line */}
              {i > 0 && (
                <div
                  className={`w-0.5 h-6 ${
                    level.unlocked ? "bg-gray-300" : "bg-gray-100"
                  }`}
                />
              )}

              {/* Node */}
              <div
                className={`relative w-full rounded-2xl p-4 flex items-center gap-4 ${
                  level.completed
                    ? "bg-gray-50 border-2 border-gray-300"
                    : level.unlocked
                    ? "bg-gray-50 border-2 border-gray-200"
                    : "bg-gray-50 border-2 border-gray-100"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                    level.completed
                      ? "bg-white shadow-lg border border-gray-200"
                      : level.unlocked
                      ? "bg-gray-100"
                      : "bg-gray-50"
                  }`}
                >
                  {level.completed ? (
                    <span>✅</span>
                  ) : level.unlocked ? (
                    <span>{level.icon}</span>
                  ) : (
                    <span className="text-gray-300">🔒</span>
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      level.completed
                        ? "text-gray-900"
                        : level.unlocked
                        ? "text-gray-500"
                        : "text-gray-300"
                    }`}
                  >
                    Level {level.level}
                  </p>
                  <p
                    className={`font-bold ${
                      level.completed
                        ? "text-gray-900"
                        : level.unlocked
                        ? "text-gray-600"
                        : "text-gray-300"
                    }`}
                  >
                    {level.title}
                  </p>
                </div>

                {level.completed && (
                  <span className="text-yellow-500 text-xl">🏆</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming soon message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-sm">
            More levels coming soon...
          </p>
          <p className="text-gray-300 text-xs mt-1">
            Interests • Strengths • Careers • Experiences
          </p>
        </motion.div>
      </div>
    </div>
  );
}