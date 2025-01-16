import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function getUserInfo() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: userInfo } = await supabase
    .from("user")
    .select("*")
    .eq("id", user.id)
    .single();

  if (userInfo === null || userInfo?.user_type === null) {
    return redirect("/onboarding/step-1");
  }

  if (userInfo.user_type === "farmer") {
    const { data: farms } = await supabase
      .from("farm")
      .select("*")
      .eq("owner_id", userInfo.id);

    if (!farms || farms.length === 0) {
      return redirect("/onboarding/step-2");
    }
  }

  return { userInfo: { ...user, ...userInfo }, supabase };
}
