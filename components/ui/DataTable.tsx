// components/ui/DataTable.tsx
"use client";
import React from "react";
import { useDataContext } from "@/components/providers/DataProvider";

export default function DataTable() {
  const { buffers } = useDataContext();
  const ids = Array.from(buffers.keys());

  return (
    <div style={{ maxHeight: 240, overflow: "auto", background: "#0b1220", color: "#cbd5e1", padding: 8, borderRadius: 8 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ fontSize: 12 }}>
          <tr><th style={{ textAlign: "left" }}>Series</th><th>Points</th></tr>
        </thead>
        <tbody>
          {ids.map(id => {
            const meta = buffers.get(id)!;
            return (
              <tr key={id} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                <td style={{ padding: 6 }}>{meta.label ?? id}</td>
                <td style={{ padding: 6 }}>{meta.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
