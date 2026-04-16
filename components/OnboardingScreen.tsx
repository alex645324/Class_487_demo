"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { userAuth } from "@/lib/userAuth";
import { saveUserData } from "@/lib/firestore";

interface Props {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: Props) {
  const { user } = userAuth();
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "Other"];
  const majors = [
    "Computer Science",
    "Information Sciences and Technology",
    "Business",
    "Engineering",
    "Psychology",
    "Biology",
    "Communications",
    "Other",
  ];

  const handleSubmit = async () => {
    if (!name.trim() || !year || !major) return;
    setIsLoading(true);
    if (user) {
      await saveUserData(user, { name, year, major });
    }
    onComplete();
  };

  return (
    <div className="min-h-dvh bg-white p-6 flex flex-col">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-1 max-w-md mx-auto w-full"
      >
        <h1 className="text-2xl font-bold text-[#1E407C] mb-2">Welcome!</h1>
        <p className="text-gray-500 mb-8">Let's get to know you a bit better.</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex Johnson"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E407C]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year *
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E407C]"
            >
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Major / Field of Study *
            </label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E407C]"
            >
              <option value="">Select major</option>
              {majors.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!name || !year || !major || isLoading}
          className="w-full mt-8 py-4 bg-[#1E407C] text-white font-bold rounded-xl disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Continue →"}
        </motion.button>
      </motion.div>
    </div>
  );
}