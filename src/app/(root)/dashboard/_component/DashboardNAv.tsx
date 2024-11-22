"use client";
import React from "react";
import { usePathname } from "next/navigation";
import DarkModeSwitch from "./ToggleSwitch";
import { UserToggle } from "./UserToggle";

const DashboardNav: React.FC = () => {
  const pathName = usePathname();

  const navLinks = [
    { href: "/dashboard/my-strategies", label: "My Strategies" },
    { href: "/dashboard/explore", label: "Explore" },
    { href: "/dashboard/strategy-builder", label: "Strategy Builder" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="w-44" >
          {/* Logo placeholder */}
          <span className="text-xl font-bold text-gray-900 dark:text-white">Logo</span>
        </div>
        
        <div className="flex space-x-8 items-center font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`
                transition-colors duration-200
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

        <div className="flex items-center space-x-3 w-44">
          <DarkModeSwitch />
          <UserToggle />
        </div>
      </div>
    </div>
  );
};

export default DashboardNav;