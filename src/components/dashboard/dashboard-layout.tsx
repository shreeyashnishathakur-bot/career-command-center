"use client";

import { useState, type ReactNode } from "react";
import { DashboardSidebar, DashboardSidebarDrawer } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";

export function DashboardLayout({
  title = "Dashboard",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-background">
      <DashboardSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((v) => !v)} />
      <DashboardSidebarDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar title={title} onOpenMenu={() => setDrawerOpen(true)} />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
