import type { ReactNode } from "react";

export const displayFont = "font-[family-name:var(--font-display)]";

export const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2A93B]";

export const inputCls = `w-full rounded-md border-2 border-[#3996e3]/20 bg-white px-4 py-2.5 ${focus}`;
export const btnPrimary = `rounded-md bg-[#F2A93B] px-5 py-2.5 font-semibold text-[#12372F] hover:bg-[#F2C879] disabled:opacity-60 ${focus}`;
export const btnGhost = `rounded-md border-2 border-[#3996e3]/30 px-5 py-2.5 font-semibold hover:border-[#3996e3] ${focus}`;
export const btnDanger = `rounded-md bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800 ${focus}`;

export function PageHeader({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className={`${displayFont} text-3xl font-bold`}>{title}</h1>
        {desc && <p className="mt-1 text-[#1B2723]/70">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border-2 border-dashed border-[#3996e3]/30 px-6 py-10 text-center text-[#1B2723]/70">
      {children}
    </p>
  );
}
