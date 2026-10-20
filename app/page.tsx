"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Fraunces, Hanken_Grotesk } from "next/font/google";

const display = Fraunces({ subsets: ["latin"], weight: ["500", "700"] });
const body = Hanken_Grotesk({ subsets: ["latin"] });

/* ---------- EDIT YOUR CHURCH DETAILS HERE ---------- */
const CHURCH_NAME = "Witness for Christ International PH";
const ADDRESS = "38C9+C5C, M. L. Quezon Street, San Pablo City, Laguna";
const SINGLES_ADDRESS = "Cocoland Village, San Pablo City, Laguna";
const EMAIL = "hello@yourchurch.org";
const PHONE = "(000) 123-4567";

const SERVICES = [
  {
    id: "sun-early",
    name: "Sunday Worship",
    day: 0,
    hour: 9,
    minute: 0,
    label: "Sunday, 9:00 AM",
    note: "Hymns and a classic service. About 75 minutes.",
    bg: "bg-[#E8F1FA]",
    image: "/images/sunday_early.jpg",
  },
  {
    id: "sun-late",
    name: "Sunday Worship",
    day: 0,
    hour: 11,
    minute: 0,
    label: "Sunday, 11:00 AM",
    note: "Contemporary music, kids’ program included.",
    bg: "bg-[#E8F1FA]",
    image: "/images/sunday_late.jpg",
  },
  {
    id: "wed",
    name: "Midweek Prayer",
    day: 3,
    hour: 19,
    minute: 0,
    label: "Wednesday, 7:00 PM",
    note: "Scripture, prayer, and fellowship. About 60 minutes.",
    bg: "bg-[#E8F1FA]",
    image: "/images/midweek_prayer.jpg",
  },
  {
    id: "fri",
    name: "Single's Small Group",
    day: 5,
    hour: 19,
    minute: 0,
    label: "Friday, 7:00 PM",
    note: "Scripture, adventure and fellowship. About 60 minutes. For ages 18-35.",
    address: SINGLES_ADDRESS,
    bg: "bg-[#E8F1FA]",
    image: "/images/singles_sg.jpg",
  },
];

const EVENTS = [
  {
    id: 1,
    title: "Community Potluck",
    date: "Nov 2",
    category: "Community",
    desc: "Bring a dish to share. Everyone is welcome.",
  },
  {
    id: 2,
    title: "Youth Night",
    date: "Nov 6",
    category: "Youth",
    desc: "Games, worship, and pizza for grades 7–12.",
  },
  {
    id: 3,
    title: "Thanksgiving Service",
    date: "Nov 26",
    category: "Worship",
    desc: "An evening of gratitude and shared testimonies.",
  },
  {
    id: 4,
    title: "Food Pantry Drive",
    date: "Dec 4",
    category: "Community",
    desc: "Donate non-perishables or help us pack boxes.",
  },
  {
    id: 5,
    title: "Christmas Eve Candlelight",
    date: "Dec 24",
    category: "Worship",
    desc: "Carols, scripture readings, and candlelight.",
  },
];

const FAQ = [
  {
    q: "What should I wear?",
    a: "Whatever you’re comfortable in. You’ll see everything from jeans to Sunday best.",
  },
  {
    q: "Is there something for my kids?",
    a: "Yes. Nursery for babies and a Sunday school for ages 3–12 run during the 11:00 AM service.",
  },
  {
    q: "Where do I park?",
    a: "Free parking is behind the church. Greeters in yellow vests will point you to the entrance.",
  },
  {
    q: "How long is the service?",
    a: "About an hour. Stay afterward for coffee if you’d like to meet people.",
  },
  {
    q: "Where does the Singles Small Group meet?",
    a: `We meet on Fridays at 7:00 PM at ${SINGLES_ADDRESS}. This is different from our main church address.`,
  },
];

const CATEGORIES = ["All", "Worship", "Youth", "Community"];

/* Add { href: "#ministries", label: "Ministries" } here once you build that section. */
const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#events", label: "Events" },
  { href: "#visit", label: "Visit" },
  { href: "#prayer", label: "Prayer" },
];

/* ---------- HELPERS ---------- */
function nextOccurrence(now: Date, s: (typeof SERVICES)[number]) {
  const d = new Date(now);
  d.setHours(s.hour, s.minute, 0, 0);
  d.setDate(d.getDate() + ((s.day - now.getDay() + 7) % 7));
  if (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 7);
  return d;
}

function getNextService(now: Date) {
  return SERVICES.map((s) => ({
    service: s,
    date: nextOccurrence(now, s),
  })).sort((a, b) => a.date.getTime() - b.date.getTime())[0];
}

/* ---------- COUNTDOWN ---------- */
function Countdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return <div className="h-48" aria-hidden="true" />;

  const { service, date } = getNextService(now);
  const diff = Math.max(0, date.getTime() - now.getTime());
  const units = [
    { label: "days", value: Math.floor(diff / 86400000) },
    { label: "hours", value: Math.floor(diff / 3600000) % 24 },
    { label: "minutes", value: Math.floor(diff / 60000) % 60 },
    { label: "seconds", value: Math.floor(diff / 1000) % 60 },
  ];

  return (
    <div>
      <p className="text-[#F2C879]">Next gathering: {service.label}</p>
      <div
        className="mt-4 grid grid-cols-4 gap-3"
        role="timer"
        aria-label={`Time until ${service.name}`}
      >
        {units.map((u) => (
          <div
            key={u.label}
            className="rounded-lg bg-white/10 px-2 py-4 text-center"
          >
            <div
              className={`${display.className} text-4xl font-bold tabular-nums sm:text-5xl`}
            >
              {String(u.value).padStart(2, "0")}
            </div>
            <div className="mt-1 text-sm text-white/70">{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- PAGE ---------- */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [going, setGoing] = useState<number[]>([]);
  const [prayer, setPrayer] = useState({ name: "", request: "" });
  const [sent, setSent] = useState(false);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const active = SERVICES.find((s) => s.id === selectedService) ?? null;
  const activeAddress =
    (active && "address" in active && active.address) || ADDRESS;
  const visibleEvents = EVENTS.filter(
    (e) => filter === "All" || e.category === filter,
  );

  const toggleGoing = (id: number) =>
    setGoing((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));

  const handlePrayer = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send to your backend / email service later
    console.log("Prayer request:", prayer);
    setSent(true);
  };

  const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2A93B]";

  return (
    <div
      className={`${body.className} min-h-screen bg-[#F4F6F1] text-[#1B2723]`}
    >
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#3996e3]/60 text-white backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a
            href="#top"
            className={`${display.className} flex items-center gap-3 text-base font-bold sm:text-xl ${focus}`}
          >
            <Image
              src="/images/church_logo.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-auto shrink-0"
            />
            <span>{CHURCH_NAME}</span>
          </a>

          <ul className="hidden gap-8 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={`hover:text-[#F2C879] ${focus}`}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className={`rounded-md border border-white/30 px-3 py-2 md:hidden ${focus}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </nav>

        {menuOpen && (
          <ul
            id="mobile-menu"
            className="border-t border-white/10 px-5 pb-4 md:hidden"
          >
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-3 ${focus}`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#12372F] text-white">
          {/* Background image: place your file at public/hero.jpg */}
          <Image
            src="/images/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* Dark overlay so the text stays readable */}
          <div className="absolute inset-0 bg-[#12372F]/80" />

          {/* Content sits on top */}
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-32 md:grid-cols-2 md:items-center md:pb-24 md:pt-40">
            <div>
              <h1
                className={`${display.className} text-5xl font-bold leading-tight sm:text-6xl`}
              >
                There’s a seat saved for you.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">
                Join us for worship, prayer, and a community that shows up for
                each other, every week.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#services"
                  className={`rounded-md bg-[#F2A93B] px-6 py-3 font-semibold text-[#12372F] hover:bg-[#F2C879] ${focus}`}
                >
                  Plan your visit
                </a>
                <a
                  href="#prayer"
                  className={`rounded-md border border-white/40 px-6 py-3 font-semibold hover:bg-white/10 ${focus}`}
                >
                  Request prayer
                </a>
              </div>
            </div>
            <Countdown />
          </div>
        </section>

        {/* SERVICES */}
        <section
          id="services"
          className="relative scroll-mt-20 overflow-hidden bg-[#E8F1FA]"
        >
          {/* Background images: all are stacked, only the active one is visible */}
          {SERVICES.map((s) => (
            <Image
              key={s.id}
              src={s.image}
              alt=""
              fill
              sizes="100vw"
              className={`object-cover transition-opacity duration-500 ${
                s.id === selectedService ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          <div className="absolute inset-0 bg-white/30 " />

          {/* Content sits on top */}
          <div className="relative mx-auto max-w-6xl px-5 py-20">
            <h2 className={`${display.className} text-4xl font-bold`}>
              When we gather
            </h2>
            <p className="mt-3 max-w-xl text-lg">
              Choose a service to see what to expect.
            </p>

            <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.2fr]">
              <div
                role="tablist"
                aria-label="Service times"
                className="flex flex-col gap-2"
              >
                {SERVICES.map((s) => {
                  const on = s.id === selectedService;
                  return (
                    <button
                      key={s.id}
                      id={`tab-${s.id}`}
                      role="tab"
                      aria-selected={on}
                      aria-controls="service-panel"
                      onClick={() => setSelectedService(on ? null : s.id)}
                      className={`rounded-lg border-2 px-5 py-4 text-left transition-colors ${focus} ${
                        on
                          ? "border-[#3996e3] bg-[#3996e3] text-white"
                          : "border-[#3996e3]/20 bg-white hover:border-[#3996e3]"
                      }`}
                    >
                      <span className="block font-semibold">{s.name}</span>
                      <span
                        className={on ? "text-white/80" : "text-[#1B2723]/70"}
                      >
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                id="service-panel"
                role="tabpanel"
                aria-labelledby={active ? `tab-${active.id}` : undefined}
                className="rounded-lg bg-white p-8"
              >
                {active ? (
                  <>
                    <h3 className={`${display.className} text-2xl font-bold`}>
                      {active.name}
                    </h3>
                    <p className="mt-1 font-semibold text-[#9A6410]">
                      {active.label}
                    </p>
                    <p className="mt-4 text-lg leading-relaxed">
                      {active.note}
                    </p>

                    <p className="mt-6">{activeAddress}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-4 inline-block font-semibold underline underline-offset-4 ${focus}`}
                    >
                      Get directions
                    </a>
                  </>
                ) : (
                  <p className="text-lg leading-relaxed text-[#1B2723]/70">
                    Select a service on the left to see the time, what to
                    expect, and where we meet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section id="events" className="scroll-mt-20 bg-white py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className={`${display.className} text-4xl font-bold`}>
              Coming up
            </h2>

            <div
              className="mt-6 flex flex-wrap gap-2"
              role="group"
              aria-label="Filter events"
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  aria-pressed={filter === c}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-semibold ${focus} ${
                    filter === c
                      ? "border-[#3996e3] bg-[#3996e3] text-white"
                      : "border-[#3996e3]/20 hover:border-[#3996e3]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <ul className="mt-8 divide-y divide-[#12372F]/15 border-y border-[#12372F]/15">
              {visibleEvents.map((ev) => {
                const isGoing = going.includes(ev.id);
                return (
                  <li
                    key={ev.id}
                    className="flex flex-wrap items-center gap-x-6 gap-y-3 py-5"
                  >
                    <div
                      className={`${display.className} w-20 text-2xl font-bold`}
                    >
                      {ev.date}
                    </div>
                    <div className="min-w-[200px] flex-1">
                      <h3 className="text-lg font-semibold">{ev.title}</h3>
                      <p className="text-[#1B2723]/80">{ev.desc}</p>
                    </div>
                    <span className="text-sm text-[#1B2723]/70">
                      {ev.category}
                    </span>
                    <button
                      onClick={() => toggleGoing(ev.id)}
                      aria-pressed={isGoing}
                      className={`rounded-md px-4 py-2 font-semibold ${focus} ${
                        isGoing
                          ? "bg-[#F2A93B] text-[#12372F]"
                          : "border-2 border-[#3996e3] hover:bg-[#3996e3] hover:text-white"
                      }`}
                    >
                      {isGoing ? "You’re going" : "I’m going"}
                    </button>
                  </li>
                );
              })}
            </ul>
            {going.length > 0 && (
              <p className="mt-4" aria-live="polite">
                You’re going to {going.length}{" "}
                {going.length === 1 ? "event" : "events"}.
              </p>
            )}
          </div>
        </section>

        {/* VISIT / FAQ */}
        <section
          id="visit"
          className="mx-auto max-w-3xl scroll-mt-20 px-5 py-20"
        >
          <h2 className={`${display.className} text-4xl font-bold`}>
            Your first visit
          </h2>
          <div className="mt-8 divide-y divide-[#12372F]/15 border-y border-[#12372F]/15">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary
                  className={`cursor-pointer list-none text-lg font-semibold ${focus}`}
                >
                  <span className="mr-3 inline-block transition-transform group-open:rotate-90">
                    ›
                  </span>
                  {f.q}
                </summary>
                <p className="mt-3 pl-6 text-lg leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* PRAYER */}
        <section
          id="prayer"
          className="scroll-mt-20 bg-[#255f8f] py-20 text-white"
        >
          <div className="mx-auto max-w-2xl px-5">
            <h2 className={`${display.className} text-4xl font-bold`}>
              How can we pray for you?
            </h2>
            <p className="mt-3 text-lg text-white/80">
              Our prayer team reads every request. Share as much or as little as
              you like.
            </p>

            {sent ? (
              <div className="mt-8 rounded-lg bg-white/10 p-6" role="status">
                <p className="text-xl font-semibold">
                  Thank you{prayer.name ? `, ${prayer.name}` : ""}. We’re
                  praying with you.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setPrayer({ name: "", request: "" });
                  }}
                  className={`mt-4 underline underline-offset-4 ${focus}`}
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handlePrayer} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="name" className="block font-semibold">
                    Your name (optional)
                  </label>
                  <input
                    id="name"
                    value={prayer.name}
                    onChange={(e) =>
                      setPrayer({ ...prayer, name: e.target.value })
                    }
                    className={`mt-2 w-full rounded-md bg-white px-4 py-3 text-[#1B2723] ${focus}`}
                  />
                </div>
                <div>
                  <label htmlFor="request" className="block font-semibold">
                    Prayer request
                  </label>
                  <textarea
                    id="request"
                    required
                    rows={5}
                    value={prayer.request}
                    onChange={(e) =>
                      setPrayer({ ...prayer, request: e.target.value })
                    }
                    className={`mt-2 w-full rounded-md bg-white px-4 py-3 text-[#1B2723] ${focus}`}
                  />
                </div>
                <button
                  type="submit"
                  className={`rounded-md bg-[#F2A93B] px-6 py-3 font-semibold text-[#12372F] hover:bg-[#F2C879] ${focus}`}
                >
                  Send prayer request
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#144b78] py-10 text-white/80">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-6 px-5">
          <div>
            <p className={`${display.className} text-lg font-bold text-white`}>
              {CHURCH_NAME}
            </p>
            <p className="mt-1">{ADDRESS}</p>
          </div>
          <div>
            <p>{EMAIL}</p>
            <p>{PHONE}</p>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl px-5 text-sm">
          © {year ?? ""} {CHURCH_NAME}
        </p>
      </footer>
    </div>
  );
}
