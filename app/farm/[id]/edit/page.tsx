import { createFarm, updateFarm } from "@/app/farm/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserInfo } from "@/utils/supabase/use-user-info";
import Form from "next/form";
import Link from "next/link";

export default async function EditFarmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { supabase } = await getUserInfo();

  const { data: farm } = await supabase
    .from("farm")
    .select("*")
    .eq("id", parseInt(id))
    .single();
  if (!farm) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center">
      <Form action={updateFarm} className="flex flex-col gap-8 w-full">
        <Input type="hidden" name="farm_id" value={farm.id} />
        <div>
          <Label htmlFor="display_name">Farm Name *</Label>
          <Input
            required
            name="display_name"
            defaultValue={farm.display_name}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input name="address" defaultValue={farm.address ?? undefined} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            name="description"
            defaultValue={farm.description ?? undefined}
          />
        </div>
        <div className="flex flex-row gap-2">
          <Button type="submit">Update Farm Information</Button>
          <Link href={`/farm/${farm.id}`}>
            <Button variant="secondary">Cancel</Button>
          </Link>
        </div>
      </Form>
    </div>
  );
}
