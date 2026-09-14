"use client";

import { ChevronLeft } from "lucide-react";
import type { Category, Course } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/types";

const CATEGORY_KEYS: Category[] = ["sheet", "exam"];

export function CourseDetail({
  course,
  onBack,
  onSelectCategory,
}: {
  course: Course;
  onBack: () => void;
  onSelectCategory: (category: Category) => void;
}) {
  return (
    <main className="flex h-full flex-1 flex-col p-8">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-1.5 text-sm font-medium"
        style={{ color: "#8C8368" }}
      >
        <ChevronLeft size={16} />
        วิชาเรียน
      </button>

      <div className="mb-7">
        <p className="text-xs font-medium uppercase" style={{ color: "#8FA98A", letterSpacing: "0.14em" }}>
          {course.code}
        </p>
        <h1 className="mt-1 text-2xl font-semibold" style={{ color: "#1F3D2B" }}>
          {course.name}
        </h1>
      </div>

      <div className="flex flex-1 items-center justify-center gap-10">
        {CATEGORY_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => onSelectCategory(key)}
            className="flex h-75 w-100 flex-col rounded-xl border bg-white text-left transition-transform hover:-translate-y-1"
            style={{ borderColor: "#E4DEC7" }}
          >
            <div className="flex flex-1 items-center justify-center" />
            <div
              className="border-t px-4 py-3 text-center text-base font-semibold"
              style={{ borderColor: "#EFEAD8", color: "#1F3D2B" }}
            >
              {CATEGORY_LABEL[key]}
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}
