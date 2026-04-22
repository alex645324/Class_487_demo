"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { userAuth } from "@/lib/userAuth";
import { addActivity, getUserActivities, Activity } from "@/lib/activity";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function ActivitiesPage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [form, setForm] = useState({
    type: "Workshop",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadActivities();
    }
  }, [user]);

  const loadActivities = async () => {
    if (user) {
      const acts = await getUserActivities(user);
      setActivities(acts);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await addActivity(user, {
        type: form.type,
        description: form.description,
        date: form.date,
      });
      setMessage("Activity logged! +" + (form.type === "Internship" ? 500 : form.type === "Workshop" ? 50 : form.type === "Club" ? 100 : 50) + " points");
      setForm({ type: "Workshop", description: "", date: new Date().toISOString().split("T")[0] });
      loadActivities();
    } catch (err) {
      setMessage("Error logging activity.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-dvh bg-blue-50">
      {/* Header */}
      <div className="bg-[#1E407C] text-white px-6 py-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#1E407C] font-bold text-lg">PSU</span>
          </div>
          <h1 className="text-xl font-bold">Log Your Experience</h1>
        </div>
        <HamburgerMenu currentPage="activities" />
      </div>

      <div className="p-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">Activity Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl bg-white"
            >
              <option>Internship</option>
              <option>Workshop</option>
              <option>Club</option>
              <option>Event</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g., Attended Career Fair, Joined Robotics Club..."
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-xl bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl bg-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1E407C] text-white p-3 rounded-xl font-bold disabled:opacity-50 hover:bg-[#0F2B55] transition"
          >
            {submitting ? "Logging..." : "Log Activity"}
          </button>
          {message && <p className="text-sm text-center text-green-600">{message}</p>}
        </form>

        <h2 className="text-xl font-semibold mb-4">Your Logged Activities</h2>
        {activities.length === 0 ? (
          <p className="text-gray-500">No activities logged yet. Start by adding one above!</p>
        ) : (
          <div className="space-y-3">
            {activities.map((act, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-full mb-1">
                      {act.type}
                    </span>
                    <p className="font-medium">{act.description}</p>
                    <p className="text-xs text-gray-400">{new Date(act.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-green-600 font-bold">+{act.pointsAwarded}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/student/home")}
            className="text-gray-600 underline hover:text-[#1E407C]"
          >
            Back to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}