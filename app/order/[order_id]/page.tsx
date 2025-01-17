import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/utils/supabase/use-user-info";
import { numberWithCommas } from "@/utils/with-commas";
import { ArrowLeft, Clock, DollarSign, Map, Truck } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import {
  approveOrder,
  collectedOrder,
  rejectOrder,
  revertToPending,
} from "./actions";
import { OrderStatusBadge } from "@/components/order-status-badge";
import BackButton from "@/components/back-button";
import { SubmitButton } from "@/components/submit-button";

export default async function Orders({
  params,
}: {
  params: Promise<{ order_id: string; new?: "true" }>;
}) {
  const { order_id: orderId, ...restParams } = await params;
  const { supabase, userInfo } = await getUserInfo();

  const parsedOrderId = parseInt(orderId);

  const { data: order, error } = await supabase
    .from("order")
    .select("*")
    .eq("id", parsedOrderId)
    .single();
  const isNew = !!restParams["new"];

  if (!order) {
    console.log("error", error);
    return <div>Order not found</div>;
  }
  const { data: product } = await supabase
    .from("product")
    .select("display_name,farm_id")
    .eq("id", order.product_id)
    .single();

  if (!product || product.farm_id === null) {
    return <div>Something went wrong 2</div>;
  }

  const { data: farm } = await supabase
    .from("farm")
    .select("display_name,address,owner_id")
    .eq("id", product.farm_id)
    .single();

  if (!farm) {
    return <div>Something went wrong 3</div>;
  }

  const isFarmOwner = farm.owner_id === userInfo.id;

  return (
    <div className="flex flex-col gap-4">
      {isNew && <Badge>New order created!</Badge>}
      <div>
        <BackButton />
      </div>
      <h1 className="text-2xl font-medium flex flex-row items-center gap-1">
        Order {order.id}
        <OrderStatusBadge status={order.status} />
      </h1>
      <p>
        <Link href={`/farm/${product.farm_id}/product/${order.product_id}`}>
          {product.display_name}
        </Link>{" "}
        {order.quantity} {order.unit_type}
      </p>
      <p>
        <b>{numberWithCommas(order.price_per_unit * (order.quantity ?? 0))}</b>{" "}
        IDR{" "}
        <span className="text-muted-foreground text-xs	">
          ({numberWithCommas(order.price_per_unit)} IDR per {order.unit_type})
        </span>
      </p>
      <div className="rounded-md bg-muted p-4">
        Collection information:
        <div className="flex flex-row gap-1 items-center">
          <Clock className="w-4 h-4" />
          {new Date(order.collection_date ?? "").toLocaleDateString()},{" "}
          {new Date(order.collection_date ?? "").toLocaleTimeString()}
        </div>
        <p className="flex flex-row items-center gap-1">
          <Truck className="h-4 w-4" />
          Self collect from {farm?.address}
        </p>
        <p className="text flex flex-row items-center gap-1">
          <DollarSign className="h-4 w-4" />
          Cash on collection
        </p>
      </div>
      {isFarmOwner && (
        <div className="flex flex-row gap-2">
          {order.status === "pending_approval" && (
            <Form action={approveOrder} className="flex flex-col gap-4">
              <input type="hidden" name="order_id" value={order.id} />
              <SubmitButton type="submit">Confirm this order</SubmitButton>
            </Form>
          )}
          {order.status === "approved" && (
            <Form action={collectedOrder} className="flex flex-col gap-4">
              <input type="hidden" name="order_id" value={order.id} />
              <SubmitButton type="submit" variant="default">
                Order has been collected
              </SubmitButton>
            </Form>
          )}
          {order.status === "pending_approval" && (
            <Form action={rejectOrder} className="flex flex-col gap-4">
              <input type="hidden" name="order_id" value={order.id} />
              <SubmitButton type="submit" variant="destructive">
                Reject this order
              </SubmitButton>
            </Form>
          )}
          {order.status !== "pending_approval" && (
            <Form action={revertToPending} className="flex flex-col gap-4">
              <input type="hidden" name="order_id" value={order.id} />
              <SubmitButton type="submit" variant="outline">
                Revert to pending
              </SubmitButton>
            </Form>
          )}
        </div>
      )}
    </div>
  );
}
