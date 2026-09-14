"use client";

import { BookOpen, UploadCloud, HelpCircle, User, PinIcon } from "lucide-react";
import type { NavItem } from "@/lib/types";

export const NAV: NavItem[] = [
  { label: "วิชาเรียน", icon: BookOpen, path: "/Subject" },
  { label: "อัพโหลดไฟล์", icon: UploadCloud, path: "/Upload" },
  { label: "Q & A", icon: HelpCircle, path: "/Quest" },
];

export function Sidebar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (label: string) => void;
}) {
  return (
    <aside
      className="flex w-64 flex-shrink-0 flex-col justify-between p-5"
      style={{ background: "#1A237E", color: "#F1EBD8" }}
    >
      <div>
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3 pl-1">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: "#3A5C42", border: "1px solid #557A5C" }}
          >
            <PinIcon size={18} style={{ color: "#E0A458" }} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight" style={{ letterSpacing: "0.02em" }}>
              Summary
            </p>
            <p className="text-xs leading-tight" style={{ color: "#A9C2AC" }}>
              with pine
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2">
          {NAV.map(({ label, icon: Icon }) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                onClick={() => onSelect(label)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors"
                style={
                  isActive
                    ? { background: "#F1EBD8", color: "#1F3D2B" }
                    : { background: "transparent", color: "#CFE0CF" }
                }
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Login */}
      <button
        className="flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
        style={{ borderColor: "#3F6248", color: "#F1EBD8" }}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "#3A5C42" }}>
          <User size={13} />
        </span>
        เข้าสู่ระบบ
      </button>
    </aside>
  );
}
