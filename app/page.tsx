"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userAuth } from "@/lib/userAuth";
import LoginScreen from "@/components/LoginScreen";
import { initializeUserWithRole } from "@/lib/firestore";

export default function Home() {
  const { user, loading } = userAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      initializeUserWithRole(user).then(({ role }) => {
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