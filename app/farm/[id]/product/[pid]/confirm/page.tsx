import { ConfirmButton } from "@/components/confirm-button";
import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/utils/supabase/use-user-info";
import { numberWithCommas } from "@/utils/with-commas";
import { DollarSign, Truck } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { z } from "zod";
import { createOrder } from "./actions";

const searchParamsSchema = z.object({
  quantity: z
    .string()
    .transform((x) => parseInt(x))
    .pipe(z.number()),
  collection_date: z
    .string()
    .transform((x) => new Date(x))
    .pipe(z.date()),
  confirmed: z.literal("on").optional(),
});

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ pid: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { pid, id } = await params;

  const { supabase, userInfo } = await getUserInfo();

  const { data: product } = await supabase
    .from("product")
    .select("*")
    .eq("id", parseInt(pid))
    .single();

  const { data: farm } = await supabase
    .from("farm")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  const { data, error } = searchParamsSchema.safeParse(await searchParams);

  if (error) {
    return (
      <div>
        Invalid search params: {JSON.stringify(searchParams)} {error.message}
      </div>
    );
  }

  if (!product || !farm) {
    return <div>Something went wrong</div>;
  }

  if (!data.confirmed) {
    return (
      <Form action={createOrder} className="flex flex-col gap-4">
        <input type="hidden" name="product_id" value={product.id} />
        <input type="hidden" name="quantity" value={data.quantity} />
        <input
          type="hidden"
          name="collection_date"
          value={data.collection_date.toISOString()}
        />
        <h1 className="text-lg font-medium">Confirm order</h1>
        <div>
          <p className="text-3xl font-medium">{product?.display_name}</p>
          <p className="text-sm text-muted-foreground">
            from {farm?.display_name}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Please verify your order details before confirming your order
        </p>
        <div className="text-lg">
          <p>
            Total Price:{" "}
            <b>{numberWithCommas(product.price_per_unit * data.quantity)}</b>{" "}
            IDR
          </p>
          <p>
            Quantity: {data.quantity} {product?.unit_type}
          </p>
          <p>Collection time: {data.collection_date.toString()}</p>
        </div>
        <div>
          <p className="text text-muted-foreground flex flex-row items-center gap-1">
            <Truck className="h-4 w-4" />
            Self collect from {farm?.address}
          </p>
          <p className="text text-muted-foreground flex flex-row items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Cash on collection
          </p>
        </div>
        <ConfirmButton />
      </Form>
    );
  }
}
