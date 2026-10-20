"use client";

import { useState } from "react";
import Modal, { ConfirmModal } from "@/components/dashboard/Modal";
import {
  formatDate,
  useDashboard,
  type PrayerItem,
  type PrayerStatus,
} from "@/components/dashboard/DashboardProvider";
import { EmptyState, PageHeader, btnGhost, focus } from "@/components/dashboard/ui";

const STATUSES: { value: PrayerStatus; label: string; badge: string }[] = [
  { value: "new", label: "New", badge: "bg-[#F2A93B]/30 text-[#7a4f0a]" },
  { value: "praying", label: "Praying", badge: "bg-[#3996e3]/15 text-[#144b78]" },
  { value: "answered", label: "Answered", badge: "bg-green-100 text-green-900" },
];

export default function PrayerPage() {
  const { prayers, setPrayerStatus, deletePrayer } = useDashboard();
  const [filter, setFilter] = useState<"all" | PrayerStatus>("all");
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<PrayerItem | null>(null);

  const list = [...prayers]
    .filter((p) => filter === "all" || p.status === filter)
    .sort((a, b) => b.received.localeCompare(a.received));
  const viewing = prayers.find((p) => p.id === viewingId) ?? null;

  const badge = (s: PrayerStatus) => STATUSES.find((x) => x.value === s)!;

  return (
    <div className="space-y-8">
      <PageHeader title="Prayer requests" desc="Requests sent from the website’s prayer form." />

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {[{ value: "all", label: "All" }, ...STATUSES].map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value as "all" | PrayerStatus)}
            aria-pressed={filter === s.value}
            className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold ${focus} ${
              filter === s.value
                ? "border-[#3996e3] bg-[#3996e3] text-white"
                : "border-[#3996e3]/20 bg-white hover:border-[#3996e3]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState>No requests match this filter.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {list.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => {
                  setViewingId(p.id);
                  if (p.status === "new") setPrayerStatus(p.id, "praying");
                }}
                className={`flex w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-white p-5 text-left hover:ring-2 hover:ring-[#3996e3] ${focus}`}
              >
                <div className="min-w-[200px] flex-1">
                  <p className="line-clamp-2 text-lg">{p.request}</p>
                  <p className="mt-1 text-sm text-[#1B2723]/70">
                    {p.name || "Anonymous"} · {formatDate(p.received)}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${badge(p.status).badge}`}>
                  {badge(p.status).label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal open={viewing !== null} title="Prayer request" onClose={() => setViewingId(null)}>
        {viewing && (
          <div className="space-y-5">
            <p className="text-sm text-[#1B2723]/70">
              From {viewing.name || "Anonymous"} on {formatDate(viewing.received)}
            </p>
            <p className="whitespace-pre-wrap text-lg leading-relaxed">{viewing.request}</p>

            <fieldset>
              <legend className="mb-2 font-semibold">Status</legend>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setPrayerStatus(viewing.id, s.value)}
                    aria-pressed={viewing.status === s.value}
                    className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold ${focus} ${
                      viewing.status === s.value
                        ? "border-[#3996e3] bg-[#3996e3] text-white"
                        : "border-[#3996e3]/20 hover:border-[#3996e3]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex justify-between gap-3 pt-2">
              <button
                className={`rounded-md px-4 py-2 font-semibold text-red-700 hover:bg-red-50 ${focus}`}
                onClick={() => {
                  setDeleting(viewing);
                  setViewingId(null);
                }}
              >
                Delete
              </button>
              <button className={btnGhost} onClick={() => setViewingId(null)}>Done</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={deleting !== null}
        title="Delete request?"
        message="This prayer request will be permanently removed."
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) deletePrayer(deleting.id);
          setDeleting(null);
        }}
      />
    </div>
  );
}
