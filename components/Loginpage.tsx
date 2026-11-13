"use client";

import { useState, type FormEvent } from "react";
import {
  loginAction,
  registerAction,
  forgotPasswordAction,
} from "@/app/auth/actions";

type Mode = "login" | "register";

interface LoginPageProps {
  /** เรียกเมื่อเข้าสู่ระบบ/สมัครสมาชิกสำเร็จ */
  onLogin: (user: { name: string; email?: string; studentId?: string }) => void;
}

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

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const STUDENT_ID_RE = /^\d{10}$/;

export function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [identifier, setIdentifier] = useState(""); // อีเมลหรือรหัสนักศึกษา (หน้า login)
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setInfo("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (isRegister) {
      if (!name.trim()) return setError("กรุณากรอกชื่อของคุณ");
      if (!EMAIL_RE.test(email)) return setError("รูปแบบอีเมลไม่ถูกต้อง");
      if (!STUDENT_ID_RE.test(studentId)) return setError("รหัสนักศึกษาต้องเป็นตัวเลข 10 หลัก");
      if (password.length < 8) return setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
    } else {
      const id = identifier.trim();
      const isNumeric = /^\d+$/.test(id);
      if (!id) return setError("กรุณากรอกอีเมลหรือรหัสนักศึกษา");
      if (isNumeric && !STUDENT_ID_RE.test(id)) return setError("รหัสนักศึกษาต้องเป็นตัวเลข 10 หลัก");
      if (!isNumeric && !EMAIL_RE.test(id)) return setError("กรอกอีเมลให้ถูกต้อง หรือรหัสนักศึกษา 10 หลัก");
      if (password.length < 6) return setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
    }

    setLoading(true);
    try {
      const res = isRegister
        ? await registerAction({ name: name.trim(), email, studentId, password })
        : await loginAction({ identifier: identifier.trim(), password });

      if (!res.ok) return setError(res.error);
      onLogin(res.user);
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot() {
    setError("");
    setInfo("");

    const id = identifier.trim();
    const valid = EMAIL_RE.test(id) || STUDENT_ID_RE.test(id);
    if (!valid)
      return setError("กรอกอีเมลหรือรหัสนักศึกษาในช่องด้านบนก่อน แล้วกด ลืมรหัสผ่าน");

    setLoading(true);
    try {
      const res = await forgotPasswordAction(id);
      if (!res.ok) return setError(res.error ?? "เกิดข้อผิดพลาด");
      setInfo("ถ้าบัญชีนี้มีอยู่ในระบบ เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว");
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] outline-none transition-shadow placeholder:text-[#B5AE93] focus:shadow-[0_0_0_3px_rgba(26,35,126,0.18)]";

  return (
    <div className="flex w-full h-full">
      {/* ฝั่งซ้าย: พื้นหลังสีน้ำเงินเหมือน Sidebar */}
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
            <p className="font-bold text-2xl">Summary</p>
            <p className="text-base text-white/70">with pine</p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold leading-snug">
            สรุปเนื้อหา เก็บทุกวิชา
            <br />
            ไว้ในที่เดียว
          </h2>
          <p className="mt-4 max-w-sm text-white/70 leading-relaxed">
            อัพโหลดไฟล์เรียน ดูสรุปแยกตามวิชา และถามตอบเนื้อหาได้ทันที
          </p>
        </div>

        <div className="flex gap-2" aria-hidden>
          <span className="h-3 w-3 rounded-full" style={{ background: C.sage }} />
          <span className="h-3 w-3 rounded-full" style={{ background: C.clay }} />
          <span className="h-3 w-3 rounded-full" style={{ background: C.slate }} />
        </div>
      </aside>

      {/* ฝั่งขวา: พื้นครีม + การ์ดฟอร์มที่เอียงนิดๆ มีหมุดด้านบน */}
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

          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border bg-white p-8 md:-rotate-[0.6deg]"
            style={{
              borderColor: C.border,
              boxShadow: "0 20px 45px -25px rgba(31,61,43,0.35)",
            }}
          >
            <p className="text-sm" style={{ color: C.muted }}>
              {isRegister ? "เริ่มต้นใช้งาน" : "ยินดีต้อนรับกลับมา"}
            </p>
            <h1 className="mt-1 text-2xl font-bold" style={{ color: C.green }}>
              {isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
            </h1>

            <div className="mt-6 space-y-4">
              {isRegister && (
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium" style={{ color: C.green }}>
                    ชื่อ
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ชื่อที่ต้องการแสดง"
                    className={inputClass}
                    style={{ borderColor: C.border, color: C.green }}
                  />
                </div>
              )}

              {isRegister ? (
                <>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium" style={{ color: C.green }}>
                      อีเมล
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={inputClass}
                      style={{ borderColor: C.border, color: C.green }}
                    />
                  </div>

                  <div>
                    <label htmlFor="studentId" className="mb-1.5 block text-sm font-medium" style={{ color: C.green }}>
                      รหัสนักศึกษา
                    </label>
                    <input
                      id="studentId"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={10}
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="รหัสนักศึกษา 10 หลัก"
                      className={inputClass}
                      style={{ borderColor: C.border, color: C.green }}
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="identifier" className="mb-1.5 block text-sm font-medium" style={{ color: C.green }}>
                    อีเมลหรือรหัสนักศึกษา
                  </label>
                  <input
                    id="identifier"
                    type="text"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@example.com หรือ รหัสนักศึกษา 10 หลัก"
                    className={inputClass}
                    style={{ borderColor: C.border, color: C.green }}
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium" style={{ color: C.green }}>
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isRegister ? "new-password" : "current-password"}
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

              {!isRegister && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex cursor-pointer items-center gap-2" style={{ color: C.muted }}>
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4"
                      style={{ accentColor: C.green }}
                    />
                    จดจำฉันไว้
                  </label>
                  <button
                    type="button"
                    onClick={handleForgot}
                    disabled={loading}
                    className="font-medium hover:underline disabled:opacity-60"
                    style={{ color: C.navy }}
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>
              )}
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

            {info && (
              <p
                role="status"
                className="mt-4 rounded-lg border px-3 py-2 text-sm"
                style={{ background: "#EEF5EC", borderColor: "#B9D2B3", color: C.green }}
              >
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg py-2.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: C.green, outlineColor: C.navy }}
            >
              {loading ? "กำลังดำเนินการ..." : isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
            </button>

            <p className="mt-5 text-center text-sm" style={{ color: C.muted }}>
              {isRegister ? "มีบัญชีอยู่แล้ว?" : "ยังไม่มีบัญชี?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(isRegister ? "login" : "register")}
                className="font-semibold hover:underline"
                style={{ color: C.navy }}
              >
                {isRegister ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
              </button>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}