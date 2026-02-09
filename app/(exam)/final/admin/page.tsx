"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

// Fixed: Changed 'name' to 'eventName' to match your API response
interface Event {
  _id: string;
  eventName: string; 
}

export default function OnboardParticipant() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    teamId: "",
    college: "",
    department: "",
    eventId: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events-fetch");
        if (res.ok) {
          const result = await res.json();
          // result.data contains the array of 8 events seen in your screenshot
          setEvents(result.data || []);
        } else {
          toast.error("Failed to load events");
        }
      } catch (err) {
        console.error("Connection error:", err);
      }
    };
    fetchEvents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventId) {
      toast.error("Please select an event");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/final/add-participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Participant added successfully");
        setFormData({
          name: "",
          email: "",
          teamId: "",
          college: "",
          department: "",
          eventId: "",
        });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add user");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 sm:p-12 font-sans">
      <Toaster position="top-right" />

      <div className="max-w-3xl mx-auto">
        <header className="mb-8 border-b border-red-600/30 pb-4">
          <h1 className="text-3xl font-bold">Add Final <span className="text-red-600">Participant</span></h1>
          <p className="text-gray-400 text-sm mt-1">Register participants for the final event database.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#111] p-6 sm:p-10 rounded-xl border border-white/5 shadow-2xl">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Assigned Event</label>
            <div className="relative">
              <select
                required
                name="eventId"
                value={formData.eventId}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all text-lg appearance-none cursor-pointer text-white"
              >
                <option value="" className="bg-[#111]">Select an event</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id} className="bg-[#111]">
                    {event.eventName} {/* Fixed: uses eventName from your API */}
                  </option>
                ))}
              </select>
              {/* Custom Arrow Icon for the dropdown */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Full Name</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all text-lg"
                placeholder="Enter full name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Email Address</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase().trim() })}
                className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all text-lg"
                placeholder="email@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Team ID</label>
              <input
                required
                name="teamId"
                value={formData.teamId}
                onChange={(e) => setFormData({ ...formData, teamId: e.target.value.toUpperCase().trim() })}
                className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all text-lg font-bold"
                placeholder="AZ-198"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">College Name</label>
              <input
                required
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all text-lg"
                placeholder="Enter college name"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Department</label>
            <input
              required
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all text-lg"
              placeholder="Enter department"
            />
          </div>

          <button
            disabled={loading}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg text-xl uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(220,38,38,0.2)]"
          >
            {loading ? "Processing..." : "Register Participant"}
          </button>
        </form>
      </div>
    </div>
  );
}