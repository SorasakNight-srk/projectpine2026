"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { Dropdown } from "./Dropdown";
import { fetchCourses, uploadMaterial } from "@/lib/materials";
import type { Category, Course } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/types";

const CATEGORY_OPTIONS: { key: Category; label: string }[] = [
  { key: "sheet", label: CATEGORY_LABEL.sheet },
  { key: "exam", label: CATEGORY_LABEL.exam },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadPanel() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [courseLabel, setCourseLabel] = useState("");
  const [categoryLabel, setCategoryLabel] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCourses()
      .then(setCourses)
      .catch((err) => setError(err.message ?? "โหลดรายวิชาไม่สำเร็จ"));
  }, []);

  const courseOptions = courses.map((c) => `${c.code} : ${c.name}`);
  const selectedCourse = courses.find((c) => `${c.code} : ${c.name}` === courseLabel);
  const selectedCategory = CATEGORY_OPTIONS.find((c) => c.label === categoryLabel)?.key;

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
    setUploaded(false);
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleUpload() {
    if (files.length === 0) return;
    if (!selectedCourse) {
      setError("กรุณาเลือกวิชาเรียนก่อนอัพโหลด");
      return;
    }
    if (!selectedCategory) {
      setError("กรุณาเลือกประเภทเนื้อหาก่อนอัพโหลด");
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      for (const file of files) {
        await uploadMaterial(file, selectedCourse.id, selectedCategory);
      }
      setFiles([]);
      setUploaded(true);
    } catch (err: any) {
      setError(err.message ?? "อัพโหลดไม่สำเร็จ");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold" style={{ color: "#1F3D2B" }}>
          Student Uploads
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#8C8368" }}>
          แบ่งปันเนื้อหาการเรียน
        </p>
      </div>

      <div
        className="mx-auto max-w-xl rounded-2xl border bg-white p-6"
        style={{ borderColor: "#E4DEC7", boxShadow: "0 12px 30px -20px rgba(31,61,43,0.3)" }}
      >
        {/* Course & category selection */}
        <div className="mb-5 flex gap-4">
          <Dropdown label="วิชาเรียน" value={courseLabel} options={courseOptions} onChange={setCourseLabel} />
          <Dropdown
            label="เนื้อหา / แนวข้อสอบ"
            value={categoryLabel}
            options={CATEGORY_OPTIONS.map((c) => c.label)}
            onChange={setCategoryLabel}
          />
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors"
          style={{
            borderColor: isDragging ? "#3A5C42" : "#D9CFAE",
            background: isDragging ? "#F1EBD8" : "#FBF8EF",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.zip"
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <div
            className="mb-3 flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: "#E9F1E7" }}
          >
            <UploadCloud size={22} style={{ color: "#3A5C42" }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: "#1F3D2B" }}>
            ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
          </p>
          <p className="mt-1 text-xs" style={{ color: "#8C8368" }}>
            PDF, DOCX, ZIP (ไม่เกิน 50MB)
          </p>
        </div>

        {/* Selected files */}
        {files.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${i}`}
                className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                style={{ borderColor: "#E4DEC7", background: "#FBF8EF" }}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <FileText size={16} style={{ color: "#8FA98A", flexShrink: 0 }} />
                  <span className="truncate text-sm" style={{ color: "#1F3D2B" }}>
                    {f.name}
                  </span>
                  <span className="flex-shrink-0 text-xs" style={{ color: "#8C8368" }}>
                    {formatBytes(f.size)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="flex-shrink-0 rounded-full p-1 transition-colors hover:bg-[#F1EBD8]"
                  aria-label="ลบไฟล์"
                >
                  <X size={14} style={{ color: "#8C8368" }} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p className="mt-4 text-sm" style={{ color: "#B25B4C" }}>
            {error}
          </p>
        )}

        {/* Upload button */}
        <button
          type="button"
          disabled={files.length === 0 || isUploading}
          onClick={handleUpload}
          className="mt-5 w-full rounded-lg py-2.5 text-sm font-semibold transition-opacity disabled:opacity-40"
          style={{ background: "#1F3D2B", color: "#F1EBD8" }}
        >
          {isUploading ? "กำลังอัพโหลด..." : uploaded ? "อัพโหลดสำเร็จ ✓" : "Upload"}
        </button>
      </div>
    </main>
  );
}
