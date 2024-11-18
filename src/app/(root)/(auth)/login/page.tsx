"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
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

interface LoginCredentials {
  email: string;
  password: string;
}

const login = async (email: string, password: string) => {
  try {
    const response = await axios.post("https://apiv.maticalgos.com/token/", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await login(credentials.email, credentials.password);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("otpToken", data.otpToken);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      router.push("/auth/verify-otp");
    },
    onError: (error) => {
      console.log("error", error);
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

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex items-center p-4">
        {theme === "dark" ? (
          <img 
            className="w-32 h-10 object-contain" 
            src="/logo_white.svg" 
            alt="White Logo" 
          />
        ) : (
          <img 
            className="w-32 h-10 object-contain" 
            src="/logo_black.svg" 
            alt="Black Logo" 
          />
        )}
      </div>
      <div className="flex flex-grow items-center justify-center overflow-hidden">
        <Card className="w-full max-w-sm">
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
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;