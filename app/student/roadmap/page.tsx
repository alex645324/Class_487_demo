"use client";
import CareerRoadmap from "@/components/CareerRoadmap";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function RoadmapPage() {
  return (
    <div className="min-h-dvh bg-white">
      <div className="bg-[#1E407C] text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#1E407C] font-bold text-lg">PSU</span>
          </div>
          <h1 className="text-xl font-bold">Career Roadmap</h1>
        </div>
        <HamburgerMenu currentPage="roadmap" />
      </div>
      <CareerRoadmap />
    </div>
  );
}