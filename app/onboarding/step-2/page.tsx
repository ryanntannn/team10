import { createFarm } from "@/app/farm/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Form from "next/form";

export default async function Onboarding() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center">
      <h2 className="font-bold text-3xl">Let's set up your first farm</h2>
      <span className="text-muted-foreground">
        Your customers will be able to see this information.{" "}
        <Badge variant="secondary">?</Badge>
      </span>
      <Form action={createFarm} className="flex flex-col gap-8 w-full">
        <div>
          <Label htmlFor="display_name">Farm Name *</Label>
          <Input required name="display_name" />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input name="address" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input name="description" />
        </div>
        <Button type="submit">Create Farm</Button>
      </Form>
    </div>
  );
}
