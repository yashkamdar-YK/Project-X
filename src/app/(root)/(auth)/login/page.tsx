"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { GoogleLoginButton } from "../_components/GoogleLoginButton";
import { ArrowLeft } from "lucide-react";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import SparkLogin from "../_components/SparkLogin";
import { getCookie } from "cookies-next/client";
import LoginCard from "../_components/LoginCard";

export default function LoginPage() {
  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      window.location.href = "/dashboard/my-strategies";
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <Link
        href="/"
        className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <NeonGradientCard className="bg-white dark:!bg-gray-800 w-full max-w-md shadow-lg">
       <LoginCard />
      </NeonGradientCard>
    </div>
  );
}
