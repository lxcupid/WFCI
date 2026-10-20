import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import DashboardProvider from "@/components/dashboard/DashboardProvider";
import Sidebar from "@/components/dashboard/Sidebar";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});
const body = Hanken_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <div
        className={`${body.className} ${display.variable} min-h-screen bg-[#F4F6F1] text-[#1B2723]`}
      >
        <Sidebar />
        <main className="px-5 pb-16 pt-20 md:ml-64 md:px-10 md:pt-10">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </DashboardProvider>
  );
}
