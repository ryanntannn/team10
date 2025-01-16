import { Database } from "@/utils/supabase/database.types";
import { Badge } from "./ui/badge";

type OrderStatus = Database["public"]["Enums"]["order_status"];

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  switch (status) {
    case "pending_approval":
      return <Badge variant="outline">Pending Approval</Badge>;
    case "approved":
      return <Badge variant="default">Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    case "collected":
      return <Badge variant="secondary">Collected</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}
