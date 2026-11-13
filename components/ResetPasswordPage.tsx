"use client";

import { useState, type FormEvent } from "react";
import { updatePasswordAction } from "@/app/auth/actions";

const C = {
  navy: "#1A237E",
  cream: "#FBF8EF",
  border: "#D9CFAE",
  green: "#1F3D2B",
  sage: "#8FA68A",
  clay: "#C98A4B",
  slate: "#6F8CA8",
  muted: "#8A8468",
};

interface Props {
  /** true เมื่อผู้ใช้กดลิงก์จากอีเมลแล้วได้ session ถูกต้อง */
  hasSession: boolean;
}

export function ResetPasswordPage({ hasSession }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) return setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
    if (password !== confirm) return setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");

    setLoading(true);
    try {
      const res = await updatePasswordAction(password);
      if (!res.ok) return setError(res.error);
      setDone(true);
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] outline-none transition-shadow placeholder:text-[#B5AE93] focus:shadow-[0_0_0_3px_rgba(26,35,126,0.18)]";

  const primaryBtn =
    "mt-6 block w-full rounded-lg py-2.5 text-center text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60";

  return (
    <div className="flex min-h-screen w-full">
      {/* ฝั่งซ้าย */}
      <aside
        className="relative hidden md:flex w-[38%] max-w-[560px] flex-col justify-between p-10 text-white"
        style={{ background: C.navy }}
      >
        <div className="flex items-center gap-3">
          <div
            className="grid h-12 w-12 place-items-center rounded-full"
            style={{ background: C.green }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.clay} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 17v5" />
              <path d="M9 3h6l-1 6 3 3v2H7v-2l3-3-1-6Z" />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="font-bold text-lg">Summary</p>
            <p className="text-sm text-white/70">with pine</p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold leading-snug">
            ตั้งรหัสผ่านใหม่
            <br />
            แล้วกลับมาเรียนต่อ
          </h2>
          <p className="mt-4 max-w-sm text-white/70 leading-relaxed">
            เลือกรหัสผ่านที่คาดเดายาก และไม่ซ้ำกับที่เคยใช้
          </p>
        </div>

        <div className="flex gap-2" aria-hidden>
          <span className="h-3 w-3 rounded-full" style={{ background: C.sage }} />
          <span className="h-3 w-3 rounded-full" style={{ background: C.clay }} />
          <span className="h-3 w-3 rounded-full" style={{ background: C.slate }} />
        </div>
      </aside>

      {/* ฝั่งขวา */}
      <main
        className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-10"
        style={{ background: C.cream }}
      >
        <div className="relative w-full max-w-[420px]">
          <span
            className="absolute -top-2.5 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full"
            style={{ background: C.clay }}
            aria-hidden
          />

          <div
            className="rounded-2xl border bg-white p-8 md:-rotate-[0.6deg]"
            style={{
              borderColor: C.border,
              boxShadow: "0 20px 45px -25px rgba(31,61,43,0.35)",
            }}
          >
            {/* กรณีที่ 1: เปลี่ยนรหัสสำเร็จ */}
            {done ? (
              <>
                <h1 className="text-2xl font-bold" style={{ color: C.green }}>
                  เปลี่ยนรหัสผ่านสำเร็จ
                </h1>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: C.muted }}>
                  คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที
                </p>
                <a href="/" className={primaryBtn} style={{ background: C.green }}>
                  ไปหน้าเข้าสู่ระบบ
                </a>
              </>
            ) : !hasSession ? (
              /* กรณีที่ 2: ลิงก์ไม่ถูกต้องหรือหมดอายุ */
              <>
                <h1 className="text-2xl font-bold" style={{ color: C.green }}>
                  ลิงก์ใช้ไม่ได้
                </h1>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: C.muted }}>
                  ลิงก์รีเซ็ตรหัสผ่านอาจหมดอายุหรือถูกใช้ไปแล้ว
                  กรุณากลับไปที่หน้าเข้าสู่ระบบ แล้วกด &quot;ลืมรหัสผ่าน?&quot; เพื่อขอลิงก์ใหม่
                </p>
                <a href="/" className={primaryBtn} style={{ background: C.green }}>
                  กลับไปหน้าเข้าสู่ระบบ
                </a>
              </>
            ) : (
              /* กรณีที่ 3: ฟอร์มตั้งรหัสใหม่ */
              <form onSubmit={handleSubmit} noValidate>
                <p className="text-sm" style={{ color: C.muted }}>
                  ลืมรหัสผ่าน
                </p>
                <h1 className="mt-1 text-2xl font-bold" style={{ color: C.green }}>
                  ตั้งรหัสผ่านใหม่
                </h1>

                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium" style={{ color: C.green }}>
                      รหัสผ่านใหม่
                    </label>
                    <div className="relative">
                      <input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="อย่างน้อย 8 ตัวอักษร"
                        className={`${inputClass} pr-16`}
                        style={{ borderColor: C.border, color: C.green }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium"
                        style={{ color: C.navy }}
                        aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                      >
                        {showPassword ? "ซ่อน" : "แสดง"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium" style={{ color: C.green }}>
                      ยืนยันรหัสผ่านใหม่
                    </label>
                    <input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                      className={inputClass}
                      style={{ borderColor: C.border, color: C.green }}
                    />
                  </div>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="mt-4 rounded-lg border px-3 py-2 text-sm"
                    style={{ background: "#FDF1EC", borderColor: "#E9C3B0", color: "#9A3B1C" }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={primaryBtn}
                  style={{ background: C.green }}
                >
                  {loading ? "กำลังดำเนินการ..." : "บันทึกรหัสผ่านใหม่"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}