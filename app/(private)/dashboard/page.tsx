"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  todayISO,
  useDashboard,
} from "@/components/dashboard/DashboardProvider";
import {
  PageHeader,
  EmptyState,
  displayFont,
  focus,
} from "@/components/dashboard/ui";

export default function Overview() {
  const { events, prayers, services } = useDashboard();

  // Read today's date only in the browser, after the page has loaded.
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    setToday(todayISO());
  }, []);

  const upcoming = today
    ? events
        .filter((e) => e.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))
    : [];
  const newPrayers = prayers.filter((p) => p.status === "new");
  const recent = [...prayers]
    .sort((a, b) => b.received.localeCompare(a.received))
    .slice(0, 4);

  const stats = [
    {
      label: "Upcoming events",
      value: today ? upcoming.length : "–",
      href: "/dashboard/events",
    },
    {
      label: "New prayer requests",
      value: newPrayers.length,
      href: "/dashboard/prayer",
    },
    {
      label: "Weekly services",
      value: services.length,
      href: "/dashboard/services",
    },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="Welcome back"
        desc="Here’s what needs your attention today."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-lg bg-white p-5 hover:ring-2 hover:ring-[#3996e3] ${focus}`}
          >
            <div className={`${displayFont} text-4xl font-bold tabular-nums`}>
              {s.value}
            </div>
            <div className="mt-1 text-[#1B2723]/70">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="up-events">
          <div className="flex items-baseline justify-between">
            <h2 id="up-events" className={`${displayFont} text-xl font-bold`}>
              Next events
            </h2>
            <Link
              href="/dashboard/events"
              className={`text-sm font-semibold underline underline-offset-4 ${focus}`}
            >
              Manage events
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {upcoming.length === 0 ? (
              <EmptyState>
                No upcoming events. Add one from the Events page.
              </EmptyState>
            ) : (
              upcoming.slice(0, 4).map((e) => (
                <div key={e.id} className="rounded-lg bg-white p-4">
                  <p className="font-semibold">{e.title}</p>
                  <p className="text-sm text-[#9A6410]">
                    {formatDate(e.date)} · {e.category}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section aria-labelledby="recent-prayers">
          <div className="flex items-baseline justify-between">
            <h2
              id="recent-prayers"
              className={`${displayFont} text-xl font-bold`}
            >
              Recent prayer requests
            </h2>
            <Link
              href="/dashboard/prayer"
              className={`text-sm font-semibold underline underline-offset-4 ${focus}`}
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recent.length === 0 ? (
              <EmptyState>No prayer requests yet.</EmptyState>
            ) : (
              recent.map((p) => (
                <div key={p.id} className="rounded-lg bg-white p-4">
                  <p className="line-clamp-2">{p.request}</p>
                  <p className="mt-1 text-sm text-[#1B2723]/70">
                    {p.name || "Anonymous"} · {formatDate(p.received)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
