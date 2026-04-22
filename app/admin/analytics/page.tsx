"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { userAuth } from "@/lib/userAuth";
import { useRouter } from "next/navigation";
import { getUserData } from "@/lib/firestore";

export default function AnalyticsPage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ totalUsers: 0, totalActivities: 0, avgPoints: 0, activeLast7Days: 0 });
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      getUserData(user).then((data) => {
        if (data.role === "admin") {
          setIsAuthorized(true);
          fetchStats();
        } else {
          router.push("/");
        }
      });
    }
  }, [user, loading, router]);

  const fetchStats = async () => {
    const usersSnap = await getDocs(collection(db, "users"));
    const totalUsers = usersSnap.size;
    let totalPoints = 0;
    let totalActivities = 0;
    let activeCount = 0;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    for (const docSnap of usersSnap.docs) {
      const data = docSnap.data();
      totalPoints += data.points || 0;
      const activities = data.activities || [];
      totalActivities += activities.length;
      // Check if any activity in last 7 days
      const recentActivity = activities.some((act: any) => {
        const actDate = act.timestamp?.toDate?.() || new Date(act.timestamp);
        return actDate > sevenDaysAgo;
      });
      if (recentActivity) activeCount++;
    }
    setStats({
      totalUsers,
      totalActivities,
      avgPoints: totalUsers ? Math.round(totalPoints / totalUsers) : 0,
      activeLast7Days: activeCount,
    });
  };

  if (loading || !isAuthorized) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-dvh bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1E407C] mb-6">Analytics Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Activities Logged</p>
            <p className="text-3xl font-bold">{stats.totalActivities}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Average Points per User</p>
            <p className="text-3xl font-bold">{stats.avgPoints}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Active Users (Last 7 Days)</p>
            <p className="text-3xl font-bold">{stats.activeLast7Days}</p>
          </div>
        </div>
        <div className="mt-6">
          <button onClick={() => router.push("/admin")} className="text-[#1E407C] underline text-sm">Back to Admin Dashboard</button>
        </div>
      </div>
    </div>
  );
}