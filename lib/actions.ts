"use server";

import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";

type Result =
  | { ok: true; user: { name: string; email?: string; studentId?: string } }
  | { ok: false; error: string };

// ใช้ service_role เฉพาะฝั่งเซิร์ฟเวอร์ เพื่อหาอีเมลจากรหัสนักศึกษา
function admin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // ห้ามมี NEXT_PUBLIC_
    { auth: { persistSession: false } }
  );
}

async function logLogin(userId: string) {
  const supabase = await createClient();
  const h = await headers();
  // insert ด้วย service_role เพราะตารางนี้ไม่เปิด policy insert ให้ client
  await admin().from("login_logs").insert({
    user_id: userId,
    ip_address: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    user_agent: h.get("user-agent"),
  });
}

export async function registerAction(input: {
  name: string;
  email: string;
  studentId: string;
  password: string;
}): Promise<Result> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { name: input.name, student_id: input.studentId } },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already"))
      return { ok: false, error: "อีเมลนี้ถูกใช้งานแล้ว" };
    return { ok: false, error: "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่" };
  }
  if (!data.user) return { ok: false, error: "สมัครสมาชิกไม่สำเร็จ" };

  // ถ้าเปิด Confirm email ไว้ จะยังไม่มี session
  if (!data.session)
    return { ok: false, error: "ส่งอีเมลยืนยันแล้ว กรุณาตรวจสอบกล่องจดหมาย" };

  return {
    ok: true,
    user: { name: input.name, email: input.email, studentId: input.studentId },
  };
}

export async function loginAction(input: {
  identifier: string;
  password: string;
}): Promise<Result> {
  const supabase = await createClient();
  let email = input.identifier;

  // ถ้าเป็นตัวเลข 10 หลัก ให้หาอีเมลจาก profiles
  if (/^\d{10}$/.test(input.identifier)) {
    const { data } = await admin()
      .from("profiles")
      .select("id")
      .eq("student_id", input.identifier)
      .maybeSingle();

    if (!data) return { ok: false, error: "รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง" };

    const { data: u } = await admin().auth.admin.getUserById(data.id);
    email = u.user?.email ?? "";
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error || !data.user)
    return { ok: false, error: "อีเมล/รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง" };

  await logLogin(data.user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, student_id")
    .eq("id", data.user.id)
    .single();

  return {
    ok: true,
    user: {
      name: profile?.name ?? email.split("@")[0],
      email: data.user.email,
      studentId: profile?.student_id ?? undefined,
    },
  };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}