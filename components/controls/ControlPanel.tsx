"use client";
import { useDataContext } from "@/components/providers/DataProvider";

export default function ControlPanel() {
  const ctx = useDataContext();

  return (
    <aside className="w-64 flex-shrink-0 space-y-4">
      <h3 className="text-lg font-semibold text-emerald-400">Controls</h3>

      <div>
        <label className="text-gray-400 text-sm">View Mode</label>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => ctx.setViewMode("overview")}
            className={ctx.viewMode === "overview" ? "bg-emerald-500 text-black" : ""}
          >
            Overview
          </button>
          <button
            onClick={() => ctx.setViewMode("focus")}
            className={ctx.viewMode === "focus" ? "bg-emerald-500 text-black" : ""}
          >
            Focus
          </button>
        </div>
      </div>

      <div>
        <label className="text-gray-400 text-sm">Data Rate ({ctx.dataRate}ms)</label>
        <input
          type="range"
          min={10}
          max={500}
          step={10}
          value={ctx.dataRate}
          onChange={(e) => ctx.setDataRate(Number(e.target.value))}
        />
      </div>

      <div className="flex gap-2">
        <button onClick={ctx.startStressTest} className="bg-red-500 hover:bg-red-600">
          Stress Test
        </button>
        <button onClick={ctx.stopStressTest} className="bg-emerald-500 hover:bg-emerald-600">
          Stop
        </button>
      </div>
    </aside>
  );
}
