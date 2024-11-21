"use client";
import React, { useState, useEffect } from "react";
import { IoSunny } from "react-icons/io5";
import { WiMoonAltFull } from "react-icons/wi";
import { RiMoonClearFill } from "react-icons/ri";
import { Avatar } from "./Avater";

import LogoLight from "/logo_white.png"; // Dark mode logo (white)
import LogoDark from "/logo_black.png"; // Light mode logo (black)

interface DashboardNavProps {
  className?: string;
}

const DashboardNav: React.FC<DashboardNavProps> = ({ className = "" }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem("theme");
    console.log(savedTheme);
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDarkMode)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div
      className="bg-white border-black dark:bg-dark-background text-black dark:text-dark-text 
    border-b-2 dark:border-white "
    >
      <div className="px-4 py-3 flex justify-between items-center">
        <div>
          <img
            src={isDarkMode ? LogoLight : LogoDark}
            alt="Logo"
            className="h-8" // Adjust height as needed
          />
        </div>
        <div className="flex space-x-8 items-center font-medium">
          <a href="#" className="hover:text-blue-800">
            My Strategies
          </a>
          <a href="#" className="hover:text-blue-800">
            Explore
          </a>
          <a href="#" className="hover:text-blue-800">
            Strategy Builder
          </a>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleDarkMode}
            className={`focus:outline-none ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {isDarkMode ? (
              <RiMoonClearFill className="text-2xl" />
            ) : (
              <IoSunny className="text-2xl" />
            )}
          </button>
          <button>
            <Avatar />
          </button>
          <span
            className={`${
              isDarkMode ? "hover:text-gray-400" : "hover:text-gray-600"
            }`}
          >
            Ankit
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardNav;
