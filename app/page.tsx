"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  UploadCloud,
  HelpCircle,
  User,
  PinIcon,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";

type Course = {
  code: string;
  tag: string;
  name: string;
  note: string;
  rotate: string;
  accent: string;
};

type NavItem = {
  label: string;
  icon: LucideIcon;
  path: string;
};

const COURSES: Course[] = [
  {
    code: "MA111",
    tag: "MA",
    name: "Calculus1",
    note: "แคลคูลัส 1 · เรียน อ. พฤ.",
    rotate: "-rotate-2",
    accent: "#8FA98A",
  },
  {
    code: "CN101",
    tag: "CN",
    name: "Python เริ่มต้น",
    note: "เขียนโค้ด Python เริ่มต้น",
    rotate: "rotate-1",
    accent: "#C98A4B",
  },
  {
    code: "SC135",
    tag: "SC",
    name: "ฟิสิกส์ทั่วไป",
    note: "----",
    rotate: "rotate-2",
    accent: "#6E8CA0",
  },
  // {
  //   code: "SF210",
  //   tag: "SF",
  //   name: "วิชา Software",
  //   note: "---",
  //   rotate: "-rotate-1",
  //   accent: "#B25B4C",
  // },
];

const NAV: NavItem[] = [
  { label: "วิชาเรียน", icon: BookOpen, path:"/Subject" },
  { label: "อัพโหลดไฟล์", icon: UploadCloud, path:"/Upload" },
  { label: "Q & A", icon: HelpCircle, path:"/Quest" },
];

// Category options shown after picking a course
const CATEGORY_OPTIONS = [
  { key: "sheet", label: "ชีทสรุป" },
  { key: "exam", label: "แนวข้อสอบ" },
];

export default function Home() {
  const [active, setActive] = useState<string>("วิชาเรียน");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  function goToCourseList() {
    setSelectedCourse(null);
  }


  return (
    // <div
    //   className="flex min-h-screen w-full items-stretch justify-center p-6"
    //   style={{ background: "#EFE9D8", fontFamily: "'Noto Sans Thai', 'Inter', sans-serif" }}
    // >
      <div
        className="flex w-full h-screen overflow-hidden border"
        style={{ borderColor: "#D9CFAE", background: "#FBF8EF", boxShadow: "0 20px 45px -25px rgba(31,61,43,0.35)" }}
      >
        {/* Sidebar */}
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
              {NAV.map(({ label, icon: Icon, path }) => {
                const isActive = active === label;
                return (
                  <button
                    key={label}
                    // href={path}
                    onClick={() => {
                      setActive(label);
                      setSelectedCourse(null); // reset course detail view when switching tabs
                    }}
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
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ background: "#3A5C42" }}
            >
              <User size={13} />
            </span>
            เข้าสู่ระบบ
          </button>
        </aside>

        {/* Main */}
        {active === "วิชาเรียน" && !selectedCourse && (
          <main className="flex-1 p-8">
            <div className="mb-7">
              <p className="text-xs font-medium uppercase" style={{ color: "#8FA98A", letterSpacing: "0.14em" }}>
                ภาคเรียนนี้
              </p>
              <h1 className="mt-1 text-2xl font-semibold" style={{ color: "#1F3D2B" }}>
                วิชาเรียนของคุณ
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {COURSES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCourse(c)}
                  className={`group relative rounded-xl border bg-white p-0 text-left transition-transform hover:-translate-y-1 hover:rotate-0 ${c.rotate}`}
                  style={{ borderColor: "#E4DEC7" }}
                >
                  {/* Pin */}
                  <div
                    className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2"
                    style={{ background: c.accent, borderColor: "#FBF8EF" }}
                  />

                  <div className="flex h-28 items-center justify-center border-b" style={{ borderColor: "#EFEAD8" }}>
                    <span className="text-4xl font-black tracking-tight" style={{ color: "#232323" }}>
                      {c.tag}
                    </span>
                  </div>

                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold" style={{ color: "#1F3D2B" }}>
                      {c.code} : {c.name}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "#8C8368" }}>
                      {c.note}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </main>
        )}

        {/* Course detail: choose ชีทสรุป / แนวข้อสอบ */}
        {active === "วิชาเรียน" && selectedCourse && (
          <main className="flex h-full flex-1 flex-col p-8">
            <button
              onClick={goToCourseList}
              className="mb-5 flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "#8C8368" }}
            >
              <ChevronLeft size={16} />
              วิชาเรียน
            </button>

            <div className="mb-7">
              <p className="text-xs font-medium uppercase" style={{ color: "#8FA98A", letterSpacing: "0.14em" }}>
                {selectedCourse.code}
              </p>
              <h1 className="mt-1 text-2xl font-semibold" style={{ color: "#1F3D2B" }}>
                {selectedCourse.name}
              </h1>
            </div>

            <div className="flex justify-center gap-10">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    // TODO: navigate to the file list for this course + category
                  }}
                  className="flex h-56 w-100 flex-col rounded-xl border bg-white text-left transition-transform hover:-translate-y-1"
                  style={{ borderColor: "#E4DEC7" }}
                >
                  <div className="flex flex-1 items-center justify-center" />
                  <div
                    className="border-t px-4 py-3 text-center text-base font-semibold"
                    style={{ borderColor: "#EFEAD8", color: "#1F3D2B" }}
                  >
                    {opt.label}
                  </div>
                </button>
              ))}
            </div>
          </main>
        )}

        {active === "อัพโหลดไฟล์" && (
          <main className="flex-1 p-8">
            <div className="mb-7">
              <h1 className="mt-1 text-2xl font-semibold" style={{ color: "#1F3D2B" }}>
                Upload File
                {/* hello world */}
              </h1>
            </div>
          </main>
        )}
        {active === "Q & A" && (
          <main className="flex-1 p-8">
            <div className="mb-7">
              <h1 className="mt-1 text-2xl font-semibold" style={{ color: "#1F3D2B" }}>
                Q & A
              </h1>
            </div>
          </main>
        )}
      </div>
    // </div>
  );
}
