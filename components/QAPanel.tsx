"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Plus, MessageCircle } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import type { Question } from "../lib/types";
import { PostQuestionModal } from "./PostQuestionModal";
import { QuestionCard } from "./QuestionCard";

export function QAPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("questions")
      .select(
        "id, course_id, author_name, content, created_at, courses!questions_course_id_fkey(code, name), answers(id, question_id, content, answered_by, created_at, user_id, updated_at)"
      )
      .order("created_at", { ascending: false })
      .order("created_at", { referencedTable: "answers", ascending: true });

    if (error) {
      console.error("โหลดกระทู้ไม่สำเร็จ:", error.message);
    } else {
      const mapped: Question[] = (data ?? []).map((row: any) => ({
        id: row.id,
        course_id: row.course_id,
        author_name: row.author_name,
        content: row.content,
        created_at: row.created_at,
        answers: row.answers ?? [],
        subject_name: row.courses
          ? `${row.courses.code} · ${row.courses.name}`
          : undefined,
      }));
      console.log("questions + answers:", mapped);
      setQuestions(mapped);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const filteredQuestions = questions.filter((q) =>
    q.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1 p-8">
      <div className="mb-7">
        <h1 className="mt-1 text-2xl font-semibold" style={{ color: "#1F3D2B" }}>
          Q & A
        </h1>
      </div>

      <div className="mb-8 flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาคำถาม..."
            className="w-full rounded-md border px-4 py-3 pr-11 text-sm outline-none transition-colors focus:ring-2"
            style={{
              borderColor: "#C9D6CC",
              color: "#1F3D2B",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#1F3D2B")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#C9D6CC")}
          />
          <Search
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "#1F3D2B" }}
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          aria-label="โพสต์กระทู้ใหม่"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors hover:bg-[#1F3D2B] hover:text-white"
          style={{ borderColor: "#1F3D2B", color: "#1F3D2B" }}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading && (
          <p className="text-sm text-gray-400">กำลังโหลดกระทู้...</p>
        )}

        {!isLoading && filteredQuestions.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
            <MessageCircle className="h-8 w-8" />
            <p className="text-sm">ยังไม่มีกระทู้ ลองเป็นคนแรกที่ตั้งคำถาม</p>
          </div>
        )}

        {filteredQuestions.map((q) => (
          <QuestionCard key={q.id} question={q} onUpdated={fetchQuestions} />
        ))}
      </div>

      <PostQuestionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPosted={fetchQuestions}
      />
    </main>
  );
}