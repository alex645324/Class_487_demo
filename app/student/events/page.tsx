"use client";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function EventsPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <div className="bg-[#1E407C] text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#1E407C] font-bold text-lg">PSU</span>
          </div>
          <h1 className="text-xl font-bold">Campus Events</h1>
        </div>
        <HamburgerMenu currentPage="events" />
      </div>

      <div className="flex-1 relative">
        <iframe
          src="https://www.abington.psu.edu/events"
          className="absolute top-0 left-0 w-full h-full border-0"
          title="Penn State Abington Events"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
}