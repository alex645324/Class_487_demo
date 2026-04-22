"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { userAuth } from "@/lib/userAuth";
import { saveUserData } from "@/lib/firestore";
import HamburgerMenu from "@/components/HamburgerMenu";

interface Props {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: Props) {
  const { user } = userAuth();
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "Other"];
  const majors = [
    "Division of Undergraduate Studies (Undecided)",
    "Accounting",
    "American Studies",
    "Art",
    "Biology",
    "Business",
    "Computer Science",
    "Corporate Communication",
    "Criminal Justice",
    "Cybersecurity Analytics and Operations",
    "Data Sciences",
    "Elementary and Early Childhood Education",
    "Engineering",
    "English",
    "Finance",
    "Health Humanities",
    "History",
    "Information Technology",
    "Integrative Arts",
    "Integrative Science",
    "Multidisciplinary Studies",
    "Nursing",
    "Project and Supply Chain Management",
    "Psychological and Social Sciences",
    "Race and Ethnic Studies",
    "Recreation, Park and Tourism Management",
    "Rehabilitation and Human Services",
    "Other",
  ];

  const handleSubmit = async () => {
    if (!name.trim() || !year || !major || !graduationYear) return;
    setIsLoading(true);
    if (user) {
      await saveUserData(user, { name, year, major, graduationYear });
    }
    onComplete();
  };

  return (
    <div className="min-h-dvh bg-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#1E407C] text-white px-6 py-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#1E407C] font-bold text-lg">PSU</span>
          </div>
          <h1 className="text-xl font-bold">Welcome</h1>
        </div>
        <HamburgerMenu currentPage="home" />
      </div>

      <div className="flex-1 p-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-md mx-auto w-full"
        >
          <p className="text-gray-600 mb-6">Let's get to know you a bit better.</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Alex Johnson"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E407C] bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year *
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E407C] bg-white"
              >
                <option value="">Select year</option>
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Graduation Year *
              </label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E407C] bg-white"
              >
                <option value="">Select year</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
                <option value="2030">2030</option>
                <option value="2031">2031</option>
                <option value="2032">2032</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Major / Field of Study *
              </label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E407C] bg-white"
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
            disabled={!name || !year || !major || !graduationYear || isLoading}
            className="w-full mt-8 py-4 bg-[#1E407C] text-white font-bold rounded-xl disabled:opacity-50 hover:bg-[#0F2B55] transition"
          >
            {isLoading ? "Saving..." : "Continue →"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}