"use client";

import { useEffect, useState } from "react";
import { fetchCourses } from "@/lib/materials";
import type { Course } from "@/lib/types";

export function CourseGrid({ onSelectCourse }: { onSelectCourse: (course: Course) => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCourses()
      .then((data) => {
        if (!cancelled) setCourses(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "โหลดรายวิชาไม่สำเร็จ");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="mb-7">
        <p className="text-xs font-medium uppercase" style={{ color: "#8FA98A", letterSpacing: "0.14em" }}>
          ภาคเรียนนี้
        </p>
        <h1 className="mt-1 text-2xl font-semibold" style={{ color: "#1F3D2B" }}>
          วิชาเรียนของคุณ
        </h1>
      </div>

      {loading && (
        <p className="text-sm" style={{ color: "#8C8368" }}>
          กำลังโหลดรายวิชา...
        </p>
      )}

      {error && (
        <p className="text-sm" style={{ color: "#B25B4C" }}>
          {error}
        </p>
      )}

      {!loading && !error && courses.length === 0 && (
        <p className="text-sm" style={{ color: "#8C8368" }}>
          ยังไม่มีวิชาในระบบ
        </p>
      )}

      <div className="grid grid-cols-2 gap-6">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCourse(c)}
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
                {c.note ?? "----"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}
