"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { userAuth } from "@/lib/userAuth";
import { getUserData } from "@/lib/firestore";

export default function CareerRoadmap() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      getUserData(user).then(setData);
    }
  }, [user]);

  if (loading || !data) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-dvh bg-white p-6 flex flex-col">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold text-[#1E407C] mb-2">Your Career Roadmap</h1>
        <p className="text-gray-500 mb-6">Based on everything you’ve told us, here’s your personalized action plan.</p>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl"><h2 className="font-bold text-lg">⚡ Energy Type</h2><p className="text-gray-700">{data.energyType || "Not set"}</p></div>
          <div className="bg-gray-50 p-4 rounded-xl"><h2 className="font-bold text-lg">🎯 Top Interests</h2><p className="text-gray-700">{data.interests?.slice(0,3).join(", ") || "Not specified"}</p></div>
          <div className="bg-gray-50 p-4 rounded-xl"><h2 className="font-bold text-lg">💪 Key Strengths</h2><p className="text-gray-700">{data.strengths?.slice(0,3).join(", ") || "Not specified"}</p></div>
          <div className="bg-gray-50 p-4 rounded-xl"><h2 className="font-bold text-lg">🛠️ NACE Skills to Build</h2><p className="text-gray-700">{data.naceCompetencies?.join(", ") || "Not selected"}</p></div>
          <div className="bg-gray-50 p-4 rounded-xl"><h2 className="font-bold text-lg">❤️ Your Values</h2><p className="text-gray-700">{data.values?.join(", ") || "Not selected"}</p></div>
          <div className="bg-gray-50 p-4 rounded-xl"><h2 className="font-bold text-lg">🗺️ Careers to Explore</h2><p className="text-gray-700">{data.savedCareers?.join(", ") || "Not saved"}</p></div>
        </div>
        <div className="mt-8 flex gap-3">
          <button onClick={() => router.push("/student/home")} className="flex-1 bg-[#1E407C] text-white py-3 rounded-xl font-semibold">Go to Dashboard</button>
        </div>
      </motion.div>
    </div>
  );
}