import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/utils/supabase/use-user-info";
import { Map } from "lucide-react";
import Link from "next/link";

const MOCK_PRODUCTS = [
  {
    id: 1,
    display_name: "Carrots",
    description: "Freshly picked from the ground",
    quantity_available: 10,
    price_per_unit: 15000,
    unit_type: "unit",
  },
  {
    id: 2,
    display_name: "Tomatoes",
    description: "Juicy and ripe",
    quantity_available: 0,
    price_per_unit: 20000,
    unit_type: "unit",
  },
];

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

  const { data: products } = await supabase
    .from("product")
    .select("*")
    .eq("farm_id", parseInt(id));

  if (!farm || !products) {
    return <div>Something went wrong</div>;
  }

  const isFarmOwner = farm.owner_id === userInfo.id;

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-medium">{farm.display_name}</h1>
        {farm.description && (
          <p className="text-muted-foreground">{farm.description}</p>
        )}
        {farm.address && (
          <div className="text-sm flex flex-row items-center gap-1 text-muted-foreground">
            <Map className="h-4 w-4" />
            {farm.address}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link href={`/farm/${id}/product/${product.id}`}>
            <div className="border rounded-lg px-5 py-4" key={product.id}>
              <h2 className="text-lg font-medium">{product.display_name}</h2>
              <p className="text-xs">
                {product.quantity_available > 0
                  ? `🟢 In stock, ${product.quantity_available} ${product.unit_type} available`
                  : "🔴 Out of stock"}
              </p>
              <p className="font-medium">
                {product.price_per_unit} IDR/{product.unit_type}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {products.length === 0 && (
        <div className="border rounded-lg p-8 text-muted-foreground bg-muted flex flex-col gap-4">
          No products available
          {isFarmOwner && (
            <Link href={`/farm/${id}/product/new`}>
              <Button>+ Add a product</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
