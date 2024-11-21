"use client";
import React, { useState, useEffect } from "react";
import { IoSunny } from "react-icons/io5";
import { WiMoonAltFull } from "react-icons/wi";
import { RiMoonClearFill } from "react-icons/ri";
import {  UserToggle } from "./UserToggle";

// import LogoLight from "@/public/logo_white.png"; // Dark mode logo (white)
// import LogoDark from "@/public/logo_black.png"; // Light mode logo (black)
import Image from "next/image";
import { usePathname } from "next/navigation";
import DarkModeSwitch from "./ToggleSwitch";


const DashboardNav: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const pathName = usePathname();

  return (
    <div
      className="bg-white border-black dark:bg-dark-background text-black dark:text-dark-text 
    border-b-2 dark:border-white "
    >
      <div className="px-4 py-3 flex justify-between items-center">
        <div>
          {/* <Image src={isDarkMode ? LogoLight : LogoDark} alt="Logo" height={32} width={32} /> */}
        </div>
        <div className="flex space-x-8 items-center font-medium">
          <a href="/dashboard/my-strategies" className={`hover:text-blue-800 font-semibold ${
            pathName === "/dashboard/my-strategies" ? "text-blue-800" : ""
          }`}>
            My Strategies
          </a>
          <a href="/dashboard/explore" className={`hover:text-blue-800 font-semibold ${
            pathName === "/dashboard/explore" ? "text-blue-800" : ""
          }`}>
            Explore
          </a>
          <a href="/dashboard/strategy-builder" className={`hover:text-blue-800 font-semibold ${
            pathName === "/dashboard/strategy-builder" ? "text-blue-800" : ""
          }`}>
            Strategy Builder
          </a>
        </div>

        <div className="flex items-center space-x-3">
         <DarkModeSwitch />
         <UserToggle />
        </div>
      </div>
    </div>
  );
};

export default DashboardNav;
