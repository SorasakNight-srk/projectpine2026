"use client";

import { useEffect, useRef, useState } from "react";
import { User, Mail, BadgeCheck, LogOut, ChevronUp, IdCard } from "lucide-react";
import type { UserInfo } from "@/lib/types";

type Props = {
  user: UserInfo | null; // null = ยังไม่ได้ login
  onLogin?: () => void;
  onLogout?: () => void;
};

export function UserMenu({ user, onLogin, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // ปิด popup เมื่อคลิกนอกพื้นที่ หรือกด Esc
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // ยังไม่ login -> แสดงปุ่ม Login
  if (!user) {
    return (
      <button
        onClick={onLogin}
        className="flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
        style={{ borderColor: "#3F6248", color: "#F1EBD8" }}
      >
        <Avatar />
        เข้าสู่ระบบ
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      {/* Popup ข้อมูลผู้ใช้ */}
      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 right-0 mb-2 rounded-xl p-4 shadow-lg"
          style={{ background: "#F1EBD8", color: "#1F3D2B" }}
        >
          <div className="flex items-center gap-3">
            <Avatar src={user.avatarUrl} size={44} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              {user.role && (
                <p className="flex items-center gap-1 text-xs opacity-70">
                  <BadgeCheck size={12} />
                  {user.role}
                </p>
              )}
            </div>
          </div>

          <div
  className="mt-3 space-y-2 border-t pt-3 text-xs"
  style={{ borderColor: "#D8CFB4" }}
>
  {user.email && (
    <div className="flex items-center gap-2">
      <Mail size={13} className="flex-shrink-0 opacity-70" />
      <span className="truncate">{user.email}</span>
    </div>
  )}
  {user.studentId && (
    <div className="flex items-center gap-2">
      <IdCard size={13} className="flex-shrink-0 opacity-70" />
      <span>รหัสนักศึกษา {user.studentId}</span>
    </div>
  )}
</div>

          <button
            onClick={() => {
              setOpen(false);
              onLogout?.();
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: "#1A237E", color: "#F1EBD8" }}
          >
            <LogOut size={14} />
            ออกจากระบบ
          </button>
        </div>
      )}

      {/* ปุ่ม User */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
        style={{ borderColor: "#3F6248", color: "#F1EBD8" }}
      >
        <Avatar src={user.avatarUrl} />
        <span className="flex-1 truncate text-left">{user.name}</span>
        <ChevronUp
          size={14}
          className="transition-transform"
          style={{ transform: open ? "rotate(0deg)" : "rotate(180deg)" }}
        />
      </button>
    </div>
  );
}

function Avatar({ src, size = 24 }: { src?: string; size?: number }) {
  return (
    <span
      className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{ width: size, height: size, background: "#3A5C42" }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <User size={Math.round(size * 0.55)} style={{ color: "#F1EBD8" }} />
      )}
    </span>
  );
}