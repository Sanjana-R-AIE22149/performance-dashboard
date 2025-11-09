"use client";

import { useDataContext } from "@/components/providers/DataProvider";

export default function DataTable() {
  const { buffers } = useDataContext();

  const rows: { series: string; x: number; y: number }[] = [];

  buffers.forEach((meta, seriesId) => {
    const arr = meta.buffer;
    for (let i = 0; i < arr.length - 1; i += 2) {
      rows.push({
        series: seriesId,
        x: arr[i],
        y: arr[i + 1],
      });
    }
  });

 
  const lastRows = rows.slice(-200);

  return (
    <div className="bg-[#0c111a] border border-gray-800 rounded-xl p-4 max-h-64 overflow-auto">
      <table className="w-full text-sm text-gray-300">
        <thead className="text-gray-400">
          <tr>
            <th className="text-left p-1">Series</th>
            <th className="text-left p-1">X</th>
            <th className="text-left p-1">Y</th>
          </tr>
        </thead>

        <tbody>
          {lastRows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-800/40">
              <td className="p-1">{row.series}</td>
              <td className="p-1">{row.x.toFixed(2)}</td>
              <td className="p-1">{row.y.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
