"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

type OrderStatus = "approved" | "rejected" | "pending_approval" | "collected";

async function updateStatus(status: OrderStatus, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const order_id_raw = formData.get("order_id");
  const order_id = z
    .string()
    .transform((x) => parseInt(x))
    .parse(order_id_raw);

  const { data: order } = await supabase
    .from("order")
    .update({ status })
    .eq("id", order_id)
    .select("*")
    .single();

  if (!order) {
    throw new Error("Invalid data");
  }

  return redirect(`/order/${order.id}`);
}

export const approveOrder = async (formData: FormData) =>
  await updateStatus("approved", formData);
export const rejectOrder = async (formData: FormData) =>
  await updateStatus("rejected", formData);
export const revertToPending = async (formData: FormData) =>
  await updateStatus("pending_approval", formData);
export const collectedOrder = async (formData: FormData) =>
  await updateStatus("collected", formData);
