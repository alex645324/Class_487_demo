"use client";

import { useState, useEffect } from "react";
import { userAuth } from "@/lib/userAuth";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function ResumePage() {
  const { user, loading } = userAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentResumeUrl, setCurrentResumeUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/");
    if (user) loadResumeData();
  }, [user, loading, router]);

  const loadResumeData = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      setCurrentResumeUrl(data.resumeUrl || null);
      setFeedback(data.resumeFeedback || null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!user || !file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `resumes/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { resumeUrl: downloadURL });

      setCurrentResumeUrl(downloadURL);
      setMessage("Resume uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Error uploading resume. Please try again.");
    } finally {
      setUploading(false);
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
          <h1 className="text-xl font-bold">Resume Upload & Review</h1>
        </div>
        <HamburgerMenu currentPage="resume" />
      </div>

      <div className="p-6 max-w-md mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Upload a New Resume</h2>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-200 rounded-xl bg-white"
          />
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="mt-2 w-full bg-[#1E407C] text-white p-3 rounded-xl font-bold disabled:opacity-50 hover:bg-[#0F2B55] transition"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
          {message && <p className="text-sm text-center text-green-600 mt-2">{message}</p>}
        </div>

        {currentResumeUrl && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Current Resume</h2>
            <a
              href={currentResumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View/Download
            </a>
          </div>
        )}

        {feedback && (
          <div className="mb-6 p-4 bg-white rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Counselor Feedback</h2>
            <p className="text-gray-700">{feedback}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button onClick={() => router.push("/student/home")} className="text-gray-600 underline hover:text-[#1E407C]">
            Back to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}