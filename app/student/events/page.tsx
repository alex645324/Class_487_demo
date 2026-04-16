"use client";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";

const placeholderEvents = [
  { title: "Spring Career Fair", date: "Apr 22, 2026", time: "10:00 AM - 2:00 PM", location: "Lares Hall", tag: "Career" },
  { title: "Resume Workshop", date: "Apr 25, 2026", time: "3:00 PM - 4:30 PM", location: "Sutherland Room 101", tag: "Workshop" },
  { title: "Mock Interview Day", date: "Apr 29, 2026", time: "11:00 AM - 3:00 PM", location: "Cloverly Building", tag: "Career" },
  { title: "Networking Night", date: "May 2, 2026", time: "5:30 PM - 7:00 PM", location: "Lares Hall", tag: "Networking" },
  { title: "LinkedIn Profile Review", date: "May 6, 2026", time: "1:00 PM - 2:30 PM", location: "Virtual (Zoom)", tag: "Workshop" },
];

const tagColors: Record<string, string> = {
  Career: "bg-blue-100 text-blue-700",
  Workshop: "bg-green-100 text-green-700",
  Networking: "bg-purple-100 text-purple-700",
};

export default function EventsPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="bg-[#1E407C] text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#1E407C] font-bold text-lg">PSU</span>
          </div>
          <h1 className="text-xl font-bold">Campus Events</h1>
        </div>
        <HamburgerMenu currentPage="events" />
      </div>

      <div className="p-6 max-w-md mx-auto">
        <p className="text-gray-500 text-sm mb-6">Upcoming career and professional development events</p>

        <div className="space-y-4">
          {placeholderEvents.map((event) => (
            <div key={event.title} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold text-gray-900">{event.title}</h2>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${tagColors[event.tag]}`}>
                  {event.tag}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-500">
                <p>{event.date} &middot; {event.time}</p>
                <p>{event.location}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          More events coming soon from Penn State Abington
        </p>

        <div className="mt-6 text-center">
          <button onClick={() => router.push("/student/home")} className="text-gray-500 underline text-sm">
            Back to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}
