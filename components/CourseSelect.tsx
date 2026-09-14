"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Course } from "../lib/types";

interface CourseSelectProps {
  value: string;
  onChange: (courseId: string) => void;
}

export function CourseSelect({ value, onChange }: CourseSelectProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchCourses() {
      const { data, error } = await supabase
        .from("courses")
        .select("id, code, tag, name, note, created_at")
        .order("code", { ascending: true });

      if (!isMounted) return;

      if (error) {
        console.error("โหลดรายวิชาไม่สำเร็จ:", error.message);
        setErrorMessage("โหลดรายวิชาไม่สำเร็จ");
      } else {
        setCourses(data ?? []);
      }

      setLoading(false);
    }

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 disabled:opacity-50"
        style={{ borderColor: "#C9D6CC", color: "#1F3D2B" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#1F3D2B")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#C9D6CC")}
      >
        <option value="" disabled>
          {loading ? "กำลังโหลดวิชา..." : "เลือกวิชาเรียน"}
        </option>

        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.code} · {course.name}
          </option>
        ))}
      </select>

      {errorMessage && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}