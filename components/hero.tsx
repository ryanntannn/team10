import Image from "next/image";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className="w-fit flex flex-col gap-8 items-center">
      <h1 className="text-4xl lg:text-6xl font-bold">
        Manage your Agrifarm with AI
      </h1>
      <p className="text-2xl">
        We help agrifarms manage their sales, inventory, and more.
      </p>
      <Button className="w-fit">Join taniku.id today!</Button>
      <Image src="/hero.jpg" width={300} height={100} alt="taniku.id logo" />
    </div>
  );
}
