"use client"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import DarkModeSwitch from "./DarkModeSwitch"
import { UserToggle } from "./UserToggle"

const DashboardNav: React.FC = () => {
  const pathName = usePathname()

  const navLinks = [
    { href: "/dashboard/my-strategies", label: "My Strategies" },
    { href: "/dashboard/explore", label: "Explore" },
    { href: "/dashboard/strategy-builder", label: "Strategy Builder" },
  ]

  const NavLinks = () => (
    <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 items-start md:items-center font-medium">
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`
            transition-all duration-200
            hover:text-blue-600 dark:hover:text-blue-400
            font-semibold
            ${pathName === link.href 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-gray-700 dark:text-gray-300"}
          `}
        >
          {link.label}
        </a>
      ))}
    </div>
  )

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <div className="relative h-9 w-28">
            {/* <span className="text-xl font-bold text-gray-900 dark:text-white">Logo</span> */}
            <img
              src="/logo_black.png"
              alt="Black Logo"
              className="dark:hidden block"
            />
            <img
              src="/logo_white.png"
              alt="White Logo"
              className="dark:block hidden"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block pl-10">
            <NavLinks />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <DarkModeSwitch />
          <UserToggle />
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[385px]">
                <div className="py-6">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  )
}


export default DashboardNav;