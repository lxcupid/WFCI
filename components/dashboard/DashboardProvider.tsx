"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/* ---------- TYPES ---------- */
export const CATEGORIES = ["Worship", "Youth", "Community"] as const;
export type Category = (typeof CATEGORIES)[number];

export type EventItem = {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  category: Category;
  desc: string;
};

export type PrayerStatus = "new" | "praying" | "answered";
export type PrayerItem = {
  id: number;
  name: string;
  request: string;
  received: string; // YYYY-MM-DD
  status: PrayerStatus;
};

export type ServiceItem = {
  id: string;
  name: string;
  label: string;
  note: string;
  address: string; // empty = main church address
};

/* ---------- STARTER DATA (replace with your database later) ---------- */
const INITIAL_EVENTS: EventItem[] = [
  { id: 1, title: "Community Potluck", date: "2026-11-02", category: "Community", desc: "Bring a dish to share. Everyone is welcome." },
  { id: 2, title: "Youth Night", date: "2026-11-06", category: "Youth", desc: "Games, worship, and pizza for grades 7–12." },
  { id: 3, title: "Thanksgiving Service", date: "2026-11-26", category: "Worship", desc: "An evening of gratitude and shared testimonies." },
  { id: 4, title: "Food Pantry Drive", date: "2026-12-04", category: "Community", desc: "Donate non-perishables or help us pack boxes." },
  { id: 5, title: "Christmas Eve Candlelight", date: "2026-12-24", category: "Worship", desc: "Carols, scripture readings, and candlelight." },
];

const INITIAL_PRAYERS: PrayerItem[] = [
  { id: 1, name: "Maria", request: "Please pray for my mother's surgery this Friday.", received: "2026-10-19", status: "new" },
  { id: 2, name: "", request: "Strength and direction as I look for a new job.", received: "2026-10-17", status: "praying" },
  { id: 3, name: "Jun", request: "Thankful for my family's safety after the storm.", received: "2026-10-12", status: "answered" },
];

const INITIAL_SERVICES: ServiceItem[] = [
  { id: "sun-early", name: "Sunday Worship", label: "Sunday, 9:00 AM", note: "Hymns and a classic service. About 75 minutes.", address: "" },
  { id: "sun-late", name: "Sunday Worship", label: "Sunday, 11:00 AM", note: "Contemporary music, kids’ program included.", address: "" },
  { id: "wed", name: "Midweek Prayer", label: "Wednesday, 7:00 PM", note: "Scripture, prayer, and fellowship. About 60 minutes.", address: "" },
  { id: "fri", name: "Single's Small Group", label: "Friday, 7:00 PM", note: "Scripture, adventure and fellowship. About 60 minutes. For ages 18-35.", address: "Cocoland Village, San Pablo City, Laguna" },
];

/* ---------- HELPERS ---------- */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export function todayISO() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/* ---------- CONTEXT ---------- */
type DashboardContext = {
  events: EventItem[];
  saveEvent: (e: Omit<EventItem, "id"> & { id?: number }) => void;
  deleteEvent: (id: number) => void;

  prayers: PrayerItem[];
  setPrayerStatus: (id: number, status: PrayerStatus) => void;
  deletePrayer: (id: number) => void;

  services: ServiceItem[];
  saveService: (s: ServiceItem) => void;
};

const Ctx = createContext<DashboardContext | null>(null);

export function useDashboard() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}

export default function DashboardProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [prayers, setPrayers] = useState(INITIAL_PRAYERS);
  const [services, setServices] = useState(INITIAL_SERVICES);

  // TODO: each of these should call your API / database, then update state.
  const value: DashboardContext = {
    events,
    saveEvent: (e) =>
      setEvents((list) =>
        e.id
          ? list.map((x) => (x.id === e.id ? ({ ...e, id: e.id } as EventItem) : x))
          : [...list, { ...e, id: Date.now() }],
      ),
    deleteEvent: (id) => setEvents((l) => l.filter((x) => x.id !== id)),

    prayers,
    setPrayerStatus: (id, status) =>
      setPrayers((l) => l.map((x) => (x.id === id ? { ...x, status } : x))),
    deletePrayer: (id) => setPrayers((l) => l.filter((x) => x.id !== id)),

    services,
    saveService: (s) => setServices((l) => l.map((x) => (x.id === s.id ? s : x))),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
