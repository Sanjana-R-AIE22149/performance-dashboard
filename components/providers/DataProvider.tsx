"use client";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { InitialData, DataPoint } from "@/lib/types";

type SeriesBufferMeta = {
  buffer: Float64Array; 
  capacity: number;
  writePtr: number;
  length: number; 
  color?: string;
  label?: string;
};

type DataContextType = {
  buffers: Map<string, SeriesBufferMeta>;
  setDataRate: (ms: number) => void;
  startStressTest: () => void;
  stopStressTest: () => void;
  isStress: boolean;
  dataRate: number;
  setActiveChart: (id: string | null) => void;
  activeChart: string | null;
  setViewMode: (mode: "overview" | "focus") => void;
  viewMode: "overview" | "focus";
  setHoverTimestamp: (ts: number | null) => void;
  hoverTimestamp: number | null;
};

const DataContext = createContext<DataContextType | null>(null);

export default function DataProvider({ initialData, children }: { initialData: InitialData; children: React.ReactNode }) {
  const buffersRef = useRef<Map<string, SeriesBufferMeta>>(new Map());
  const workerRef = useRef<Worker | null>(null);
  const [dataRate, setDataRateState] = useState<number>(100);
  const [isStress, setIsStress] = useState(false);
  const [viewMode, setViewMode] = useState<"overview" | "focus">("overview");
  const [activeChart, setActiveChart] = useState<string | null>(null);
  const [hoverTimestamp, setHoverTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const defaultCapacityPoints = 131072; 
    initialData.series.forEach((s) => {
      const capacity = Math.max(defaultCapacityPoints * 2, s.points.length * 4); 
      const arr = new Float64Array(capacity);
      let idx = 0;
      for (let i = 0; i < s.points.length; i++) {
        arr[idx++] = s.points[i].t;
        arr[idx++] = s.points[i].v;
      }
      buffersRef.current.set(s.id, { buffer: arr, capacity: capacity, writePtr: idx % capacity, length: s.points.length, color: s.color, label: s.label });
    });
  }, [initialData]);

  const appendPoints = useCallback((id: string, pts: DataPoint[]) => {
    const meta = buffersRef.current.get(id);
    if (!meta) return;
    const { buffer, capacity } = meta;
    let { writePtr, length } = meta;
    for (let p of pts) {
      buffer[writePtr] = p.t;
      writePtr = (writePtr + 1) % capacity;
      buffer[writePtr] = p.v;
      writePtr = (writePtr + 1) % capacity;
      length = Math.min(length + 1, capacity / 2);
    }
    meta.writePtr = writePtr;
    meta.length = length;
  }, []);

 
  useEffect(() => {
    if (workerRef.current) return;
    const seriesIds = Array.from(buffersRef.current.keys());
    const code = `
      let baseVals = ${JSON.stringify(Array.from(buffersRef.current.values()).map((m)=> (Math.random()*50)))};
      let running = true;
      self.onmessage = function(e){
        const cfg = e.data;
        if (!cfg) return;
        const ids = cfg.ids || [];
        const interval = cfg.interval || 100;
        if (self._tick) clearInterval(self._tick);
        self._tick = setInterval(() => {
          const now = Date.now();
          const batch = ids.map((id, idx) => {
            const points = [];
            const count = cfg.pointsPerTick || 1;
            baseVals[idx] = (baseVals[idx] || (Math.random()*50)) + (Math.random()-0.5)*2;
            for (let i=0;i<count;i++){
              points.push({ t: now + i, v: baseVals[idx] + Math.sin((now + i)/1000 + idx) * 8 });
            }
            return { id, points };
          });
          self.postMessage(batch);
        }, interval);
      };
    `;
    const blob = new Blob([code], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const w = new Worker(url);
    workerRef.current = w;
    w.onmessage = (ev: MessageEvent) => {
      const batch = ev.data as Array<{ id: string; points: DataPoint[] }>;

      for (const b of batch) {
        appendPoints(b.id, b.points);
      }
    };
    
    w.postMessage({ ids: seriesIds, interval: dataRate, pointsPerTick: 1 });
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      URL.revokeObjectURL(url);
    };
  }, [appendPoints, dataRate]);

  
  useEffect(() => {
    const w = workerRef.current;
    if (!w) return;
    const seriesIds = Array.from(buffersRef.current.keys());
    const pointsPerTick = dataRate <= 20 ? 5 : dataRate <= 50 ? 2 : 1;
    w.postMessage({ ids: seriesIds, interval: dataRate, pointsPerTick });
  }, [dataRate]);


  const startStressTest = useCallback(() => {
    setIsStress(true);
    setDataRateState((_) => {
      const prev = _;
      const newRate = Math.max(10, Math.floor(prev / 10)); // 10x faster
      return newRate;
    });
  }, []);

  const stopStressTest = useCallback(() => {
    setIsStress(false);
    setDataRateState(100);
  }, []);

  const setDataRate = useCallback((ms: number) => {
    setDataRateState(ms);
  }, []);

  const ctxVal: DataContextType = useMemo(() => ({
    buffers: buffersRef.current,
    setDataRate,
    startStressTest,
    stopStressTest,
    isStress,
    dataRate,
    setActiveChart,
    activeChart,
    setViewMode,
    viewMode,
    setHoverTimestamp,
    hoverTimestamp,
  }), [dataRate, isStress, activeChart, viewMode, hoverTimestamp]);

  return <DataContext.Provider value={ctxVal}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useDataContext must be used inside DataProvider");
  return ctx;
}
