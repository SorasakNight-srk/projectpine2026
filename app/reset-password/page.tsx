import { createClient } from "@/lib/supabase/server";
import { ResetPasswordPage } from "@/components/ResetPasswordPage";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ResetPasswordPage hasSession={!!user} />;
}