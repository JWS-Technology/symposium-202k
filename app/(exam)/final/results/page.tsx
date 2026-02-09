"use client";

import { useEffect, useState } from "react";
import { FaTrophy, FaExclamationTriangle, FaSearch, FaSpider, FaFileExcel, FaFilePdf, FaMask } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- TYPES ---
type AnswerDetail = {
  questionId: string;
  isCorrect: boolean;
  marksObtained: number;
};

type Result = {
  _id: string;
  name: string;
  email: string;
  teamId: string;
  totalScore: number;
  violations: number;
  answers: AnswerDetail[];
};

export default function AdminResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/final/get-results");
        const data = await res.json();
        if (res.ok) {
          setResults(data.results);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to connect to the Multiverse.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // --- 🟢 EXCEL EXPORT ---
  const exportToExcel = () => {
    const sheetData = results.map((r, i) => ({
      "Rank": i + 1,
      "Agent Name": r.name,
      "Identity (Email)": r.email,
      "Dimension ID (Team)": r.teamId,
      "Total XP": r.totalScore,
      "Anomalies (Violations)": r.violations,
      "Sync Rate (Accuracy)": `${Math.round((r.answers.filter(a => a.isCorrect).length / r.answers.length) * 100) || 0}%`
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Spider_Society_Log");
    XLSX.writeFile(workbook, "Spider_Society_Mission_Report.xlsx");
  };

  // --- 🔴 PDF EXPORT (ULTIMATE SPIDER-VERSE THEME) ---
  const exportToPDF = () => {
    const doc = new jsPDF();

    // 1. Background (Deep Space Black)
    doc.setFillColor(10, 10, 15);
    doc.rect(0, 0, 210, 297, "F");

    // 2. Decorative Glitch Lines
    doc.setDrawColor(255, 0, 64); // Neon Red
    doc.setLineWidth(2);
    doc.line(10, 25, 60, 25);
    
    doc.setDrawColor(0, 240, 255); // Neon Cyan
    doc.line(62, 25, 200, 25);

    // 3. Header Text
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text("SPIDER SOCIETY", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("courier", "normal");
    doc.setTextColor(255, 0, 64); // Red Accent
    doc.text("TOP SECRET // MULTIVERSE LEVEL 5 CLEARANCE", 14, 32);

    doc.setTextColor(0, 240, 255); // Cyan Accent
    doc.text(`GENERATED: ${new Date().toLocaleString().toUpperCase()}`, 14, 38);

    // 4. Data Table
    const tableData = results.map((r, i) => [
      `#${i + 1}`,
      r.name.toUpperCase(),
      r.teamId,
      r.totalScore,
      r.violations > 0 ? `⚠ ${r.violations}` : "CLEAN",
      `${Math.round((r.answers.filter(a => a.isCorrect).length / r.answers.length) * 100) || 0}%`
    ]);

    autoTable(doc, {
      startY: 45,
      head: [["RANK", "AGENT", "UNIT ID", "XP", "STATUS", "SYNC RATE"]],
      body: tableData,
      theme: "grid",
      styles: {
        fillColor: [20, 20, 25],     // Dark Row Bg
        textColor: [220, 220, 220],  // Light Grey Text
        lineColor: [40, 40, 50],     // Subtle borders
        lineWidth: 0.1,
        font: "courier",
        fontSize: 10
      },
      headStyles: {
        fillColor: [255, 0, 64],     // Spider-Man Red Header
        textColor: [255, 255, 255],  
        fontStyle: "bolditalic",
        halign: "center"
      },
      alternateRowStyles: {
        fillColor: [25, 25, 30],     
      },
      columnStyles: {
        0: { halign: "center", fontStyle: "bold", textColor: [255, 215, 0] }, // Rank Gold
        3: { halign: "right", fontStyle: "bold", textColor: [0, 240, 255] }, // XP Cyan
        4: { halign: "center", textColor: [255, 80, 80] } // Status Red
      }
    });

    // 5. Save
    doc.save("Multiverse_Mission_Report.pdf");
  };

  // --- RENDER LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-mono relative overflow-hidden">
        {/* Comic Dot Pattern Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <FaSpider className="text-red-600 text-7xl animate-bounce relative z-10 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
        <p className="text-cyan-400 mt-6 tracking-[0.5em] font-black uppercase animate-pulse relative z-10">
          Syncing Across Dimensions...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans selection:bg-red-600 selection:text-white relative overflow-hidden">
      {/* --- BACKGROUND FX --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05),transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col xl:flex-row items-start xl:items-end justify-between mb-12 border-b-2 border-red-600/50 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-red-600 text-black text-[10px] font-black px-2 py-1 uppercase tracking-widest transform -skew-x-12">
                Top Secret
              </span>
              <span className="text-cyan-500 font-mono text-xs tracking-widest animate-pulse">
                LIVE FEED // EARTH-616
              </span>
            </div>
            
            {/* GLITCH TITLE EFFECT */}
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-[4px_4px_0px_rgba(220,38,38,1)]">
              SPIDER <span className="text-white">SOCIETY</span>
            </h1>
            <p className="text-gray-400 font-mono text-sm mt-2 uppercase tracking-[0.3em]">
              Multiverse Anomaly Detection & Ranking
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-black/50 border border-zinc-800 px-6 py-3 rounded-lg backdrop-blur-md flex items-center gap-3">
              <FaSearch className="text-cyan-400" />
              <div className="flex flex-col">
                <span className="text-2xl font-black italic leading-none">{results.length}</span>
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Active Agents</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={exportToExcel}
                className="group relative px-6 py-3 bg-zinc-900 border border-green-700 hover:bg-green-900/20 text-green-500 rounded-lg font-bold uppercase tracking-widest text-xs transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2"><FaFileExcel className="text-lg"/> CSV_Log</span>
                <div className="absolute inset-0 bg-green-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </button>
              
              <button 
                onClick={exportToPDF}
                className="group relative px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-black italic uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]"
              >
                <span className="flex items-center gap-2"><FaFilePdf className="text-lg"/> Export Report</span>
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="p-6 bg-red-950/30 border-l-4 border-red-600 text-red-200 mb-8 font-mono text-sm flex items-center gap-4">
            <FaExclamationTriangle className="text-2xl animate-pulse" />
            <div>
              <p className="font-bold">SYSTEM FAILURE</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* --- HOLOGRAPHIC LEADERBOARD --- */}
        <div className="relative group">
          {/* Glowing border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-cyan-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/80 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-zinc-800">
                  <th className="p-6">Rank</th>
                  <th className="p-6">Agent Identity</th>
                  <th className="p-6 hidden md:table-cell">Unit ID</th>
                  <th className="p-6 text-center">Sync Rate</th>
                  <th className="p-6 text-center">Anomalies</th>
                  <th className="p-6 text-right">XP Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {results.map((result, index) => {
                  const totalQuestions = result.answers.length;
                  const correctAnswers = result.answers.filter(a => a.isCorrect).length;
                  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

                  return (
                    <tr 
                      key={result._id} 
                      className="group/row hover:bg-white/[0.02] transition-colors relative"
                    >
                      {/* Rank Column */}
                      <td className="p-6 relative">
                        <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-black italic text-lg border-2 
                          ${index === 0 ? "bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]" : 
                            index === 1 ? "bg-gray-400/20 border-gray-400 text-gray-300" : 
                            index === 2 ? "bg-orange-700/20 border-orange-600 text-orange-500" : "bg-zinc-900 border-zinc-700 text-zinc-500"}`}>
                          {index === 0 ? <FaTrophy /> : index + 1}
                        </div>
                        {/* Connecting Line for top 3 */}
                        {index < 3 && <div className="absolute left-0 top-1/2 w-1 h-6 -translate-y-1/2 bg-current opacity-50"></div>}
                      </td>

                      {/* Agent Name */}
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 group-hover/row:border-red-600/50 transition-colors">
                            <FaMask className="text-zinc-600 group-hover/row:text-red-500 transition-colors" />
                          </div>
                          <div>
                            <div className="font-black text-lg text-white italic tracking-wide group-hover/row:text-cyan-400 transition-colors">
                              {result.name}
                            </div>
                            <div className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">{result.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Team ID */}
                      <td className="p-6 hidden md:table-cell">
                        <span className="font-mono text-cyan-700 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/50">
                          {result.teamId}
                        </span>
                      </td>
                      
                      {/* Accuracy Bar */}
                      <td className="p-6 text-center">
                        <div className="w-full max-w-[120px] h-1.5 bg-zinc-800 rounded-full overflow-hidden mx-auto mb-2 relative">
                          <div 
                            className={`h-full relative ${accuracy >= 80 ? 'bg-green-500' : accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-600'}`} 
                            style={{ width: `${accuracy}%` }}
                          >
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 animate-pulse"></div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500">{accuracy}% SYNCHRONIZED</span>
                      </td>

                      {/* Violations */}
                      <td className="p-6 text-center">
                        {result.violations > 0 ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded border border-red-500/30">
                            <FaExclamationTriangle className="text-xs animate-pulse" /> 
                            <span className="font-mono text-xs font-bold">{result.violations}</span>
                          </div>
                        ) : (
                          <span className="text-zinc-700 text-[10px] font-mono uppercase tracking-widest">Stable</span>
                        )}
                      </td>

                      {/* Score */}
                      <td className="p-6 text-right">
                        <div className="font-black italic text-3xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                          {result.totalScore}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {results.length === 0 && !loading && (
              <div className="p-20 text-center flex flex-col items-center opacity-50">
                <FaSpider className="text-6xl text-zinc-800 mb-4" />
                <p className="text-zinc-500 font-mono uppercase tracking-[0.2em]">No Agents Detected in this Sector</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}