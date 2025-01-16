"use client";

import { Link } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { useState } from "react";

export function ConfirmButton({ backHref }: { backHref?: string }) {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <>
      <div className="flex flex-row gap-2">
        <input
          checked={confirmed}
          onChange={(e) => {
            setConfirmed(!!e.target.checked);
          }}
          type="checkbox"
          name="confirmed"
        />
        <Label>I have verified my order details</Label>
      </div>
      <div className="flex flex-row gap-2">
        <Button disabled={!confirmed} type="submit">
          Confirm order
        </Button>
        {backHref && (
          <Link href={backHref}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        )}
      </div>
    </>
  );
}
