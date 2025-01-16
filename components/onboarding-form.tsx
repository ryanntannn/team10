"use client";

import { Tractor, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Database } from "@/utils/supabase/database.types";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const supabase = createClient();
type UserType = Database["public"]["Enums"]["user_type"];

const useUpdateUserType = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitAsync = async (userType: UserType) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    const { data, error } = await supabase
      .from("user")
      .upsert({ id: user.id, user_type: userType });

    if (!error) {
      // Redirect to the next page
      router.push("/");
    } else {
      alert("An error occurred. Please try again.");
    }
  };

  return {
    isSubmitting,
    submit: (userType: UserType) => {
      setIsSubmitting(true);
      submitAsync(userType).finally(() => setIsSubmitting(false));
    },
  };
};

export function OnboardingForm() {
  const { submit, isSubmitting } = useUpdateUserType();

  const [userType, setUserType] = useState<
    Database["public"]["Enums"]["user_type"] | null
  >(null);
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <Button
          variant={userType === "farmer" ? "default" : "outline"}
          onClick={() => setUserType("farmer")}
          className="text-lg p-8">
          <Tractor className="mr-2 h-6 w-6" />
          Farmer
          <span className="text-xs ml-2"> (I want to sell goods)</span>
        </Button>
        <Button
          variant={userType === "customer" ? "default" : "outline"}
          onClick={() => setUserType("customer")}
          className="text-lg p-8">
          <ShoppingCart className="mr-2 h-6 w-6" />
          Customer
          <span className="text-xs ml-2"> (I want to buy goods)</span>
        </Button>
      </div>
      <Button
        onClick={() => {
          if (!userType) return;
          submit(userType);
        }}
        size={"lg"}
        disabled={userType === null || isSubmitting}
        className="w-fit">
        {isSubmitting || userType === null
          ? "Select an option"
          : userType === "farmer"
            ? "Join as farmer"
            : "Join as customer"}
      </Button>
    </>
  );
}
