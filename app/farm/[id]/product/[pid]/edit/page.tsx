import { createProduct, updateProduct } from "@/app/farm/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserInfo } from "@/utils/supabase/use-user-info";
import { Label } from "@radix-ui/react-label";
import { Clock, DollarSign, Map, Truck } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function FarmProductEditPage({
  params,
}: {
  params: Promise<{ id: string; pid: string }>;
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

  if (!product || !farm) {
    return <div>Something went wrong</div>;
  }

  const isFarmOwner = farm.owner_id === userInfo.id;
  if (!isFarmOwner) {
    redirect(`/farm/${farm.id}/product/${product.id}`);
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-3xl font-semibold">Update farm details</h1>

      <Form action={updateProduct} className="flex flex-col gap-4">
        <input type="hidden" name="product_id" value={product.id} />
        <input type="hidden" name="farm_id" value={farm.id} />
        <div>
          <Label htmlFor="display_name">Product name</Label>
          <Input
            id="display_name"
            name="display_name"
            defaultValue={product.display_name}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            defaultValue={product.description ?? undefined}
          />
        </div>

        <div>
          <Label htmlFor="price_per_unit">Price per unit</Label>
          <Input
            id="price_per_unit"
            name="price_per_unit"
            defaultValue={product.price_per_unit}
          />
        </div>

        <div className="flex flex-row gap-2 items-center">
          <Label htmlFor="unit_type">Unit type</Label>
          <select
            className="bg-white border p-2 rounded-md"
            required
            defaultValue={product.unit_type}
            name="unit_type">
            <option value="unit">Unit</option>
            <option value="kg">Kilogram</option>
            <option value="ml">Milliliters</option>
          </select>
        </div>

        <div>
          <Label htmlFor="quantity_available">Quantity available</Label>
          <Input
            id="quantity_available"
            name="quantity_available"
            type="number"
            defaultValue={product.quantity_available}
          />
        </div>
        <div className="flex flex-row gap-2">
          <Button type="submit">Update product</Button>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
