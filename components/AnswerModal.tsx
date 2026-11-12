"use client";

import { useEffect, useState } from "react";
import { User, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { createClient } from "../lib/supabase/client";
import type { Question } from "../lib/types";

const authClient = createClient();

interface AnswerModalProps {
  open: boolean;
  onClose: () => void;
  onAnswered?: () => void;
  question: Question | null;
  authorName?: string; // ถ้าส่งมา จะใช้ค่านี้แทนชื่อที่ดึงจาก Auth
}

export function AnswerModal({
  open,
  onClose,
  onAnswered,
  question,
  authorName,
}: AnswerModalProps) {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("ผู้ใช้งาน");

  // ดึงชื่อผู้ใช้ที่ล็อกอินอยู่
  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      const { data } = await authClient.auth.getUser();
      const user = data.user;
      if (!user || cancelled) return;

      const meta = user.user_metadata ?? {};
      const name =
        meta.username ??
        meta.user_name ??
        meta.full_name ??
        meta.name ??
        user.email?.split("@")[0] ??
        "ผู้ใช้งาน";

      setUsername(name);
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open || !question) return null;

  const displayName = authorName ?? username;
  const canPost = answer.trim() !== "" && !isSubmitting;

  const handlePost = async () => {
    if (!canPost) return;
    setIsSubmitting(true);
    setErrorMessage("");

    const { error } = await authClient
      .from("answers")
      .insert({
        question_id: question.id,
        content: answer.trim(),
        answered_by: displayName,
      });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage("ตอบคำถามไม่สำเร็จ ลองใหม่อีกครั้ง");
      console.error("บันทึกคำตอบไม่สำเร็จ:", error.message);
      return;
    }

    setAnswer("");
    onAnswered?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-md flex-col rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="ปิด"
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border"
            style={{ borderColor: "#C9D6CC", color: "#1F3D2B" }}
          >
            <User className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium" style={{ color: "#1F3D2B" }}>
            {displayName}
          </span>
        </div>

        {/* คำถามเดิม แสดงเป็น context */}
        <div
          className="mb-3 rounded-md border p-3 text-sm"
          style={{ borderColor: "#C9D6CC", color: "#1F3D2B" }}
        >
          <p className="mb-1 text-xs font-medium opacity-60">
            {question.author_name}
          </p>
          <p>{question.content}</p>
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="คำตอบของคุณ..."
          rows={6}
          autoFocus
          className="w-full resize-none rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:ring-2"
          style={{ borderColor: "#C9D6CC", color: "#1F3D2B" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#1F3D2B")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#C9D6CC")}
        />

        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          onClick={handlePost}
          disabled={!canPost}
          className="ml-auto mt-4 rounded-full px-6 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40"
          style={{ backgroundColor: "#1F3D2B" }}
        >
          {isSubmitting ? "กำลังบันทึก..." : "ตอบคำถาม"}
        </button>
      </div>
    </div>
  );
}