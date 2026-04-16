// Mock login screen that simulates Penn State SSO authentication
// Real implementation would redirect to Microsoft Azure AD, plan on registering for that soon
"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { initializeUserWithRole } from "@/lib/firestore";

interface Props {
  onLogin?: () => void; // kept for compatibility but no longer used
}
export default function LoginScreen() {
  const router = useRouter();

  // Role selection and form inputs
  const [selectedRole, setSelectedRole] = useState<"student" | "counselor" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Real authentication using Firebase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate email domain
    if (!email.endsWith("@psu.edu")) {
      console.warn("[Login] Invalid email domain:", email);
      setError("Please use your Penn State email (@psu.edu)");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError("Please enter your password");
      setIsLoading(false);
      return;
    }

    try {
      // Try to create a new user first
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const { role } = await initializeUserWithRole(user, selectedRole);
      document.cookie = `userRole=${role}; path=/`;
      if (role === "counselor") router.push("/counselor/dashboard");
      else if (role === "admin") router.push("/admin/dashboard");
      else router.push("/student/home");
    } catch (err: any) {
      // If user already exists, try to sign in
      if (err.code === "auth/email-already-in-use") {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const { role } = await initializeUserWithRole(user, selectedRole);
          document.cookie = `userRole=${role}; path=/`;
          if (role === "counselor") router.push("/counselor");
          else if (role === "admin") router.push("/admin");
          else router.push("/student/home");
        } catch (signInErr: any) {
          console.error("[Login] Sign in error:", signInErr);
          setError("Invalid password. Please try again.");
        }
      } else {
        // Other errors (e.g., weak password, network)
        console.error("[Login] Creation error:", err);
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mock SSO button – simulates how redirecting to Penn State's sso would work
  const handleSSORedirect = () => {
    console.log("[Login] Initiating Penn State SSO redirect (mock)");
    // Real implementation will redirect to Azure AD
    setError("Real Penn State SSO will be added after registration.");
  };

  console.log("[Login] Rendering login screen");

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-white px-6">
      {/* Penn State branding */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 text-center"
      >
        <div className="w-20 h-20 bg-[#1E407C] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-3xl font-bold">PSU</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1E407C]">Penn State Sign In</h1>
        <p className="text-gray-500 text-sm mt-1">
          Use your Penn State Access Account
        </p>
      </motion.div>

      {/* SSO button – Blue to match penn states colors */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={handleSSORedirect}
        disabled={isLoading}
        className="w-full max-w-sm py-4 mb-4 bg-[#1E407C] text-white font-semibold rounded-xl shadow-lg hover:bg-[#0F2B55] transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Redirecting...</span>
          </div>
        ) : (
          "Sign in with Penn State SSO"
        )}
      </motion.button>

      {/* 3. Divider (fallback) */}
      <div className="flex items-center gap-4 w-full max-w-sm mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Role selector */}
      <div className="w-full max-w-sm mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I am a...
        </label>
        <div className="flex gap-2">
          {(["student", "counselor", "admin"] as const).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium capitalize transition-colors ${
                selectedRole === role
                  ? "bg-[#1E407C] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Manual login form for demo, real SSO wouldn't need this) */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Penn State Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="abc123@psu.edu"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E407C] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E407C] focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </motion.button>
      </form>
      {/* Mock explanation at bottom of login screen */}
      <p className="text-xs text-gray-400 text-center mt-8 max-w-sm">
        This is a demo mockup. Real implementation requires registering for Penn State Azure SSO.
        <br />
        Format: username@psu.edu
      </p>
    </div>
  );
}