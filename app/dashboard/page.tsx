import { ActivitySection } from "@/components/dashboard/overview/activity-section";
import { AICopilotCard } from "@/components/dashboard/overview/ai-copilot-card";
import { OverviewHero } from "@/components/dashboard/overview/overview-hero";
import { PriorityTickets } from "@/components/dashboard/overview/priority-tickets";
import { StatsGrid } from "@/components/dashboard/overview/stats-grid";

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-6 lg:p-10">
      <OverviewHero />

      <StatsGrid />

      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <PriorityTickets />

        <AICopilotCard />
      </section>

      <ActivitySection />
    </div>
  );
}