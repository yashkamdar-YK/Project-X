"use client";

import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const accessToken = await getCookie("access_token");
        setToken(accessToken as string);
      } catch (error) {
        console.error("Error in check token", error);
        router.push("/login");
      }
    };

    checkToken();
  }, [router]);

  return (
    <div className="flex flex-col h-screen">
 Dashboard page
    </div>
  );
}
