"use client";

import React from "react";
import ControlPanel from "@/components/controls/ControlPanel";
import DashboardGridClient from "@/components/DashboardGridClient";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";
import DataTable from "@/components/ui/DataTable";

export default function DashboardShell() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 min-h-screen bg-[#0B0F1A] text-gray-100">
      {/* Left Sidebar */}
      <ControlPanel />

      {/* Right Main Content */}
      <main className="flex-1 space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-xl font-semibold">Performance Dashboard</h1>
          <p className="text-gray-400">
            Real-time charts — 10,000+ points powered by a Web Worker
          </p>
        </header>

        
        <DashboardGridClient />

      
        <PerformanceMonitor />
      </main>
    </div>
  );
}
