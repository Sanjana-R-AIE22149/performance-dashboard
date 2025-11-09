"use client";

import { useDataContext } from "@/components/providers/DataProvider";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import ScatterPlot from "@/components/charts/ScatterPlot";
import Heatmap from "@/components/charts/Heatmap";
import React from "react";

// --------------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------------

export default function DashboardGridClient() {
  const { viewMode, activeChart } = useDataContext();

  return viewMode === "overview" 
    ? <OverviewGrid /> 
    : <FocusView activeChart={activeChart} />;
}

// --------------------------------------------------------------
// OVERVIEW GRID (2×2 CHARTS)
// --------------------------------------------------------------

function OverviewGrid() {
  const { setActiveChart, setViewMode } = useDataContext();

  const focus = (id: string) => {
    setActiveChart(id);
    setViewMode("focus");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <ChartCard onClick={() => focus("series-0")}>
        <LineChart seriesId="series-0" />
      </ChartCard>

      <ChartCard onClick={() => focus("series-1")}>
        <BarChart seriesId="series-1" />
      </ChartCard>

      <ChartCard onClick={() => focus("series-2")}>
        <ScatterPlot seriesId="series-2" />
      </ChartCard>

      <ChartCard onClick={() => focus("series-3")}>
        <Heatmap seriesId="series-3" />
      </ChartCard>
    </div>
  );
}

// --------------------------------------------------------------
// FOCUS MODE (SINGLE CHART, CENTERED)
// --------------------------------------------------------------

function FocusView({ activeChart }: { activeChart: string | null }) {
  const { setViewMode } = useDataContext();
  const id = activeChart ?? "series-0";

  const chartMap: Record<string, JSX.Element> = {
    "series-0": <LineChart seriesId={id} height={600} />,
    "series-1": <BarChart seriesId={id} height={600} />,
    "series-2": <ScatterPlot seriesId={id} height={600} />,
    "series-3": <Heatmap seriesId={id} height={600} />,
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Back button */}
      <button
        onClick={() => setViewMode("overview")}
        className="absolute top-4 left-4 px-4 py-2 bg-gray-800/90 text-white rounded-lg shadow hover:bg-gray-700 transition"
      >
        ← Back to Overview
      </button>

      {/* Focus chart container */}
      <div className="w-full max-w-6xl mt-12">
        <FocusCard>{chartMap[id]}</FocusCard>
      </div>
    </div>
  );
}

// --------------------------------------------------------------
// CARD COMPONENTS (WITH CLIPPING & STYLING)
// --------------------------------------------------------------

function ChartCard({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="
        bg-[#0c111a] 
        rounded-2xl 
        shadow-lg 
        p-4 
        cursor-pointer 
        overflow-hidden 
        border border-gray-800 
        hover:shadow-emerald-500/20 
        hover:scale-[1.01] 
        transition-all
      "
    >
      {children}
    </div>
  );
}

function FocusCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        bg-[#0c111a] 
        rounded-2xl 
        shadow-lg 
        p-4 
        border border-gray-800 
        overflow-hidden
      "
    >
      {children}
    </div>
  );
}
