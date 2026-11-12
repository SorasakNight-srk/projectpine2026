
"use client";

import { useEffect, useRef, useState } from "react";
import type { Answer, Question } from "../lib/types";
import { AnswerModal } from "./AnswerModal";
import { createClient } from "../lib/supabase/client";

const authClient = createClient();

function AnswerItem({
  answer,
  currentUserId,
  onUpdated,
}: {
  answer: Answer;
  currentUserId: string | null;
  onUpdated?: () => void;
}) {
  const textRef = useRef<HTMLParagraphElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(answer.content);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const isOwner =
    !!currentUserId && answer.user_id === currentUserId;

  // ตรวจสอบว่าข้อความถูกตัดหรือไม่
  useEffect(() => {
    const el = textRef.current;

    if (!el || expanded || isEditing) return;

    const check = () => {
      setIsClamped(el.scrollHeight > el.clientHeight + 1);
    };

    check();

    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("resize", check);
    };
  }, [answer.content, expanded, isEditing]);

  // เริ่มแก้ไขคำตอบ
  const startEdit = () => {
    setDraft(answer.content);
    setErrorMessage("");
    setIsEditing(true);
  };

  // บันทึกการแก้ไขคำตอบ
  const handleSave = async () => {
    const text = draft.trim();

    if (!text || isSaving) return;

    setIsSaving(true);
    setErrorMessage("");

    const { data, error } = await authClient
      .from("answers")
      .update({
        content: text,
        updated_at: new Date().toISOString(),
      })
      .eq("id", answer.id)
      .select("id");

    setIsSaving(false);

    // ตรวจสอบข้อผิดพลาดจาก Supabase หรือ RLS
    if (error || !data || data.length === 0) {
      setErrorMessage(
        "แก้ไขไม่สำเร็จ (อาจไม่มีสิทธิ์แก้ไขคำตอบนี้)"
      );

      console.error(
        "แก้ไขคำตอบไม่สำเร็จ:",
        error?.message ?? "no rows updated"
      );

      return;
    }

    setIsEditing(false);
    onUpdated?.();
  };

  // ลบคำตอบ
  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setDeleteError("");

    const { data, error } = await authClient
      .from("answers")
      .delete()
      .eq("id", answer.id)
      .select("id");

    setIsDeleting(false);

    // ตรวจสอบข้อผิดพลาดจาก Supabase หรือ RLS
    if (error || !data || data.length === 0) {
      setDeleteError(
        "ลบไม่สำเร็จ (อาจไม่มีสิทธิ์ลบคำตอบนี้)"
      );

      console.error(
        "ลบคำตอบไม่สำเร็จ:",
        error?.message ?? "no rows deleted"
      );

      return;
    }

    setConfirmingDelete(false);
    onUpdated?.();
  };

  return (
    <div
      className="min-w-0 rounded-md border-l-4 bg-gray-50 p-3 text-sm"
      style={{
        borderColor: "#1F3D2B",
        color: "#1F3D2B",
      }}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-xs font-medium opacity-60">
          {answer.answered_by} ·{" "}
          {new Date(answer.created_at).toLocaleString("th-TH")}
          {answer.updated_at && " · แก้ไขแล้ว"}
        </p>

        {isOwner && !isEditing && !confirmingDelete && (
          <div className="flex flex-shrink-0 gap-3">
            <button
              type="button"
              onClick={startEdit}
              className="flex-shrink-0 text-xs font-medium underline opacity-70 transition-opacity hover:opacity-100"
            >
              แก้ไข
            </button>

            <button
              type="button"
              onClick={() => {
                setDeleteError("");
                setConfirmingDelete(true);
              }}
              className="text-xs font-medium text-red-600 underline opacity-80 transition-opacity hover:opacity-100"
            >
              ลบ
            </button>
          </div>
        )}
      </div>

      {/* ส่วนแก้ไขคำตอบ */}
      {isEditing ? (
        <div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            autoFocus
            className="w-full resize-none rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2"
            style={{
              borderColor: "#C9D6CC",
              color: "#1F3D2B",
            }}
          />

          {errorMessage && (
            <p className="mt-1 text-xs text-red-600">
              {errorMessage}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="rounded-full border px-4 py-1 text-xs font-medium"
              style={{
                borderColor: "#1F3D2B",
                color: "#1F3D2B",
              }}
            >
              ยกเลิก
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || draft.trim() === ""}
              className="rounded-full px-4 py-1 text-xs font-medium text-white disabled:opacity-40"
              style={{
                backgroundColor: "#1F3D2B",
              }}
            >
              {isSaving ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>
      ) : confirmingDelete ? (
        /* ส่วนยืนยันการลบ */
        <div>
          <p className="text-xs">
            คุณต้องการลบคำตอบนี้ใช่หรือไม่?
          </p>

          {deleteError && (
            <p className="mt-1 text-xs text-red-600">
              {deleteError}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={isDeleting}
              className="rounded-full border px-4 py-1 text-xs"
              style={{
                borderColor: "#1F3D2B",
                color: "#1F3D2B",
              }}
            >
              ยกเลิก
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-full bg-red-600 px-4 py-1 text-xs text-white disabled:opacity-40"
            >
              {isDeleting ? "กำลังลบ..." : "ยืนยันลบ"}
            </button>
          </div>
        </div>
      ) : (
        /* ส่วนแสดงคำตอบ */
        <>
          <p
            ref={textRef}
            onClick={() =>
              (isClamped || expanded) &&
              setExpanded((v) => !v)
            }
            className={`whitespace-pre-wrap [overflow-wrap:anywhere] ${
              expanded ? "" : "line-clamp-3"
            } ${
              isClamped || expanded ? "cursor-pointer" : ""
            }`}
          >
            {answer.content}
          </p>

          {(isClamped || expanded) && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs font-medium underline opacity-70 transition-opacity hover:opacity-100"
            >
              {expanded ? "ย่อ" : "ดูเพิ่มเติม"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

interface QuestionCardProps {
  question: Question;
  onUpdated?: () => void;
}

export function QuestionCard({
  question,
  onUpdated,
}: QuestionCardProps) {
  const [answerOpen, setAnswerOpen] = useState(false);
  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const answers = question.answers ?? [];

  useEffect(() => {
    let cancelled = false;

    authClient.auth.getUser().then(({ data }) => {
      if (!cancelled) {
        setCurrentUserId(data.user?.id ?? null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-1 flex items-start justify-between gap-3">
        <p
          className="text-sm font-medium"
          style={{ color: "#1F3D2B" }}
        >
          {question.author_name}
        </p>

        {question.subject_name && (
          <span className="flex-shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            {question.subject_name}
          </span>
        )}
      </div>

      <p
        className="mb-1 whitespace-pre-wrap text-sm [overflow-wrap:anywhere]"
        style={{ color: "#1F3D2B" }}
      >
        {question.content}
      </p>

      <p className="mb-3 text-xs text-gray-400">
        {new Date(question.created_at).toLocaleString("th-TH")}
      </p>

      {answers.length > 0 && (
        <div className="mb-2 flex flex-col gap-2">
          <p className="text-xs text-gray-400">
            {answers.length} คำตอบ
          </p>

          {answers.map((a) => (
            <AnswerItem
              key={a.id}
              answer={a}
              currentUserId={currentUserId}
              onUpdated={onUpdated}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setAnswerOpen(true)}
        className="mt-1 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
        style={{
          borderColor: "#1F3D2B",
          color: "#1F3D2B",
        }}
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
