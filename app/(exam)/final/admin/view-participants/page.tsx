"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Participant {
  _id: string;
  name: string;
  email: string;
  teamId: string;
  college: string;
  department: string;
  createdAt: string;
}

export default function ViewParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const res = await fetch("/api/final/get-users"); // Adjust to your actual GET route
      if (res.ok) {
        const result = await res.json();
        setParticipants(result.data || []);
      }
    } catch (err) {
      toast.error("Failed to sync with database.");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (participants.length === 0) return toast.error("No data to export");

    const headers = ["Name,Email,Team ID,College,Department,Date\n"];
    const rows = participants.map(p => 
      `${p.name},${p.email},${p.teamId},${p.college},${p.department},${new Date(p.createdAt).toLocaleDateString()}`
    );
    
    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Spider_Society_Operatives_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Data exported to CSV");
  };

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.teamId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-red-600/30 pb-6">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              Operative <span className="text-red-600">Manifest</span>
            </h1>
            <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Earth-616 Authorized Access Only</p>
          </div>
          
          <div className="flex gap-3">
            <input 
              type="text"
              placeholder="Search by Name or Team ID..."
              className="bg-[#111] border border-white/10 px-4 py-2 rounded-lg focus:border-red-600 outline-none w-64 text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={exportToCSV}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-2 rounded-lg transition-all uppercase tracking-widest"
            >
              Export CSV
            </button>
          </div>
        </header>

        <div className="bg-[#111] rounded-xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-red-600/10 border-b border-white/10">
                  <th className="p-4 text-xs uppercase text-red-500 font-bold">Operative</th>
                  <th className="p-4 text-xs uppercase text-red-500 font-bold">Team ID</th>
                  <th className="p-4 text-xs uppercase text-red-500 font-bold">Affiliation (College)</th>
                  <th className="p-4 text-xs uppercase text-red-500 font-bold">Department</th>
                  <th className="p-4 text-xs uppercase text-red-500 font-bold text-right">Registry Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-500 italic">Syncing with Multiverse...</td></tr>
                ) : filteredParticipants.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-500 italic">No operatives found in this sector.</td></tr>
                ) : (
                  filteredParticipants.map((p) => (
                    <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <div className="font-bold text-white group-hover:text-red-500 transition-colors">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.email}</div>
                      </td>
                      <td className="p-4 font-mono text-sm text-red-400">{p.teamId}</td>
                      <td className="p-4 text-sm text-gray-300">{p.college}</td>
                      <td className="p-4 text-sm text-gray-300">{p.department}</td>
                      <td className="p-4 text-sm text-gray-500 text-right">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <footer className="mt-6 text-right">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">Total Active Operatives: {filteredParticipants.length}</p>
        </footer>
      </div>
    </div>
  );
}