"use client";

import { motion } from "framer-motion";
import { EnergyType, energyProfiles } from "@/lib/data";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          {/* Dropdown menu button */}
          <div className="ml-auto relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Menu"
            >
              <span className="text-gray-600 text-2xl">☰</span>
            </button>

            {/* Dropdown menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-2">
                {/* Achievements */}
                <button
                  onClick={() => router.push("/achievements")}
                  className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition"
                >
                  <span className="text-yellow-500">🏆</span>
                  <span className="text-gray-900 font-bold text-sm">Achievements</span>
                </button>

                {/* Log Activities */}
                <button
                  onClick={() => router.push("/activities")}
                  className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition"
                >
                  <span className="text-blue-500">📝</span>
                  <span className="text-gray-900 font-bold text-sm">Log Activities</span>
                </button>

                {/* Upload Resume */}
                <button
                  onClick={() => router.push("/resume")}
                  className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition"
                >
                  <span className="text-green-500">📄</span>
                  <span className="text-gray-900 font-bold text-sm">Upload Resume</span>
                </button>

                {/* Counselor View */}
                <button
                  onClick={() => router.push("/counselor")}
                  className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition"
                >
                  <span className="text-purple-500">👥</span>
                  <span className="text-gray-900 font-bold text-sm">Counselor View</span>
                </button>

                <div className="border-t border-gray-100 my-1"></div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition"
                >
                  <span className="text-gray-600">🚪</span>
                  <span className="text-gray-900 font-bold text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
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
              {i > 0 && (
                <div
                  className={`w-0.5 h-6 ${
                    level.unlocked ? "bg-gray-300" : "bg-gray-100"
                  }`}
                />
              )}
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-sm">More levels coming soon...</p>
          <p className="text-gray-300 text-xs mt-1">
            Interests • Strengths • Careers • Experiences
          </p>
        </motion.div>
      </div>
    </div>
  );
}