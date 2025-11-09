"use client";

import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

export default function PerformanceMonitor() {
  const {
    fps,
    heap,
    cpu,
    latency,
  } = usePerformanceMonitor();

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900/80 backdrop-blur-md 
                    p-4 rounded-lg shadow-xl text-sm w-64 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-2">Performance</h2>

      <div className="flex justify-between">
        <span className="text-gray-400">FPS</span>
        <span className="text-blue-300 font-semibold">{fps}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-400">CPU</span>
        <span className="text-emerald-300 font-semibold">
          {cpu.toFixed(1)}%
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-400">Heap</span>
        <span className="text-yellow-300 font-semibold">
          {heap !== null ? `${heap} MB` : "N/A"}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-400">Latency</span>
        <span className="text-pink-300 font-semibold">
          {latency.toFixed(1)} ms
        </span>
      </div>
    </div>
  );
}
