import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // กัน open redirect: อนุญาตเฉพาะ path ภายในเว็บ
  const nextParam = searchParams.get("next") ?? "/reset-password";
  const next =
    nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/reset-password";

  const supabase = await createClient();
  let failed = true;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    failed = !!error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    failed = !!error;
  }

  // ถ้าล้มเหลว หน้า reset-password จะไม่พบ session แล้วแสดงว่าลิงก์ใช้ไม่ได้
  return NextResponse.redirect(`${origin}${failed ? "/reset-password" : next}`);
}