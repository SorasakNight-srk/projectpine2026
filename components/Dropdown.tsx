"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-sm font-medium"
        style={{ borderColor: "#E4DEC7", color: value ? "#1F3D2B" : "#A39C7F" }}
      >
        {value || label}
        <ChevronDown
          size={16}
          style={{
            color: "#8FA98A",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 150ms",
          }}
        />
      </button>
      {open && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-10 overflow-hidden rounded-lg border bg-white shadow-lg"
          style={{ borderColor: "#E4DEC7" }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#F1EBD8]"
              style={{ color: "#1F3D2B" }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
