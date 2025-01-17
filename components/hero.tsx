import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-fit flex flex-col gap-8 items-center">
      <h1 className="text-4xl lg:text-6xl font-bold">
        Let's Build the Future of Indonesia's Local Farms Together
      </h1>
      <p className="text-2xl">
        Bersama, Kita Membangun Masa Depan Pertanian Lokal Indonesia.
      </p>
      <Link href="/sign-up">
        <Button className="w-fit">Join taniku.id today!</Button>
      </Link>
      <Image src="/hero.jpg" width={300} height={100} alt="taniku.id logo" />
    </div>
  );
}
