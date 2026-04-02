"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnergyType, careersByType, getCareerReflection } from "@/lib/data";
import { userAuth } from "@/lib/userAuth";
import { saveUserData, getUserData } from "@/lib/firestore";

interface Props {
  energyType: EnergyType;
  onComplete: () => void;
}

export default function Level4Screen({ energyType, onComplete }: Props) {
  const { user } = userAuth();
  const [savedCareers, setSavedCareers] = useState<string[]>([]);
  const [showReflection, setShowReflection] = useState(false);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  const careers = careersByType[energyType];

  useEffect(() => {
    if (user) {
      getUserData(user).then((data) => {
        setStrengths(data.strengths || []);
        setInterests(data.interests || []);
      });
    }
  }, [user]);

  const toggle = (title: string) => {
    if (showReflection) return;
    setSavedCareers((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  const handleSubmit = async () => {
    if (savedCareers.length === 0) return;
    if (user) {
      await saveUserData(user, { savedCareers });
    }
    setShowReflection(true);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-white bg-gray-900 px-3 py-1 rounded-full">
            Level 4
          </span>
          <span className="text-xs text-gray-400">Explore Careers</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-4 pb-8">
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Careers that match your energy
        </motion.h2>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 mb-1"
        >
          {strengths.length > 0
            ? `With strengths in ${strengths.slice(0, 2).join(" & ")}${strengths.length > 2 ? " and more" : ""} — here are careers that fit your ${energyType} profile.`
            : `Based on your ${energyType} energy — explore these career paths.`}
        </motion.p>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-gray-400 text-sm mb-6"
        >
          Save the ones that excite you.
        </motion.p>

        <div className="flex flex-col gap-3 mb-8">
          {careers.map((career, i) => {
            const isSaved = savedCareers.includes(career.title);
            return (
              <motion.button
                key={career.title}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggle(career.title)}
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  isSaved
                    ? "border-gray-900 bg-gray-50 shadow-md"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl flex-shrink-0">
                  {career.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold ${isSaved ? "text-gray-900" : "text-gray-700"}`}>
                    {career.title}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">{career.description}</p>
                  <p className="text-xs text-gray-400 italic">
                    Why it fits: {career.matchReason}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    isSaved ? "border-gray-900 bg-gray-900" : "border-gray-300"
                  }`}
                >
                  {isSaved && <span className="text-white text-xs">✓</span>}
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showReflection && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6"
            >
              <p className="text-sm font-semibold text-gray-500 mb-2">
                🗺️ Your Career Snapshot
              </p>
              <p className="text-gray-700 leading-relaxed">
                {getCareerReflection(energyType, savedCareers)}
              </p>
              {interests.length > 0 && (
                <p className="text-gray-500 text-sm mt-3">
                  Combined with your interests in {interests.slice(0, 2).join(" and ")}, you're building a strong picture of what energizes you.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!showReflection ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={savedCareers.length === 0}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              savedCareers.length > 0
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            See My Career Snapshot
          </motion.button>
        ) : (
          <motion.button
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-gray-900 text-white shadow-lg"
          >
            Back to Quest Map →
          </motion.button>
        )}
      </div>
    </div>
  );
}
