import { OrderTable } from "@/components/order-table";
import { getUserInfo } from "@/utils/supabase/use-user-info";
import { numberWithCommas } from "@/utils/with-commas";

export default async function Orders() {
  const { supabase, userInfo } = await getUserInfo();

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
      <h1 className="text-3xl font-medium">My Orders</h1>
      <OrderTable orders={tableRows} />
    </div>
  );
}
