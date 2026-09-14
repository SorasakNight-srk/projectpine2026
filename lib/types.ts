import type { LucideIcon } from "lucide-react";

// Matches the `courses` table in Supabase.
export interface Course {
  id: string;
  code: string;
  tag: string;
  name: string;
  note: string | null;
  created_at: string;
  rotate?: string;
  accent?: string;
}

export type Category = "sheet" | "exam";

// Matches the `materials` table in Supabase.
export type Material = {
  id: string; // uuid
  course_id: string; // fk -> courses.id
  category: Category;
  file_name: string;
  file_path: string; // path inside the storage bucket
  file_size: number; // bytes
  uploaded_at: string; // ISO timestamp
};

export type NavItem = {
  label: string;
  icon: LucideIcon;
  path: string;
};

export const CATEGORY_LABEL: Record<Category, string> = {
  sheet: "ชีทสรุป",
  exam: "แนวข้อสอบ",
};



export interface Question {
  id: string;
  course_id: string;
  author_name: string;
  content: string;
  created_at: string;
  // เติมมาจากการ join กับตาราง courses (ไม่ได้เก็บจริงในตาราง questions)
  subject_name?: string;
  answer?: string | null;
  answered_at?: string | null;
  answered_by?: string | null;
}

