"use client";

import { ChevronLeft, FileText, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  deleteMaterial,
  fetchMaterials,
  getMaterialUrl,
  uploadMaterial,
} from "@/lib/materials";
import type { Category, Course, Material } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/types";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MaterialsList({
  course,
  category,
  onBack,
}: {
  course: Course;
  category: Category;
  onBack: () => void;
}) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ดึง id ของผู้ใช้ที่ล็อกอินอยู่ เพื่อใช้เช็คว่าเป็นเจ้าของไฟล์หรือไม่
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  function load() {
    setLoading(true);
    fetchMaterials(course.id, category)
      .then(setMaterials)
      .catch((err) => setError(err.message ?? "โหลดไฟล์ไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id, category]);

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setIsUploading(true);
    setError(null);
    try {
      for (const file of Array.from(list)) {
        await uploadMaterial(file, course.id, category);
      }
      load();
    } catch (err: any) {
      setError(err.message ?? "อัพโหลดไม่สำเร็จ");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function openFile(m: Material) {
    try {
      const url = await getMaterialUrl(m.file_path);
      window.open(url, "_blank");
    } catch (err: any) {
      setError(err.message ?? "เปิดไฟล์ไม่สำเร็จ");
    }
  }

  async function handleDelete(m: Material) {
    if (
      !window.confirm(`ลบไฟล์ "${m.file_name}" ใช่ไหม?\nการลบไม่สามารถย้อนกลับได้`)
    )
      return;
    setDeletingId(m.id);
    setError(null);
    try {
      await deleteMaterial(m);
      setMaterials((prev) => prev.filter((x) => x.id !== m.id));
    } catch (err: any) {
      setError(err.message ?? "ลบไฟล์ไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="flex h-full flex-1 flex-col p-8">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-1.5 text-sm font-medium"
        style={{ color: "#8C8368" }}
      >
        <ChevronLeft size={16} />
        {course.code} : {course.name}
      </button>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase" style={{ color: "#8FA98A", letterSpacing: "0.14em" }}>
            {course.code}
          </p>
          <h1 className="mt-1 text-2xl font-semibold" style={{ color: "#1F3D2B" }}>
            {CATEGORY_LABEL[category]}
          </h1>
        </div>

        <label
          className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
          style={{ background: "#1F3D2B", color: "#F1EBD8" }}
        >
          <UploadCloud size={16} />
          {isUploading ? "กำลังอัพโหลด..." : "อัพโหลดไฟล์"}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.zip"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>

      {error && (
        <p className="mb-4 text-sm" style={{ color: "#B25B4C" }}>
          {error}
        </p>
      )}

      {loading && (
        <p className="text-sm" style={{ color: "#8C8368" }}>
          กำลังโหลดไฟล์...
        </p>
      )}

      {!loading && materials.length === 0 && (
        <div
          className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed"
          style={{ borderColor: "#D9CFAE" }}
        >
          <p className="text-sm" style={{ color: "#8C8368" }}>
            ยังไม่มีไฟล์ในหมวดนี้ — อัพโหลดไฟล์แรกได้เลย
          </p>
        </div>
      )}

      {!loading && materials.length > 0 && (
        <ul className="flex flex-col gap-2">
          {materials.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3"
              style={{ borderColor: "#E4DEC7" }}
            >
              <button
                onClick={() => openFile(m)}
                className="flex min-w-0 items-center gap-2 text-left"
              >
                <FileText size={16} style={{ color: "#8FA98A", flexShrink: 0 }} />
                <span className="truncate text-sm font-medium" style={{ color: "#1F3D2B" }}>
                  {m.file_name}
                </span>
              </button>

              <div className="flex flex-shrink-0 items-center gap-3">
                <span className="text-xs" style={{ color: "#8C8368" }}>
                  {formatBytes(m.file_size)}
                </span>

                {/* แสดงปุ่มลบเฉพาะเจ้าของไฟล์ */}
                {userId !== null && m.uploaded_by === userId && (
                  <button
                    onClick={() => handleDelete(m)}
                    disabled={deletingId === m.id}
                    aria-label={`ลบ ${m.file_name}`}
                    title="ลบไฟล์"
                    className="rounded-md p-1.5 transition-opacity hover:opacity-70 disabled:opacity-40"
                    style={{ color: "#B25B4C" }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}