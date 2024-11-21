// "use client";
// import React, { useState } from "react";
// import { IoSunny } from "react-icons/io5";
// import { WiMoonAltFull } from "react-icons/wi";
// import { RiMoonClearFill } from "react-icons/ri";

"use client";
import React, { useState } from "react";
import { IoSunny } from "react-icons/io5";
import { WiMoonAltFull } from "react-icons/wi";
import { RiMoonClearFill } from "react-icons/ri";

const DashboardNav = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
  };

  return (
    <div
      className={`m-4 border-2  ${
        isDarkMode
          ? "bg-black text-white border-white "
          : "bg-white border-black text-black"
      }`}
    >
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="">
          <h1>Logo</h1>
        </div>
        <div className="flex space-x-8 items-center font-medium">
          {" "}
          <a href="#" className="hover:text-gray-400">
            My Strategies{" "}
          </a>{" "}
          <a href="#" className="hover:text-gray-400">
            Explore{" "}
          </a>{" "}
          <a href="#" className="hover:text-gray-400">
            Strategy Builder{" "}
          </a>{" "}
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
            <WiMoonAltFull className="text-3xl" />
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
