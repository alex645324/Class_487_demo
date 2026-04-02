"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnergyType, strengthsByType, getStrengthSummary } from "@/lib/data";
import { userAuth } from "@/lib/userAuth";
import { saveUserData, getUserData } from "@/lib/firestore";

interface Props {
  energyType: EnergyType;
  onComplete: () => void;
}

export default function Level3Screen({ energyType, onComplete }: Props) {
  const { user } = userAuth();
  const [selections, setSelections] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);

  const strengths = strengthsByType[energyType];
  const MAX = 3;

  useEffect(() => {
    if (user) {
      getUserData(user).then((data) => {
        setInterests(data.interests || []);
      });
    }
  }, [user]);

  const toggle = (label: string) => {
    if (showSummary) return;
    setSelections((prev) => {
      if (prev.includes(label)) return prev.filter((s) => s !== label);
      if (prev.length >= MAX) return prev;
      return [...prev, label];
    });
  };

  const handleSubmit = async () => {
    if (selections.length === 0) return;
    if (user) {
      await saveUserData(user, { strengths: selections });
    }
    setShowSummary(true);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-white bg-gray-900 px-3 py-1 rounded-full">
            Level 3
          </span>
          <span className="text-xs text-gray-400">Strengths</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-4 pb-8">
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          What are your top strengths?
        </motion.h2>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 mb-1"
        >
          {interests.length > 0
            ? `You're interested in ${interests.slice(0, 2).join(" and ")}${interests.length > 2 ? " and more" : ""}. Now, pick your top 3 strengths.`
            : `As a ${energyType}, pick the 3 strengths that feel most like you.`}
        </motion.p>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-gray-400 text-sm mb-6"
        >
          {selections.length < MAX
            ? `Pick ${MAX - selections.length} more${selections.length > 0 ? "" : ` (${MAX} total)`}`
            : "Great — you've picked your 3."}
        </motion.p>

        <div className="flex flex-col gap-3 mb-8">
          {strengths.map((item, i) => {
            const isSelected = selections.includes(item.label);
            const isDisabled = !isSelected && selections.length >= MAX;
            return (
              <motion.button
                key={item.label}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                onClick={() => toggle(item.label)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  isSelected
                    ? "border-gray-900 bg-gray-50 shadow-md"
                    : isDisabled
                    ? "border-gray-100 bg-gray-50 opacity-40"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "border-gray-900 bg-gray-900" : "border-gray-300"
                  }`}
                >
                  {isSelected && <span className="text-white text-xs">✓</span>}
                </div>
                <div>
                  <p className={`font-bold ${isSelected ? "text-gray-900" : "text-gray-700"}`}>
                    {item.label}
                  </p>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showSummary && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6"
            >
              <p className="text-sm font-semibold text-gray-500 mb-2">
                💪 Your Strength Profile
              </p>
              <p className="text-gray-700 leading-relaxed">
                {getStrengthSummary(energyType, selections)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!showSummary ? (
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
            See My Strength Profile
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
