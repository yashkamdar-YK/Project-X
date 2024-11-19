"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast, useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { login } from "./_actions";
import Spinner from "@/components/shared/spinner";

interface LoginCredentials {
  email: string;
  password: string;
}

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await login(credentials.email, credentials.password);
      console.log(response);
      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard"); // Redirect to dashboard or any other page
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description:
          error instanceof Error
            ? (error as any).response?.data?.message ?? "Login failed"
            : "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div>
      <div className="w-32 h-8 pl-8 py-4">
          <img src="/logo_black.png" alt="Black Logo" className="dark:hidden block" />
          <img src="/logo_white.png" alt="White Logo" className="dark:block hidden" />
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <Card className="mx-auto w-full max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 ">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? <Spinner size="16" /> : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;