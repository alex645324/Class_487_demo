"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userAuth } from "@/lib/userAuth";
import { addActivity } from "@/lib/activity";
import HamburgerMenu from "@/components/HamburgerMenu";

// Helper to parse date strings like "Apr 21, 2026"
const parseEventDate = (dateStr: string): Date => {
  return new Date(dateStr);
};

const allEvents = [
  // Original dummy events (keep them)
  { title: "Spring Career Fair", date: "Apr 22, 2026", time: "10:00 AM - 2:00 PM", location: "Lares Hall", tag: "Career", points: 100 },
  { title: "Resume Workshop", date: "Apr 25, 2026", time: "3:00 PM - 4:30 PM", location: "Sutherland Room 101", tag: "Workshop", points: 50 },
  { title: "Mock Interview Day", date: "Apr 29, 2026", time: "11:00 AM - 3:00 PM", location: "Cloverly Building", tag: "Career", points: 75 },
  { title: "Networking Night", date: "May 2, 2026", time: "5:30 PM - 7:00 PM", location: "Lares Hall", tag: "Networking", points: 60 },
  { title: "LinkedIn Profile Review", date: "May 6, 2026", time: "1:00 PM - 2:30 PM", location: "Virtual (Zoom)", tag: "Workshop", points: 50 },
  // Real events (April – September 2026)
  { title: "CAPS Sexual Assault Awareness Event", date: "Apr 21, 2026", time: "10:30am – 2:30pm", location: "Lares Lubert Commons 2 - 108/109", tag: "Workshop", points: 50 },
  { title: "Abington LaunchBox Lion Cage Event", date: "Apr 21, 2026", time: "5 – 8pm", location: "Lares Banquet Room", tag: "Networking", points: 60 },
  { title: "Chris Mele & Band Concert", date: "Apr 21, 2026", time: "7 – 9pm", location: "Sutherland Bldg 009 / Room 9 Lobby", tag: "Event", points: 40 },
  { title: "Abington Women Engineers General Meeting", date: "Apr 22, 2026", time: "12:15 – 1:15pm", location: "Sutherland Bldg 227", tag: "Club", points: 100 },
  { title: "Anime and Gaming General Meeting", date: "Apr 22, 2026", time: "12:15 – 1:15pm", location: "Sutherland Bldg 217", tag: "Club", points: 100 },
  { title: "Pre-Health Club General Meeting", date: "Apr 22, 2026", time: "12:15 – 1:15pm", location: "Woodland Bldg 220", tag: "Club", points: 100 },
  { title: "Ab Art Appreciation General Meeting", date: "Apr 22, 2026", time: "12:20 – 1:10pm", location: "Sutherland Bldg 208", tag: "Club", points: 100 },
  { title: "Produce Distribution", date: "Apr 23, 2026", time: "11am – 2pm", location: "Lares Lobby / Sutherland Plaza", tag: "Event", points: 40 },
  { title: "Graduation Fair", date: "Apr 24, 2026", time: "10am – 2pm", location: "Lares Lubert Commons 2 - 108/109", tag: "Career", points: 100 },
  { title: "The Scene General Meeting", date: "Apr 24, 2026", time: "12:20 – 1:20pm", location: "Sutherland Bldg 211", tag: "Club", points: 100 },
  { title: "BOND: Community Celebration 2026", date: "Apr 24, 2026", time: "5 – 8pm", location: "Sutherland Bldg 009", tag: "Networking", points: 60 },
  { title: "PSU Eastern Regional Symposium Lunch", date: "Apr 25, 2026", time: "9am – 4pm", location: "Lares Cafeteria / Lobby", tag: "Career", points: 100 },
  { title: "PSU Eastern Symposium Poster Session", date: "Apr 25, 2026", time: "9am – 4pm", location: "Lares Lubert Commons 2 - 108/109", tag: "Career", points: 100 },
  { title: "PSU Eastern Symposium Poster Session 2", date: "Apr 25, 2026", time: "9am – 4pm", location: "Lares Banquet Room", tag: "Career", points: 100 },
  { title: "The Criminal Justice Association Tabling", date: "Apr 27, 2026", time: "12:30 – 1:30pm", location: "TBD", tag: "Club", points: 100 },
  { title: "Water Ice & Pretzels with the Police", date: "Apr 28, 2026", time: "12 – 2pm", location: "Sutherland Plaza Upper Patio", tag: "Networking", points: 60 },
  { title: "CISA General Meeting", date: "Apr 28, 2026", time: "12:15 – 1:15pm", location: "Woodland Bldg 112", tag: "Club", points: 100 },
  { title: "Korean Stories of Resistance Part I", date: "Apr 29, 2026", time: "12 – 2pm", location: "Sutherland 122 Conference Room", tag: "Workshop", points: 50 },
  { title: "Music Common Hour Concert", date: "Apr 29, 2026", time: "12:10 – 1:05pm", location: "Sutherland Bldg 009", tag: "Event", points: 40 },
  { title: "Abington Tech and Innovation Society General Meeting", date: "Apr 29, 2026", time: "12:15 – 1:15pm", location: "Woodland Bldg 112", tag: "Club", points: 100 },
  { title: "Spring Concert", date: "Apr 29, 2026", time: "5:30 – 9pm", location: "Sutherland Bldg 009", tag: "Event", points: 40 },
  { title: "Spring 2026 Dance Concert", date: "Apr 30, 2026", time: "8 – 9:30pm", location: "Athletic Bldg - Mezz 3", tag: "Event", points: 40 },
  { title: "The De-Stress Fest", date: "May 1, 2026", time: "9am – 1pm", location: "Lares Lubert Commons 2 - 108/109", tag: "Workshop", points: 50 },
  { title: "Live Well Mindfulness Series", date: "May 4, 2026", time: "12:15 – 12:45pm", location: "Virtual", tag: "Workshop", points: 50 },
  { title: "Touch a Truck Event", date: "Jun 6, 2026", time: "9am – 12pm", location: "Athletic Bldg - ParkingLot", tag: "Event", points: 40 },
  { title: "Abington Library - Author Event", date: "Jun 11, 2026", time: "6 – 9pm", location: "Sutherland Bldg 009", tag: "Workshop", points: 50 },
  { title: "WELCOME DAYS 2026", date: "Aug 17, 2026", time: "7am – 4pm", location: "Sutherland / Lares", tag: "Career", points: 100 },
  { title: "WELCOME DAYS 2026", date: "Aug 21, 2026", time: "7am – 4pm", location: "Sutherland / Lares", tag: "Career", points: 100 },
  { title: "The Amazing Wellness Race", date: "Aug 31, 2026", time: "11am – 2pm", location: "Lares Lubert Commons / IM Field", tag: "Event", points: 40 },
  { title: "Involvement Fair", date: "Sep 1, 2026", time: "10am – 3pm", location: "Athletic Bldg - IM Field", tag: "Career", points: 100 },
  { title: "Involvement Fair", date: "Sep 2, 2026", time: "10am – 3pm", location: "Athletic Bldg - IM Field", tag: "Career", points: 100 },
  { title: "SAAC Pep Rally", date: "Sep 2, 2026", time: "6 – 8pm", location: "Athletic Bldg - IM Field", tag: "Event", points: 40 },
  { title: "Produce Distribution", date: "Sep 3, 2026", time: "11am – 2pm", location: "Sutherland Plaza Lower Lawn", tag: "Event", points: 40 },
  { title: "CAPS Peer Counseling Training", date: "Sep 4, 2026", time: "10am – 4pm", location: "Lares Banquet Room", tag: "Workshop", points: 50 },
  { title: "SOC Meeting", date: "Sep 4, 2026", time: "12 – 2pm", location: "Lares Lubert Commons 2 - 108/109", tag: "Club", points: 100 },
  { title: "CAPS Suicide Prevention Event", date: "Sep 9, 2026", time: "9am – 2pm", location: "Lares Lubert Commons / Sutherland Plaza", tag: "Workshop", points: 50 },
  { title: "FA - Financial Feud", date: "Sep 17, 2026", time: "12 – 1:30pm", location: "Lares Lubert Commons 2 - 108/109", tag: "Workshop", points: 50 },
  { title: "First Gen Welcome Lunch", date: "Sep 21, 2026", time: "11am – 2pm", location: "Lares Banquet Room", tag: "Networking", points: 60 },
  { title: "Alumni Career Panel in Healthcare", date: "Sep 23, 2026", time: "12 – 1:30pm", location: "Lares Lubert Commons 2 - 108/109", tag: "Career", points: 100 },
  { title: "Ice Cream Social: Student, Alumni, Employer Meetup", date: "Sep 30, 2026", time: "3 – 5pm", location: "Lares Lubert Commons / Lobby", tag: "Networking", points: 60 },
];

const tagColors: Record<string, string> = {
  Career: "bg-blue-100 text-blue-700",
  Workshop: "bg-green-100 text-green-700",
  Networking: "bg-purple-100 text-purple-700",
  Club: "bg-yellow-100 text-yellow-700",
  Event: "bg-gray-100 text-gray-700",
};

export default function EventsPage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [attendedEvents, setAttendedEvents] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [upcomingEvents, setUpcomingEvents] = useState(allEvents);

  useEffect(() => {
    if (!loading && !user) router.push("/");
    const stored = localStorage.getItem("attendedEvents");
    if (stored) setAttendedEvents(JSON.parse(stored));
    // Filter events: only show those with date >= today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const filtered = allEvents.filter(event => {
      const eventDate = parseEventDate(event.date);
      return eventDate >= today;
    });
    setUpcomingEvents(filtered);
  }, [user, loading, router]);

  const handleAttend = async (eventTitle: string, points: number) => {
    if (attendedEvents.includes(eventTitle)) {
      setMessage(`You already attended ${eventTitle}`);
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    if (!user) return;
    try {
      await addActivity(user, {
        type: "Event",
        description: `Attended: ${eventTitle}`,
        date: new Date().toISOString().split("T")[0],
      });
      const updated = [...attendedEvents, eventTitle];
      setAttendedEvents(updated);
      localStorage.setItem("attendedEvents", JSON.stringify(updated));
      setMessage(`+${points} points for attending ${eventTitle}!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to log attendance.");
    }
  };

  if (loading) return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;
  if (!user) return null;

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
        {message && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">{message}</div>}
        {upcomingEvents.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No upcoming events at this time.</div>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={`${event.title}-${event.date}`} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
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
                <button
                  onClick={() => handleAttend(event.title, event.points)}
                  disabled={attendedEvents.includes(event.title)}
                  className={`mt-3 px-4 py-2 rounded-lg text-sm font-semibold w-full ${
                    attendedEvents.includes(event.title)
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#1E407C] text-white hover:bg-[#0F2B55]"
                  }`}
                >
                  {attendedEvents.includes(event.title) ? "✓ Attended" : `Attend +${event.points} pts`}
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 text-center">
          <button onClick={() => router.push("/student/home")} className="text-gray-500 underline text-sm">
            Back to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}