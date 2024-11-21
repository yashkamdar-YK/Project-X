"use client";

import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CentreNavbar from "./_component/CentreNavbar";
import DashboardSidebar from "./_component/DashboardSidebar";
import DashboardCanvas from "./_component/DashboardCanvas";
import DashboardNav from "./_component/DashboardNAv";

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
      <DashboardNav />
      <CentreNavbar />

      {/* Main Content - Flex Layout */}
      <div className="flex flex-1  overflow-hidden">
        <DashboardSidebar />
        <DashboardCanvas />
      </div>
    </div>
  );
}
