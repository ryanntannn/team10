import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/utils/supabase/use-user-info";
import { BarChart, Edit, Map } from "lucide-react";
import Link from "next/link";

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
        {isFarmOwner && (
          <div className="flex flex-row gap-2">
            <Link href={`/farm/${id}/edit`}>
              <Button size="sm" className="gap-2 mt-4">
                <Edit className="w-4 h-4" />
                Edit Farm Information
              </Button>
            </Link>
            <Link href={`/farm/${id}/order`}>
              <Button size="sm" className="gap-2 mt-4">
                View Orders
              </Button>
            </Link>
            <Link href={`https://blank-app-infxw0u9fkb.streamlit.app/Test2`}>
              <Button size="sm" className="gap-2 mt-4">
                <BarChart className="w-4 h-4" />
                Analytics Dashboard
              </Button>
            </Link>
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
        {isFarmOwner && products.length > 0 && (
          <Link href={`/farm/${id}/product/new`}>
            <Button variant="secondary" className="w-full h-full">
              + Add a new product
            </Button>
          </Link>
        )}
      </div>
      {products.length === 0 && (
        <div className="border rounded-lg p-8 text-muted-foreground bg-muted flex flex-col gap-4">
          No products available
          {isFarmOwner && (
            <Link href={`/farm/${id}/product/new`}>
              <Button>+ Add your first</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
