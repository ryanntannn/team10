import { OnboardingForm } from "@/components/onboarding-form";

export default async function Onboarding() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center">
      <h2 className="font-bold text-3xl">Welcome to Taniku.id</h2>
      <p className="text-muted-foreground">
        Are you joining us as a farmer or a customer?
      </p>
      <OnboardingForm />
    </div>
  );
}
