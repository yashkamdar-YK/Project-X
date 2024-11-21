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

        // if (!accessToken) {
        //   router.push('/login');
        //   return;
        // }

        // Explicitly set the token as a string
        setToken(accessToken as string);
      } catch (error) {
        console.log("erron in check token", error);
        router.push("/login");
      }
    };

    checkToken();
  }, [router]);

  //   if (!token) {
  //     return <div>No Token Present</div>;
  //   }

  return (
    <div className="p-4 items-center flex text-center mt-40 justify-center">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome to your dashboard!</p>
        {/* <DashboardPage/> */}
      </div>
    </div>
  );
}
