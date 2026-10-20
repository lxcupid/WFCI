"use client";

import { useState } from "react";
import Modal from "@/components/dashboard/Modal";
import {
  useDashboard,
  type ServiceItem,
} from "@/components/dashboard/DashboardProvider";
import {
  Field,
  PageHeader,
  btnGhost,
  btnPrimary,
  displayFont,
  inputCls,
} from "@/components/dashboard/ui";

export default function ServicesPage() {
  const { services, saveService } = useDashboard();
  const [editing, setEditing] = useState<ServiceItem | null>(null);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Services"
        desc="Update times, descriptions, and locations."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <article key={s.id} className="flex flex-col rounded-lg bg-white p-6">
            <h2 className={`${displayFont} text-xl font-bold`}>{s.name}</h2>
            <p className="mt-1 font-semibold text-[#9A6410]">{s.label}</p>
            <p className="mt-3 flex-1">{s.note}</p>
            <p className="mt-3 text-sm text-[#1B2723]/70">
              {s.address
                ? `Meets at ${s.address}`
                : "Meets at the main church address"}
            </p>
            <button
              className={`${btnGhost} mt-5 self-start !py-1.5`}
              onClick={() => setEditing(s)}
            >
              Edit service
            </button>
          </article>
        ))}
      </div>

      <Modal
        open={editing !== null}
        title="Edit service"
        onClose={() => setEditing(null)}
      >
        {editing && (
          <ServiceForm
            key={editing.id}
            initial={editing}
            onCancel={() => setEditing(null)}
            onSave={(s) => {
              saveService(s);
              setEditing(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function ServiceForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ServiceItem;
  onSave: (s: ServiceItem) => void;
  onCancel: () => void;
}) {
  const [s, setS] = useState(initial);
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...s, address: s.address.trim() });
      }}
    >
      <Field id="sv-name" label="Name">
        <input
          id="sv-name"
          required
          className={inputCls}
          value={s.name}
          onChange={(e) => setS({ ...s, name: e.target.value })}
        />
      </Field>
      <Field id="sv-label" label="Day and time">
        <input
          id="sv-label"
          required
          className={inputCls}
          value={s.label}
          onChange={(e) => setS({ ...s, label: e.target.value })}
        />
      </Field>
      <Field id="sv-note" label="What to expect">
        <textarea
          id="sv-note"
          rows={3}
          className={inputCls}
          value={s.note}
          onChange={(e) => setS({ ...s, note: e.target.value })}
        />
      </Field>
      <Field id="sv-addr" label="Location (optional)">
        <input
          id="sv-addr"
          className={inputCls}
          value={s.address}
          placeholder="Leave blank to use the main church address"
          onChange={(e) => setS({ ...s, address: e.target.value })}
        />
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className={btnGhost} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={btnPrimary}>
          Save service
        </button>
      </div>
    </form>
  );
}
