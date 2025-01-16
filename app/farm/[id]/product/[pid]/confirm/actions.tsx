"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const createOrderSchema = z.object({
  quantity: z
    .string()
    .transform((x) => parseInt(x))
    .pipe(z.number()),
  collection_date: z.string(),
});

export async function createOrder(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: dto, error: parseError } = createOrderSchema.safeParse({
    quantity: formData.get("quantity"),
    collection_date: formData.get("collection_date"),
  });

  const product_id_raw = formData.get("product_id");
  const product_id = z
    .string()
    .transform((x) => parseInt(x))
    .parse(product_id_raw);

  const { data: product } = await supabase
    .from("product")
    .select("*")
    .eq("id", product_id)
    .single();

  if (!dto || !product) {
    throw new Error("Invalid data");
  }

  const { data: order } = await supabase
    .from("order")
    .insert({
      ...dto,
      product_id: product.id,
      user_id: user.id,
      price_per_unit: product.price_per_unit,
      unit_type: product.unit_type,
      farm_id: product.farm_id,
    })
    .select("*")
    .single();

  if (!order) {
    throw new Error("Failed to create order");
  }

  return redirect(`/order/${order.id}?new=true`);
}
