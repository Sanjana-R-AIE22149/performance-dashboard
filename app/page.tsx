// app/dashboard/page.tsx
import generateInitialDataset from "@/lib/dataGenerator";
import DataProvider from "@/components/providers/DataProvider";
import dynamic from "next/dynamic";

// Load the entire client-side dashboard safely
const DashboardShell = dynamic(
  () => import("@/components/DashboardShell"),
  { ssr: false }
);

export default async function DashboardPage() {
  // Generate initial dataset entirely on the server
  const initialData = await generateInitialDataset({
    seriesCount: 4,
    pointsPerSeries: 10000,
    intervalMs: 100,
  });

  return (
    <DataProvider initialData={initialData}>
      {/* Client-only dashboard UI */}
      <DashboardShell />
    </DataProvider>
  );
}
