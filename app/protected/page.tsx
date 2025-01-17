import { OrderTable } from "@/components/order-table";
import { getUserInfo } from "@/utils/supabase/use-user-info";
import { numberWithCommas } from "@/utils/with-commas";
import { InfoIcon, Map } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userInfo, supabase } = await getUserInfo();

  const { data: myFarms } = await supabase.from("farm").select("*");

  const { data: myProducts } = await supabase
    .from("product")
    .select("*")
    .eq("owner_id", userInfo.id);

  const { data: upcomingOrders } = await supabase
    .from("order")
    .select(
      `
		id,
		quantity,
		unit_type,
		price_per_unit,
		collection_date,
		user_id,
		status,
		product (
			display_name
		),
		farm (
			display_name
		)
`
    )
    .eq("user_id", userInfo?.id)
    .order("collection_date", { ascending: true });

  if (!userInfo) {
    return redirect("/sign-up");
  }

  if (userInfo.user_type === "farmer" && myFarms?.length === 1) {
    redirect(`/farm/${myFarms[0].id}`);
  }

  const tableRows = (upcomingOrders ?? []).map((order) => ({
    id: order.id,
    farm_name: order.farm?.display_name ?? "None",
    product_name: order.product.display_name,
    quantity: numberWithCommas(order.quantity ?? 0) + order.unit_type,
    price: `${numberWithCommas(order.price_per_unit * (order.quantity ?? 0))} IDR`,
    collection_date:
      new Date(order.collection_date ?? "").toLocaleString() ?? "None",
    status: order.status,
  }));

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <h1 className="text-2xl font-medium">Discover your nearby farms</h1>
      <div className="flex flex-col gap-4">
        {myFarms?.map((farm) => (
          <Link href={`/farm/${farm.id}`}>
            <div
              key={farm.id}
              className="flex flex-col gap-2 border p-4 rounded-md">
              <h2 className="text-lg font-medium">{farm.display_name}</h2>
              {farm.description && (
                <p className="text-muted-foreground">{farm.description}</p>
              )}
              {farm.address && (
                <div className="text-sm flex flex-row items-center gap-1 text-muted-foreground">
                  <Map className="h-4 w-4" />
                  {farm.address}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <h1 className="text-2xl font-medium">Upcoming Orders</h1>
      <OrderTable orders={tableRows} />
    </div>
  );
}
