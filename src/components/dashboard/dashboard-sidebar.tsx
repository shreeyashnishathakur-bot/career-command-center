"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { ChevronsLeft, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NAV_BOTTOM, NAV_GROUPS, type NavItem } from "./dashboard-nav";

function NavRow({
  item,
  collapsed,
  active,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  const Icon = item.icon;
  const base = cn(
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
    collapsed && "justify-center px-0",
    active
      ? "bg-secondary font-medium text-secondary-foreground"
      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
  );

  const content = (
    <>
      <Icon className="size-4 shrink-0" />
      {!collapsed ? (
        <span className="flex-1 truncate text-left">{item.label}</span>
      ) : null}
      {!collapsed && !item.to ? (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Soon
        </span>
      ) : null}
    </>
  );

  if (!item.to) {
    return (
      <div
        aria-disabled="true"
        title={`${item.label} — coming soon`}
        className={cn(base, "cursor-default opacity-60 hover:bg-transparent hover:text-muted-foreground")}
      >
        {content}
      </div>
    );
  }

  return (
    <Link to={item.to} onClick={onNavigate} className={base} title={collapsed ? item.label : undefined}>
      {content}
    </Link>
  );
}

function SidebarBody({
  collapsed,
  onToggleCollapse,
  onNavigate,
}: {
  collapsed: boolean;
  onToggleCollapse?: (() => void) | undefined;
  onNavigate?: (() => void) | undefined;
}) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-full flex-col gap-6 py-5">
      <div className={cn("flex items-center gap-2.5 px-4", collapsed && "justify-center px-0")}>
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-xl text-primary-foreground"
          style={{ backgroundImage: "var(--gradient-emerald)" }}
        >
          <Rocket className="size-4.5" />
        </span>
        {!collapsed ? (
          <span className="font-display text-[0.95rem] font-semibold leading-tight tracking-tight">
            Career
            <br />
            Launchpad
          </span>
        ) : null}
      </div>

      <nav className={cn("flex flex-1 flex-col gap-5 overflow-y-auto px-3", collapsed && "px-2")}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="space-y-1">
            {!collapsed ? (
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                {group.label}
              </p>
            ) : null}
            {group.items.map((item) => (
              <NavRow
                key={item.label}
                item={item}
                collapsed={collapsed}
                active={item.to === pathname || (item.to === "/dashboard" && pathname === "/dashboard")}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className={cn("space-y-1 border-t border-border px-3 pt-4", collapsed && "px-2")}>
        {NAV_BOTTOM.map((item) => (
          <NavRow key={item.label} item={item} collapsed={collapsed} active={false} onNavigate={onNavigate} />
        ))}
        {onToggleCollapse ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={cn("mt-1 w-full justify-start gap-3 rounded-xl px-3 text-muted-foreground", collapsed && "justify-center px-0")}
          >
            <ChevronsLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed ? <span>Collapse</span> : null}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function DashboardSidebar({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 border-r border-border bg-sidebar transition-[width] duration-300 lg:block",
        collapsed ? "w-[76px]" : "w-[248px]",
      )}
    >
      <SidebarBody collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
    </aside>
  );
}

export function DashboardSidebarDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[264px] bg-sidebar p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarBody collapsed={false} onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
