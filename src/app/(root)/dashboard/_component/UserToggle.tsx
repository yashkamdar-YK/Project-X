'use client';
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { useAuthStore } from "@/lib/store/authStore";


export function UserToggle() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    try {
      deleteCookie("token");
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Select onValueChange={(value) => {
      if (value === "logout") {
        handleLogout();
      }
    }}>
      <SelectTrigger className="border-2 text-black font-semibold dark:text-white border-gray-200 dark:border-gray-400 py-1 px-2 rounded-full w-auto min-w-28">
        <User size={16} />
        <span >{user?.name}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem 
            value="logout" 
            className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="flex items-center gap-2">
              <LogOut size={14} />
              <span>Logout</span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}