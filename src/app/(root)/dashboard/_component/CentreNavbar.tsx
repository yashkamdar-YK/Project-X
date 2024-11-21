// import React from "react";
// import { Input } from "@/components/ui/input";
// import { FiSearch } from "react-icons/fi";
// import { IoIosArrowDown } from "react-icons/io";
// import { IoSettingsSharp } from "react-icons/io5";
// import { FaCode } from "react-icons/fa6";
// import { Button } from "@/components/ui/button";
// import { FaChartArea } from "react-icons/fa";

// const CentreNavbar = () => {
//   return (
//     <div className="border-b-2 border-black flex justify-between items-center px-4 py-4 w-full">
//       <div className="flex gap-4 items-center ">
//         {/* Search */}
//         <div className="relative">
//           <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
//           <input
//             className="rounded-xl py-[2px] border-black border-2 text-center"
//             type="text"
//             id=""
//             placeholder="NIFTY"
//           />
//         </div>

//         {/* Time */}
//         <div className="relative">
//           <input
//             className="w-32 rounded-xl text-sm px-2 py-1 border-black border-2 text-left"
//             type="text"
//             id=""
//             placeholder="3m 5m 15m"
//           />
//           <IoIosArrowDown className="absolute left-24 ml-1 top-1/2 transform -translate-y-1/2 text-black" />
//         </div>
//         {/* Setting */}
//         <div className="items-center text-2xl">
//           <IoSettingsSharp />
//         </div>
//       </div>

//       {/* Button */}
//       <div className="flex gap-4 items-center">
//         <div className="items-center text-2xl">
//           <FaChartArea />
//         </div>
//         <button
//           className={`px-[20px] py-1  cursor-pointer border-2 border-black bg-opacity-90 font-bold shadow-[2px_2px_0_0_#FFFFFF,4px_4px_0_0_black] transition duration-200 ease-in-out hover:shadow-[3px_3px_white,6px_6px_0_0_black]hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_white,2px_2px_0_0_black] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 `}
//         >
//           <FaCode />
//           Code
//         </button>

//         <Button className="rounded-none px-8 ">Save</Button>
//       </div>
//     </div>
//   );
// };

// export default CentreNavbar;


import React from "react";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { FaCode } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { FaChartArea } from "react-icons/fa";

interface CentreNavbarProps {
  className?: string;
}

const CentreNavbar: React.FC<CentreNavbarProps> = ({ className = "" }) => {
  return (
    <div className="border-b-2 border-black dark:border-white  
                    bg-white dark:bg-dark-background 
                    text-black dark:text-dark-text 
                    flex justify-between items-center px-4 py-4">

    <div className={` w-full justify-between flex items-center  ${className}`}>
      <div className="flex gap-4 items-center">
        <div className="relative">
          <FiSearch className="absolute dark:text-white left-3 top-1/2 transform -translate-y-1/2 text-black" />
          <input
            className="rounded-xl py-[2px] border-2 border-black dark:border-white 
            text-center bg-white dark:bg-dark-background 
            text-black dark:text-dark-text"
            type="text"
            placeholder="NIFTY"
          />
        </div>

        <div className="relative">
          <input
            className="w-32  rounded-xl text-sm px-2 py-1 border-black border-2 text-left dark:border-white 
             bg-white dark:bg-dark-background 
            text-black dark:text-dark-text"
            type="text"
            placeholder="3m 5m 15m"
          />
          <IoIosArrowDown className="absolute dark:text-white left-24 ml-1 top-1/2 transform -translate-y-1/2 text-black" />
        </div>
        
        <div className="items-center text-2xl">
          <IoSettingsSharp />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="items-center text-2xl">
          <FaChartArea />
        </div>
        <button
          className="px-[20px] py-1 dark:border-white cursor-pointer border-2 border-black bg-opacity-90 font-bold shadow-[2px_2px_0_0_#FFFFFF,4px_4px_0_0_black] transition duration-200 ease-in-out hover:shadow-[3px_3px_white,6px_6px_0_0_black]hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_white,2px_2px_0_0_black] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2"
        >
          <FaCode />
          Code
        </button>

        <Button className="rounded-none px-8">Save</Button>
      </div>
    </div>
    </div>
  );
};

export default CentreNavbar;