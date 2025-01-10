"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const SparkLogin = () => {
  const { toast } = useToast();
  const router = useRouter();

  const handleSparkLogin = async () => {
    router.push("https://spark.maticalgos.com/login?redirect=buildalgo");
  };

  return (
    <Button
      onClick={handleSparkLogin}
      className="w-full bg-white hover:bg-gray-50 text-gray-900 dark:text-gray-900 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-all duration-300 ease-in-out transform hover:scale-105"
    >
      <>
        <div className="w-5 h-5 mr-2">
          <Image
            src="/logo_sq.png"
            alt="Spark Logo"
            width={20}
            height={20}
            className="object-contain"
          />
        </div>
        Login with Spark
      </>
    </Button>
  );
};

export default SparkLogin;
