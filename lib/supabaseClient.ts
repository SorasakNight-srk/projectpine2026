// import { createClient } from "@supabase/supabase-js";

// // ตั้งค่า environment variables เหล่านี้ใน .env.local ของโปรเจกต์:
// // NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
// // NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // ใช้ชื่อ env เดิมของโปรเจกต์
);