"use client";

import { useState } from "react";
import { User, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import type { Question } from "../lib/types";

interface AnswerModalProps {
  open: boolean;
  onClose: () => void;
  onAnswered?: () => void;
  question: Question | null;
  authorName?: string;
}

export function AnswerModal({
  open,
  onClose,
  onAnswered,
  question,
  authorName = "ผู้ใช้งาน",
}: AnswerModalProps) {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!open || !question) return null;

  const canPost = answer.trim() !== "" && !isSubmitting;

  const handlePost = async () => {
    if (!canPost) return;
    setIsSubmitting(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("questions")
      .update({
        answer: answer.trim(),
        answered_at: new Date().toISOString(),
        answered_by: authorName,
      })
      .eq("id", question.id);

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
            {authorName}
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