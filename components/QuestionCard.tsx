"use client";

import { useState } from "react";
import type { Question } from "../lib/types";
import { AnswerModal } from "./AnswerModal";

interface QuestionCardProps {
  question: Question;
  onUpdated?: () => void;
}

export function QuestionCard({ question, onUpdated }: QuestionCardProps) {
  const [answerOpen, setAnswerOpen] = useState(false);
  const answers = question.answers ?? [];

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-1 flex items-start justify-between">
        <p className="text-sm font-medium" style={{ color: "#1F3D2B" }}>
          {question.author_name}
        </p>
        {question.subject_name && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            {question.subject_name}
          </span>
        )}
      </div>

      <p className="mb-1 text-sm" style={{ color: "#1F3D2B" }}>
        {question.content}
      </p>
      <p className="mb-3 text-xs text-gray-400">
        {new Date(question.created_at).toLocaleString("th-TH")}
      </p>

      {/* แสดงคำตอบทั้งหมด */}
      {answers.length > 0 && (
        <div className="mb-2 flex flex-col gap-2">
          <p className="text-xs text-gray-400">{answers.length} คำตอบ</p>
          {answers.map((a) => (
            <div
              key={a.id}
              className="rounded-md border-l-4 bg-gray-50 p-3 text-sm"
              style={{ borderColor: "#1F3D2B", color: "#1F3D2B" }}
            >
              <p className="mb-1 text-xs font-medium opacity-60">
                {a.answered_by} ·{" "}
                {new Date(a.created_at).toLocaleString("th-TH")}
              </p>
              <p className="whitespace-pre-wrap">{a.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* ปุ่มตอบอยู่ตลอด ไม่หายหลังมีคนตอบแล้ว */}
      <button
        onClick={() => setAnswerOpen(true)}
        className="mt-1 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
        style={{ borderColor: "#1F3D2B", color: "#1F3D2B" }}
      >
        {answers.length > 0 ? "เพิ่มคำตอบ" : "ตอบคำถาม"}
      </button>

      <AnswerModal
        open={answerOpen}
        onClose={() => setAnswerOpen(false)}
        question={question}
        onAnswered={onUpdated}
      />
    </div>
  );
}