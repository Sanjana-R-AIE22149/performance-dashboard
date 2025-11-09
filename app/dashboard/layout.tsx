import "@/globals.css";

export const metadata = { title: "Performance Dashboard" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#141f3bff", color: "#e6eef8", fontFamily: "Inter, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
