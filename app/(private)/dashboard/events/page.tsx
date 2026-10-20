"use client";

import { useState } from "react";
import Modal, { ConfirmModal } from "@/components/dashboard/Modal";
import {
  CATEGORIES,
  formatDate,
  useDashboard,
  type Category,
  type EventItem,
} from "@/components/dashboard/DashboardProvider";
import {
  EmptyState,
  Field,
  PageHeader,
  btnGhost,
  btnPrimary,
  focus,
  inputCls,
} from "@/components/dashboard/ui";

type Draft = Omit<EventItem, "id"> & { id?: number };
const BLANK: Draft = { title: "", date: "", category: "Community", desc: "" };

export default function EventsPage() {
  const { events, saveEvent, deleteEvent } = useDashboard();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [deleting, setDeleting] = useState<EventItem | null>(null);

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Events"
        desc="Add, edit, or remove events shown on the website."
        action={
          <button className={btnPrimary} onClick={() => setEditing(BLANK)}>
            Add event
          </button>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState>No events yet. Select “Add event” to create the first one.</EmptyState>
      ) : (
        <ul className="divide-y divide-[#12372F]/15 rounded-lg bg-white">
          {sorted.map((ev) => (
            <li key={ev.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 p-5">
              <div className="w-28 font-semibold text-[#9A6410]">{formatDate(ev.date)}</div>
              <div className="min-w-[200px] flex-1">
                <h3 className="text-lg font-semibold">{ev.title}</h3>
                <p className="text-[#1B2723]/70">{ev.desc}</p>
              </div>
              <span className="rounded-full bg-[#3996e3]/10 px-3 py-1 text-sm font-semibold text-[#144b78]">
                {ev.category}
              </span>
              <div className="flex gap-2">
                <button className={`${btnGhost} !px-4 !py-1.5`} onClick={() => setEditing(ev)}>
                  Edit
                </button>
                <button
                  className={`rounded-md px-4 py-1.5 font-semibold text-red-700 hover:bg-red-50 ${focus}`}
                  onClick={() => setDeleting(ev)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={editing !== null}
        title={editing?.id ? "Edit event" : "Add event"}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <EventForm
            key={editing.id ?? "new"}
            initial={editing}
            onCancel={() => setEditing(null)}
            onSave={(d) => {
              saveEvent(d);
              setEditing(null);
            }}
          />
        )}
      </Modal>

      <ConfirmModal
        open={deleting !== null}
        title="Delete event?"
        message={`“${deleting?.title}” will be removed from the website. This can’t be undone.`}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) deleteEvent(deleting.id);
          setDeleting(null);
        }}
      />
    </div>
  );
}

function EventForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Draft;
  onSave: (d: Draft) => void;
  onCancel: () => void;
}) {
  const [d, setD] = useState(initial);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...d, title: d.title.trim(), desc: d.desc.trim() });
      }}
    >
      <Field id="ev-title" label="Title">
        <input id="ev-title" required className={inputCls} value={d.title}
          onChange={(e) => setD({ ...d, title: e.target.value })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="ev-date" label="Date">
          <input id="ev-date" type="date" required className={inputCls} value={d.date}
            onChange={(e) => setD({ ...d, date: e.target.value })} />
        </Field>
        <Field id="ev-cat" label="Category">
          <select id="ev-cat" className={inputCls} value={d.category}
            onChange={(e) => setD({ ...d, category: e.target.value as Category })}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field id="ev-desc" label="Description">
        <textarea id="ev-desc" rows={3} className={inputCls} value={d.desc}
          onChange={(e) => setD({ ...d, desc: e.target.value })} />
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className={btnGhost} onClick={onCancel}>Cancel</button>
        <button type="submit" className={btnPrimary}>Save event</button>
      </div>
    </form>
  );
}
