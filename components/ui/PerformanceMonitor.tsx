"use client";

import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

export default function PerformanceMonitor() {
  const { fps, heap } = usePerformanceMonitor();

  return (
    <div
      className="
        fixed bottom-4 right-4 z-[9999]
        bg-black/80 backdrop-blur-lg
        px-4 py-2 rounded-lg
        border border-gray-700
        text-xs font-mono text-gray-200 shadow-xl
      "
    >
      <div className="flex justify-between gap-2">
        <span className="text-gray-400">FPS:</span>
        <span className={fps < 40 ? "text-red-400" : fps < 55 ? "text-yellow-300" : "text-green-400"}>
          {fps}
        </span>
      </div>

      {heap !== null && (
        <div className="flex justify-between gap-2">
          <span className="text-gray-400">Heap:</span>
          <span className="text-blue-300">{heap} MB</span>
        </div>
      )}
    </div>
  );
}
