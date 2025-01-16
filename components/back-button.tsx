"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export type BackButtonProps = {};

export default function BackButton(props: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      className="text-muted-foreground text-xs"
      size="sm"
      onClick={() => window.history.back()}>
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back
    </Button>
  );
}
