// import React, { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { FiSearch } from "react-icons/fi";
// import { IoIosArrowDown } from "react-icons/io";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from "@/components/ui/accordion";

// const Sidebar = () => {
//   const [accordionItems, setAccordionItems] = useState([
//     { title: "Data Points" },
//     { title: "Indicators" },
//     { title: "Components" },
//     { title: "Actions" },
//   ]);

//   return (
//     <div className="w-64  border-r-2 border-black h-screen p-4">
//       {/* Search Box at the Top */}
//       <div className="mb-4">
//         <div className="relative">
//           <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
//           <Input
//             className="pl-10 pr-4 border-2 rounded-md w-full border-black"
//             type="text"
//             placeholder="Search..."
//           />
//         </div>
//       </div>

//       {/* Divider */}
//       <div className="border-b-2 border-black mb-4"></div>

//       {/* Accordion Section using Shadcn */}
//       <Accordion type="multiple" className="space-y-2">
//         {accordionItems.map((item, index) => (
//           <AccordionItem key={index} value={`item-${index}`}>
//             <div className="flex justify-between items-center">
//               <AccordionTrigger className="flex items-center">
//                 <IoIosArrowDown className="mr-2" />
//                 {item.title}
//               </AccordionTrigger>
//               {/* Add Button on the Right */}
//               <button className="text-xs bg-black text-white px-2 py-1 rounded-xl hover:bg-gray-800">
//                 + ADD
//               </button>
//             </div>
//             <AccordionContent>
//               <div className="mt-2 pl-6">
//                 <p className="text-sm">Accordion content goes here...</p>
//               </div>
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>
//     </div>
//   );
// };

// export default Sidebar;

// DashboardSidebar.tsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface AccordionItemType {
  title: string;
}

const Sidebar: React.FC = () => {
  const [accordionItems] = useState<AccordionItemType[]>([
    { title: "Data Points" },
    { title: "Indicators" },
    { title: "Components" },
    { title: "Actions" },
  ]);

  return (
    <div className="border-r-2 border-black dark:border-white  
                    bg-white dark:bg-dark-background 
                    text-black dark:text-dark-text ">
    <div className="w-64  dark:border-white border-black h-full overflow-auto p-4">
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute dark:text-white left-3 top-1/2 transform -translate-y-1/2 text-black" />
          <Input
            className="pl-10 pr-4 border-2 rounded-md w-full border-black dark:border-white
                     text-center bg-white dark:bg-dark-background 
                     text-black dark:text-dark-text"
            type="text"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="border-b-2 dark:border-white border-black mb-4"></div>

      <Accordion type="multiple" className="space-y-2">
        {accordionItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <div className="flex justify-between items-center">
              <AccordionTrigger className="flex items-center">
                <IoIosArrowDown className="mr-2" />
                {item.title}
              </AccordionTrigger>
              <button className="text-xs bg-black text-white px-2 py-1 rounded-xl hover:bg-gray-800">
                + ADD
              </button>
            </div>
            <AccordionContent>
              <div className="mt-2 pl-6">
                <p className="text-sm">Accordion content goes here...</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
    </div>
  );
};

export default Sidebar;
