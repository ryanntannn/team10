import { createProduct } from "@/app/farm/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getUserInfo } from "@/utils/supabase/use-user-info";
import { Label } from "@radix-ui/react-label";
import Form from "next/form";

export default async function FarmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { supabase, userInfo } = await getUserInfo();

  const { data: farm } = await supabase
    .from("farm")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (!farm) {
    return <>Something went wrong</>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-medium">
          Add a new product to {farm.display_name}
        </h1>
        <p className="text-muted-foreground">
          Let your customers know what you have in store
        </p>
      </div>
      <Form action={createProduct} className="flex flex-col gap-8">
        <Input required name="farm_id" type="hidden" value={farm.id} />
        <div>
          <Label htmlFor="display_name">Product name *</Label>
          <Input required name="display_name" type="text" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input name="description" type="text" />
        </div>
        <div>
          <Label htmlFor="unit_type">
            Unit of measurement <Badge variant="secondary">?</Badge>
          </Label>
          <br />
          <select
            className="bg-white border p-2 rounded-md"
            required
            defaultValue={"unit"}
            name="unit_type">
            <option value="unit">Unit</option>
            <option value="kg">Kilogram</option>
            <option value="ml">Milliliters</option>
          </select>
        </div>
        <div>
          <Label htmlFor="price_per_unit">
            Price per unit<Badge variant="secondary">?</Badge>
          </Label>
          <Input required name="price_per_unit" type="number" />
        </div>
        <Button type="submit">Add product</Button>
      </Form>
    </div>
  );
}
