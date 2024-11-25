import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex mt-24 justify-center">
      <Link href='/dashboard/strategy-builder' >
        <Button >strategy-builder</Button>
      </Link>
    </div>
  );
}
