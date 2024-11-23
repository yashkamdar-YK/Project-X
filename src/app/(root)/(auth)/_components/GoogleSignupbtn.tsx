"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "../_components/icon";
import { Button } from "@/components/ui/button";

const GoogleSignupbtn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      router.push("/dashboard");
    }
  }, [session]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="text-red-500">
          {error === "Configuration"
            ? "There is a problem with the server configuration."
            : "An error occurred during sign in."}
        </div>
      )}

      <Button 
        variant="outline" 
        type="button" 
        disabled={isLoading}
        onClick={handleGoogleSignIn}
        className="w-full"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Sign up with Google
      </Button>
    </>
  );
};

export default GoogleSignupbtn;
