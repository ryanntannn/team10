import { getUserInfo } from "@/utils/supabase/use-user-info";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userInfo, supabase } = await getUserInfo();

  const { data: myFarms } = await supabase
    .from("farm")
    .select("*")
    .eq("owner_id", userInfo.id);

  const { data: myProducts } = await supabase
    .from("product")
    .select("*")
    .eq("owner_id", userInfo.id);

  const { data: myOrders } = await supabase
    .from("order")
    .select("*")
    .eq("user_id", userInfo.id);

  if (!userInfo) {
    return redirect("/sign-up");
  }

  if (userInfo.user_type === "farmer" && myFarms?.length === 1) {
    redirect(`/farm/${myFarms[0].id}`);
  }

  redirect(`/order`);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(userInfo, null, 2)}
        </pre>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your farms</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(myFarms, null, 2)}
        </pre>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your products</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(myProducts, null, 2)}
        </pre>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your orders</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(myOrders, null, 2)}
        </pre>
      </div>
    </div>
  );
}
