// app/dashboard/page.tsx
import generateInitialDataset from "@/lib/dataGenerator";
import DataProvider from "@/components/providers/DataProvider";
import dynamic from "next/dynamic";


const DashboardShell = dynamic(
  () => import("@/components/DashboardShell"),
  { ssr: false }
);

export default async function DashboardPage() {
  const initialData = await generateInitialDataset({
    seriesCount: 4,
    pointsPerSeries: 10000,
    intervalMs: 100,
  });

  return (
    <DataProvider initialData={initialData}>
      <DashboardShell />
    </DataProvider>
  );
}
