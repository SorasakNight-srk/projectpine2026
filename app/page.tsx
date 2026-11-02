"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CourseGrid } from "@/components/CourseGrid";
import { CourseDetail } from "@/components/CourseDetail";
import { MaterialsList } from "@/components/MaterialsList";
import { UploadPanel } from "@/components/UploadPanel";
import { QAPanel } from "@/components/QAPanel";
import { LoginPage } from "@/components/Loginpage";
import { getCurrentUserAction, logoutAction } from "@/app/auth/actions";
import type { Category, Course, UserInfo } from "@/lib/types";

export default function Home() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [checking, setChecking] = useState(true); // กันหน้า Login แวบตอนรีเฟรช
  const [active, setActive] = useState<string>("วิชาเรียน");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // โหลด session ที่ค้างอยู่ใน cookie
  useEffect(() => {
    getCurrentUserAction()
      .then((u) => u && setUser(u))
      .finally(() => setChecking(false));
  }, []);

  function handleNavSelect(label: string) {
    setActive(label);
    setSelectedCourse(null);
    setSelectedCategory(null);
  }

  async function handleLogout() {
    await logoutAction();
    setUser(null);
    setActive("วิชาเรียน");
    setSelectedCourse(null);
    setSelectedCategory(null);
  }

  if (checking) return <div className="h-screen w-full" style={{ background: "#FBF8EF" }} />;

  return (
    <div
      className="flex w-full h-screen overflow-hidden border"
      style={{ borderColor: "#D9CFAE", background: "#FBF8EF", boxShadow: "0 20px 45px -25px rgba(31,61,43,0.35)" }}
    >
      {!user && <LoginPage onLogin={setUser} />}

      {user && (
        <>
          <Sidebar
            active={active}
            onSelect={handleNavSelect}
            user={user}
            onLogout={handleLogout}
          />

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
        </>
      )}
    </div>
  );
}