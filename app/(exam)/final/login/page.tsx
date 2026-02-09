"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function SpiderVerseLogin() {
  const [formData, setFormData] = useState({ email: "", teamId: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Normalize data
    const submissionData = {
      email: formData.email.toLowerCase().trim(),
      teamId: formData.teamId.toUpperCase().trim(),
    };

    try {
      const response = await fetch("/api/final/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Identity Verified. Accessing Test Protocol...", {
          style: {
            border: '1px solid #059669',
            padding: '16px',
            color: '#fff',
            background: '#000',
            fontFamily: 'monospace',
            fontSize: '12px',
            textTransform: 'uppercase'
          },
          iconTheme: { primary: '#059669', secondary: '#fff' },
        });

        // --- NEW: USE COOKIES INSTEAD OF LOCALSTORAGE ---
        
        // 1. Serialize and Encode the data (Base64) to make it safe for cookies
        // This also makes it look like an "Encrypted Token" in the browser
        const payload = btoa(JSON.stringify(data.user));

        // 2. Set the Cookie manually
        // max-age=3600 -> Expries in 1 hour
        // SameSite=Strict -> Protects against CSRF
        // path=/ -> Available on all pages (like /final/test)
        document.cookie = `spider_session=${payload}; path=/; max-age=3600; SameSite=Strict`;

        // 3. Redirect
        setTimeout(() => router.push("/final/test"), 1500);
      } else {
        toast.error(data.message || "Anomaly detected. Access denied.", {
          style: {
            border: '1px solid #e11d48',
            padding: '16px',
            color: '#fff',
            background: '#000',
            fontFamily: 'monospace',
            fontSize: '12px',
            textTransform: 'uppercase'
          },
          iconTheme: { primary: '#e11d48', secondary: '#fff' },
        });
      }
    } catch (err) {
      toast.error("Multiverse connection lost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <style href="spiderverse-login" precedence="default">{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes glitch {
          0% { text-shadow: 2px 2px 0px #ff0000, -2px -2px 0px #444; transform: translate(0); }
          20% { text-shadow: -2px 2px 0px #ff0000, 2px -2px 0px #444; transform: translate(-2px, 2px); }
          40% { text-shadow: 2px -2px 0px #ff0000, -2px 2px 0px #444; transform: translate(2px, -2px); }
          60% { text-shadow: -2px -2px 0px #ff0000, 2px 2px 0px #444; transform: translate(-2px, -2px); }
          80% { text-shadow: 2px 2px 0px #ff0000, -2px -2px 0px #444; transform: translate(2px, 2px); }
          100% { text-shadow: 2px 2px 0px #ff0000, -2px -2px 0px #444; transform: translate(0); }
        }
        .comic-grid {
          background-image: radial-gradient(#222 15%, transparent 16%);
          background-size: 20px 20px;
        }
        .glitch-text:hover {
          animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-xy 3s ease infinite;
        }
      `}</style>

      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] text-white selection:bg-red-600 selection:text-white">
        <div className="absolute inset-0 z-0 comic-grid opacity-30 pointer-events-none"></div>

        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-900/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full animate-pulse delay-700"></div>

        <div className="relative z-10 w-full max-w-md p-6">
          <div className="group relative bg-black/80 backdrop-blur-2xl border border-red-900/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden transition-all hover:border-red-600/40 hover:shadow-[0_0_60px_rgba(225,29,72,0.1)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-900 to-black"></div>

            <div className="p-8">
              <div className="mb-10 text-center">
                <h1 className="glitch-text text-5xl font-black italic tracking-tighter uppercase text-white drop-shadow-[4px_4px_0px_rgba(153,27,27,0.8)] cursor-default">
                  SPIDER
                  <span className="block text-red-600 mt-1 text-4xl">ACCESS</span>
                </h1>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="h-[2px] w-12 bg-red-700"></div>
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gray-500">
                    SOCIETY PROTOCOL
                  </span>
                  <div className="h-[2px] w-12 bg-red-700"></div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-1 block pl-1">
                    Identity Signature
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      // Forces visual lowercase as they type
                      onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                      className="w-full bg-[#0a0a0a] border-2 border-[#1a1a1a] text-white p-3 rounded-lg font-mono focus:outline-none focus:border-red-600 focus:shadow-[0_0_15px_rgba(225,29,72,0.2)] transition-all placeholder:text-gray-800 lowercase"
                      placeholder="miles.morales@society.com"
                    />
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-1 block pl-1">
                    Security Key
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.teamId}
                      // Forces visual uppercase for the Team ID
                      onChange={(e) => setFormData({ ...formData, teamId: e.target.value.toUpperCase() })}
                      className="w-full bg-[#0a0a0a] border-2 border-[#1a1a1a] text-white p-3 rounded-lg font-mono focus:outline-none focus:border-red-600 focus:shadow-[0_0_15px_rgba(225,29,72,0.2)] transition-all placeholder:text-gray-800 uppercase"
                      placeholder="AZ-105"
                    />
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full group overflow-hidden rounded-lg mt-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-800 via-red-600 to-red-900 animate-gradient"></div>
                  <div className="relative bg-black m-[1px] rounded-md py-4 group-hover:bg-transparent transition-all duration-300">
                    <span className="block text-center font-black italic uppercase tracking-widest text-white group-hover:scale-105 transition-transform">
                      {loading ? "Verifying..." : "Initialize Leap"}
                    </span>
                  </div>
                </button>
              </form>
            </div>

            <div className="h-2 w-full flex opacity-80">
              <div className="w-[40%] bg-red-700"></div>
              <div className="w-[5%] bg-black"></div>
              <div className="w-[10%] bg-red-600"></div>
              <div className="w-[5%] bg-black"></div>
              <div className="w-[40%] bg-red-800"></div>
            </div>
          </div>

          <div className="mt-6 text-center opacity-30">
            <p className="text-[9px] font-mono text-white uppercase tracking-[0.4em]">
              Authorized Personnel Only // Earth-616
            </p>
          </div>
        </div>
      </div>
    </>
  );
}