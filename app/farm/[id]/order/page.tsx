import { OrderTable } from "@/components/order-table";
import { getUserInfo } from "@/utils/supabase/use-user-info";
import { numberWithCommas } from "@/utils/with-commas";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function FarmOrders({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawFarmId } = await params;
  const farmId = parseInt(rawFarmId);
  const { supabase, userInfo } = await getUserInfo();

  const { data: farm } = await supabase
    .from("farm")
    .select("owner_id")
    .eq("id", farmId)
    .single();

  if (!farm || farm.owner_id !== userInfo.id) {
    return <div>Unauthorized</div>;
  }

  const { data: orders } = await supabase
    .from("order")
    .select(
      `
			id,
			quantity,
			unit_type,
			price_per_unit,
			collection_date,
			user_id,
			farm_id,
			farm (
				display_name
			),
			product (
				display_name
			),
			status
	`
    )
    .eq("farm_id", farmId)
    .order("collection_date", { ascending: false })
    .order("status", { ascending: false });

  if (!orders) {
    return <div>No orders found</div>;
  }

  const tableRows = orders.map((order) => ({
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
    <div className="flex flex-col gap-4">
      <Link
        href={`/farm/${farmId}`}
        className="text-muted-foreground text-xs flex flex-row gap-2 items-center">
        <ArrowLeft className="w-3 h-3" /> Back to farm
      </Link>
      <h1 className="text-3xl font-medium">My Orders</h1>
      <OrderTable orders={tableRows} />
    </div>
  );
}
