import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/themeToggle";
export default function Home() {
  return (
    <div className="flex justify-center">
      <Button>ROOT PAGE</Button>
      <ThemeToggle/>
    </div>
  );
}
