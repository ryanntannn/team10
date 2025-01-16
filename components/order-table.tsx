"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "./ui/data-table";

export type OrderRow = {
  id: number;
  farm_name: string;
  product_name: string;
  quantity: string;
  price: string;
  collection_date: string;
  status: string;
};

export function OrderTable({ orders }: { orders: OrderRow[] }) {
  const router = useRouter();
  return (
    <DataTable
      columns={[
        { accessorKey: "id", header: "ID" },
        { accessorKey: "farm_name", header: "Farm" },
        { accessorKey: "product_name", header: "Product" },
        { accessorKey: "quantity", header: "Quantity" },
        { accessorKey: "price", header: "Price" },
        { accessorKey: "collection_date", header: "Collection Date" },
        { accessorKey: "status", header: "Status" },
      ]}
      data={orders}
      onRowClick={(order) => {
        router.push(`/order/${order.id}`);
      }}
    />
  );
}
