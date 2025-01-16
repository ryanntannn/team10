"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import z from "zod";

const createFarmSchema = z.object({
  display_name: z.string(),
  address: z.string().optional(),
  description: z.string().optional(),
});

export async function createFarm(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: dto, error: parseError } = createFarmSchema.safeParse({
    display_name: formData.get("display_name"),
    address: formData.get("address"),
    description: formData.get("description"),
  });

  if (!dto) {
    return redirect("/");
  }

  const { data, error: serverError } = await supabase
    .from("farm")
    .insert({ ...dto, owner_id: user.id })
    .select()
    .single();

  if (!serverError) {
    return redirect(`/farm/${data.id}`);
  }

  console.error(serverError);
}

const createProductSchema = z.object({
  farm_id: z
    .string()
    .transform((v) => parseInt(v))
    .pipe(z.number().int()),
  display_name: z.string(),
  description: z.string().optional(),
  price_per_unit: z
    .string()
    .transform((v) => parseInt(v))
    .pipe(z.number().int()),
  unit_type: z.enum(["unit", "kg", "ml"]),
});

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  console.log(formData);

  const { data: dto, error: parseError } = createProductSchema.safeParse({
    farm_id: formData.get("farm_id"),
    display_name: formData.get("display_name"),
    description: formData.get("description"),
    price_per_unit: formData.get("price_per_unit"),
    unit_type: formData.get("unit_type"),
  });

  if (!dto) {
    console.log(parseError);
    return redirect("/");
  }

  const { data, error: serverError } = await supabase
    .from("product")
    .insert({ ...dto, owner_id: user.id })
    .select()
    .single();

  if (!serverError) {
    return redirect(`/farm/${data.farm_id}`);
  }

  console.error(serverError);
}
