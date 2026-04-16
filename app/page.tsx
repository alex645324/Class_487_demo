"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userAuth } from "@/lib/userAuth";
import LoginScreen from "@/components/LoginScreen";
import { getUserData } from "@/lib/firestore";

export default function Home() {
  const { user, loading } = userAuth();
  const router = useRouter();

  // If already logged in, read their saved role and redirect
  useEffect(() => {
    if (!loading && user) {
      getUserData(user).then((data) => {
        const role = data.role || "student";
        if (role === "counselor") router.push("/counselor");
        else if (role === "admin") router.push("/admin");
        else router.push("/student/home");
      });
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;
  if (!user) return <LoginScreen />;
  return <div className="min-h-dvh flex items-center justify-center">Redirecting...</div>;
}