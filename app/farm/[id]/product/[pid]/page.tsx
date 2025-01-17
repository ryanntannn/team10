import BackButton from "@/components/back-button";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserInfo } from "@/utils/supabase/use-user-info";
import { Label } from "@radix-ui/react-label";
import { Clock, DollarSign, Edit, Map, Truck } from "lucide-react";
import Form from "next/form";
import Link from "next/link";

export default async function FarmProductPage({
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

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <BackButton />
      </div>
      <div>
        <h1 className="text-2xl font-medium">{product.display_name}</h1>
        <p className="text-muted-foreground">
          from <Link href={`/farm/${farm.id}`}>{farm.display_name}</Link>
        </p>
      </div>
      {isFarmOwner && (
        <Link href={`/farm/${farm.id}/product/${product.id}/edit`}>
          <Button size="sm" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </Link>
      )}
      <div>
        <p className="text-sm text-muted-foreground">
          <span className="text-lg font-medium text-black">
            {product.price_per_unit}
          </span>{" "}
          IDR per {product.unit_type}{" "}
        </p>
        <p className="text-sm">
          {product.quantity_available > 0
            ? `🟢 In stock, ${product.quantity_available} ${product.unit_type} available`
            : "🔴 Out of stock"}
        </p>
      </div>
      {product.description && (
        <p className="text-muted-foreground">{product.description}</p>
      )}
      <div className="flex flex-col lg:flex-row items-start">
        <Form
          action={`${product.id}/confirm`}
          className="p-4 border rounded-lg flex flex-col gap-5 flex-grow w-full">
          <div className="text-xl font-medium">One time order</div>
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
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input name="quantity" type="number" />
          </div>
          <div>
            <Label htmlFor="collection_date">Collection Time</Label>
            <br />
            <input
              className="bg-transparent border rounded-md p-2"
              name="collection_date"
              type="datetime-local"
            />
          </div>
          <SubmitButton type="submit">Next</SubmitButton>
        </Form>
        <div className="p-4">or</div>
        <Form
          action={""}
          className="p-4 border rounded-lg flex flex-col gap-5 flex-grow w-full">
          <div className="text-xl font-medium">Recurring order</div>
          <div>
            <p className="text text-muted-foreground flex flex-row items-center gap-1">
              <Truck className="h-4 w-4" />
              Self collect from {farm?.address}
            </p>
            <p className="text text-muted-foreground flex flex-row items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Cash on collection
            </p>
            <p className="text text-muted-foreground flex flex-row items-center gap-1">
              <Clock className="h-4 w-4" />
              Customize your delivery schedule
            </p>
          </div>
          <Button disabled type="submit">
            Coming soon
          </Button>
        </Form>
      </div>
    </div>
  );
}
