"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDashboard } from "./DashboardProvider";
import { displayFont, focus } from "./ui";

const CHURCH_NAME = "Witness for Christ International PH";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/events", label: "Events" },
  { href: "/dashboard/prayer", label: "Prayer requests" },
  { href: "/dashboard/services", label: "Services" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { prayers } = useDashboard();
  const [open, setOpen] = useState(false);
  const newCount = prayers.filter((p) => p.status === "new").length;

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-[#144b78] px-5 py-3 text-white md:hidden">
        <span className={`${displayFont} font-bold`}>Dashboard</span>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="dashboard-nav"
          className={`rounded-md border border-white/30 px-3 py-1.5 ${focus}`}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <aside
        id="dashboard-nav"
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#144b78] pt-16 text-white transition-transform md:translate-x-0 md:pt-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="hidden items-center gap-3 border-b border-white/10 px-5 py-5 md:flex">
          <Image src="/images/church_logo.png" alt="" width={36} height={36} className="h-9 w-auto shrink-0" />
          <span className={`${displayFont} text-sm font-bold leading-snug`}>{CHURCH_NAME}</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Dashboard">
          {NAV.map((n) => {
            const active =
              n.href === "/dashboard" ? pathname === n.href : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between rounded-md px-3 py-2.5 font-semibold ${focus} ${
                  active ? "bg-white text-[#144b78]" : "hover:bg-white/10"
                }`}
              >
                {n.label}
                {n.href.endsWith("prayer") && newCount > 0 && (
                  <span className="rounded-full bg-[#F2A93B] px-2 py-0.5 text-xs font-bold text-[#12372F]">
                    {newCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 px-3 py-4">
          <Link href="/" className={`block rounded-md px-3 py-2.5 hover:bg-white/10 ${focus}`}>
            View website
          </Link>
          {/* TODO: call your real sign-out here, then redirect to /login */}
          <Link href="/login" className={`block rounded-md px-3 py-2.5 hover:bg-white/10 ${focus}`}>
            Sign out
          </Link>
        </div>
      </aside>
    </>
  );
}
