"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { challengeEnvironments, getReflection } from "@/lib/data";
import { saveUserData } from "@/lib/storage";

interface Props {
  onComplete: () => void;
}

export default function ChallengeScreen({ onComplete }: Props) {
  const [selections, setSelections] = useState<string[]>([]);
  const [showReflection, setShowReflection] = useState(false);

  const toggleSelection = (label: string) => {
    if (showReflection) return;
    setSelections((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleSubmit = () => {
    if (selections.length === 0) return;
    setShowReflection(true);

    //saves the selection choices made by users to storage
    saveUserData({ challengeSelections: selections})
    console.log("[Challenge] Saved Selections", selections);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-white bg-gray-900 px-3 py-1 rounded-full">
            Challenge
          </span>
          <span className="text-xs text-gray-400">Energy Check</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-4 pb-8">
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Pick the environments that excite you
        </motion.h2>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 mb-6"
        >
          Select all that appeal to you.
        </motion.p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {challengeEnvironments.map((env, i) => {
            const isSelected = selections.includes(env.label);
            return (
              <motion.button
                key={env.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSelection(env.label)}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? "border-gray-900 bg-gray-50 shadow-md"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <span className="text-3xl mb-2">{env.icon}</span>
                <span
                  className={`text-sm font-medium ${
                    isSelected ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  {env.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showReflection ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6"
            >
              <p className="text-sm font-semibold text-gray-500 mb-2">
                💡 Your Reflection
              </p>
              <p className="text-gray-700 leading-relaxed">
                {getReflection(selections)}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {!showReflection ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={selections.length === 0}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              selections.length > 0
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            See My Reflection
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
            View Quest Map →
          </motion.button>
        )}
      </div>
    </div>
  );
}
