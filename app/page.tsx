"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CourseGrid } from "@/components/CourseGrid";
import { CourseDetail } from "@/components/CourseDetail";
import { MaterialsList } from "@/components/MaterialsList";
import { UploadPanel } from "@/components/UploadPanel";
import { QAPanel } from "@/components/QAPanel";
import type { Category, Course } from "@/lib/types";

export default function Home() {
  const [active, setActive] = useState<string>("วิชาเรียน");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  function handleNavSelect(label: string) {
    setActive(label);
    setSelectedCourse(null);
    setSelectedCategory(null);
  }

  return (
    <div
      className="flex w-full h-screen overflow-hidden border"
      style={{ borderColor: "#D9CFAE", background: "#FBF8EF", boxShadow: "0 20px 45px -25px rgba(31,61,43,0.35)" }}
    >
      <Sidebar active={active} onSelect={handleNavSelect} />

      {active === "วิชาเรียน" && !selectedCourse && (
        <CourseGrid onSelectCourse={setSelectedCourse} />
      )}

      {active === "วิชาเรียน" && selectedCourse && !selectedCategory && (
        <CourseDetail
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {active === "วิชาเรียน" && selectedCourse && selectedCategory && (
        <MaterialsList
          course={selectedCourse}
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      )}

      {active === "อัพโหลดไฟล์" && <UploadPanel />}

      {active === "Q & A" && <QAPanel />}
    </div>
  );
}
