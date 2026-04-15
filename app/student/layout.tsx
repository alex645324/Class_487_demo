"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userAuth } from "@/lib/userAuth";
import { getUserData } from "@/lib/firestore";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = userAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      getUserData(user).then((data) => {
        if (data.role !== "student") router.push("/");
      });
    }
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  return <>{children}</>;
}