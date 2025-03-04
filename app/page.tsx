import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardBuilder } from "@/components/dashboard/builder";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto py-6">
        <DashboardBuilder />
      </div>
    </main>
  );
}
