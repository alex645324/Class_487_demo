"use client";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState, useRef, useEffect } from "react";

interface Props {
  currentPage?: "home" | "achievements" | "activities" | "resume" | "events" | "messages" | "questmap"|"feed";
}

export default function HamburgerMenu({ currentPage }: Props) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const menuItems = [
    { id: "home", label: "Home", icon: "🏠", path: "/student/home" },
    { id: "questmap", label: "Quest Map", icon: "🗺️", path: "/student/quest-map" },
    { id: "achievements", label: "Achievements", icon: "🏆", path: "/student/achievements" },
    { id: "activities", label: "Log Activities", icon: "📝", path: "/student/activities" },
    { id: "resume", label: "Upload Resume", icon: "📄", path: "/student/resume" },
    { id: "events", label: "Events", icon: "📅", path: "/student/events" },
    { id: "messages", label: "Messages", icon: "💬", path: "/student/messages" },
    { id: "feed", label: "Social Feed", icon: "👥", path: "/student/feed" },
  ];

  return (
    <div className="ml-auto relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Menu"
      >
        <span className="text-gray-600 text-2xl">☰</span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-2">
          {menuItems.map((item) => {
            if (currentPage === item.id) return null;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition"
              >
                <span className="text-gray-600">{item.icon}</span>
                <span className="text-gray-900 font-medium">{item.label}</span>
              </button>
            );
          })}
          <div className="border-t border-gray-100 my-1"></div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition"
          >
            <span className="text-gray-600">🚪</span>
            <span className="text-gray-900 font-medium">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}