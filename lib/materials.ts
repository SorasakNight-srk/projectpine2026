import { supabase } from "./supabaseClient";
import type { Category, Course, Material } from "./types";

// Name of the Supabase Storage bucket that holds uploaded files.
// Create this bucket once in the Supabase dashboard (Storage -> New bucket -> "materials").
export const MATERIALS_BUCKET = "materials";

// Cosmetic values that aren't stored in the DB, cycled per row so cards
// keep the same "pinned note" look as the original mock data.
const ROTATIONS = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1"];
const ACCENTS = ["#8FA98A", "#C98A4B", "#6E8CA0", "#B25B4C"];

type CourseRow = {
  id: string;
  code: string;
  tag: string;
  name: string;
  note: string | null;
  created_at: string;
};

export async function fetchCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("id, code, tag, name, note, created_at")
    .order("code", { ascending: true });

  if (error) throw error;

  return (data as CourseRow[]).map((row, i) => ({
    ...row,
    rotate: ROTATIONS[i % ROTATIONS.length],
    accent: ACCENTS[i % ACCENTS.length],
  }));
}

export async function fetchMaterials(
  courseId: string,
  category: Category
): Promise<Material[]> {
  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .eq("course_id", courseId)
    .eq("category", category)
    .order("uploaded_at", { ascending: false });

  if (error) throw error;
  return data as Material[];
}

// Returns a temporary signed URL so a private bucket can still serve files.
export async function getMaterialUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(MATERIALS_BUCKET)
    .createSignedUrl(filePath, 60 * 60); // 1 hour

  if (error) throw error;
  return data.signedUrl;
}

export async function uploadMaterial(
  file: File,
  courseId: string,
  category: Category
): Promise<Material> {
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const filePath = `${courseId}/${category}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(MATERIALS_BUCKET)
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) throw uploadError;

  const { data, error: insertError } = await supabase
    .from("materials")
    .insert({
      course_id: courseId,
      category,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
    })
    .select()
    .single();

  if (insertError) throw insertError;
  return data as Material;
}

export async function deleteMaterial(material: { id: string; file_path: string }) {
  // ลบแถวใน DB ก่อน ถ้าไม่ใช่เจ้าของ RLS จะบล็อกแล้วไฟล์ใน Storage จะไม่ถูกแตะ
  const { data, error: dbError } = await supabase
    .from("materials")
    .delete()
    .eq("id", material.id)
    .select();
  if (dbError) throw new Error(dbError.message);
  if (!data || data.length === 0) throw new Error("คุณไม่มีสิทธิ์ลบไฟล์นี้");

  // แล้วค่อยลบไฟล์ใน Storage
  const { error: storageError } = await supabase.storage
    .from(MATERIALS_BUCKET)
    .remove([material.file_path]);
  if (storageError) throw new Error(storageError.message);
}