// import React from "react";
// import { Node } from "@xyflow/react";
// import { NodeTypes } from "../../../_utils/nodeTypes";
// import { useSheetStore } from "@/lib/store/SheetStore";
// import { X, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";

// interface ConditionNodeSheetProps {
//   node: Node & {
//     type: typeof NodeTypes.CONDITION;
//     data: {
//       label: string;
//       settings?: {
//         indicator?: string;
//         period?: number;
//         threshold?: number;
//         comparison?: string;
//       };
//     };
//   };
// }

// interface ConditionBlock {
//   id: number;
//   addBadge: "Add" | "AND" | "OR";
// }

// const ConditionNodeSheet: React.FC<ConditionNodeSheetProps> = ({ node }) => {
//   const { closeSheet } = useSheetStore();
//   const [maxEntries, setMaxEntries] = React.useState("10");
//   const [waitTrigger, setWaitTrigger] = React.useState(false);
//   const [positionOpen, setPositionOpen] = React.useState(false);
//   const [addBadge, setAddBadge] = React.useState<"AND" | "OR">("AND");
//   const [conditionBlocks, setConditionBlocks] = React.useState<
//     ConditionBlock[]
//   >([{ id: 0, addBadge: "Add" }]);

//   const addConditionBlock = () => {
//     setConditionBlocks((prev) => [
//       ...prev,
//       { id: prev.length, addBadge: "Add" },
//     ]);
//   };

//   const buttonClass =
//     "h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-blue-500/20";

//   return (
//     <div className=" dark:text-gray-300 text-gray-500 ">
//       <div className="flex justify-end items-center mb-3">
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={closeSheet}
//           className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
//         >
//           <X className="w-5 h-5" />
//         </Button>
//       </div>
//       <h2 className="text-2xl text-center font-semibold">
//         Condition Node Details
//       </h2>
//       <Card className="dark:bg-gray-900 border-l mt-4 border-gray-200 dark:border-gray-800">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"></CardHeader>
//         <CardContent className="space-y-6">
//           {/* Tabs */}
//           <Tabs defaultValue="entry" className="w-full">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="entry">Entry</TabsTrigger>
//               <TabsTrigger value="exit">Exit</TabsTrigger>
//               <TabsTrigger value="adjustment">Adjustment</TabsTrigger>
//             </TabsList>
//           </Tabs>

//           {/* Settings */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <Label htmlFor="max-entries">
//                 Max Entries using this condition:
//               </Label>
//               <Input
//                 id="max-entries"
//                 value={maxEntries}
//                 onChange={(e) => setMaxEntries(e.target.value)}
//                 className="w-20 text-right"
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <Label htmlFor="wait-trigger">
//                 Check if any Wait Trade Trigger is open:
//               </Label>
//               <Switch
//                 id="wait-trigger"
//                 checked={waitTrigger}
//                 className="data-[state=checked]:bg-blue-500"
//                 onCheckedChange={setWaitTrigger}
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <Label htmlFor="position-open">
//                 Check if any Position is Open:
//               </Label>
//               <div className="h-12">
//                 <Switch
//                   id="position-open"
//                   checked={positionOpen}
//                   className="data-[state=checked]:bg-blue-500"
//                   onCheckedChange={setPositionOpen}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Condition Builder */}
//           <div className="space-y-4">
//             <h3 className="font-semibold">Condition Builder</h3>
//             {conditionBlocks.map((block, index) => (
//               <div
//                 key={block.id}
//                 className="relative border rounded-lg px-4 py-8 mb-4"
//               >
//                 {/* Add Badge Section*/}
//                 <div>
//                   <Badge
//                     variant="secondary"
//                     className="absolute -top-3 left-2 bg-blue-500"
//                   >
//                     IF
//                   </Badge>
//                   <div className="flex flex-wrap gap-2 items-center">
//                     <Badge variant="outline">spotNF</Badge>
//                   </div>

//                   {/* AND OR BUtton */}
//                   <Button
//                     size="sm"
//                     variant="secondary"
//                     className="absolute -bottom-3 right-4 top-7 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-blue-500/20"
//                     onClick={() =>
//                       setAddBadge((prev) => (prev === "AND" ? "OR" : "AND"))
//                     }
//                   >
//                     {addBadge}
//                   </Button>
//                 </div>

//                 {index === conditionBlocks.length - 1 && (
//                   <Button
//                     size="sm"
//                     variant="secondary"
//                     className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-blue-500/20"
//                     onClick={addConditionBlock}
//                   >
//                     <Plus className="h-4 w-4 mr-1" />
//                     Add Block
//                   </Button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ConditionNodeSheet;

"use client";

import React from "react";
import { Node } from "@xyflow/react";
import { NodeTypes } from "../../../_utils/nodeTypes";
import { useSheetStore } from "@/lib/store/SheetStore";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ConditionNodeSheetProps {
  node: Node & {
    type: typeof NodeTypes.CONDITION;
    data: {
      label: string;
      settings?: {
        indicator?: string;
        period?: number;
        threshold?: number;
        comparison?: string;
      };
    };
  };
}

interface SubSection {
  id: number;
  addBadge: "AND" | "OR";
}

interface ConditionBlock {
  id: number;
  subSections: SubSection[];
}

const ConditionNodeSheet: React.FC<ConditionNodeSheetProps> = ({ node }) => {
  const { closeSheet } = useSheetStore();
  const [maxEntries, setMaxEntries] = React.useState("10");
  const [waitTrigger, setWaitTrigger] = React.useState(false);
  const [positionOpen, setPositionOpen] = React.useState(false);
  const [conditionBlocks, setConditionBlocks] = React.useState<
    ConditionBlock[]
  >([{ id: 0, subSections: [{ id: 0, addBadge: "AND" }] }]);

  const addConditionBlock = () => {
    setConditionBlocks((prev) => [
      ...prev,
      { id: prev.length, subSections: [{ id: 0, addBadge: "AND" }] },
    ]);
  };

  const addSubSection = (blockId: number) => {
    setConditionBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? {
              ...block,
              subSections: [
                ...block.subSections,
                { id: block.subSections.length, addBadge: "AND" },
              ],
            }
          : block
      )
    );
  };

  const toggleAddBadge = (blockId: number, subSectionId: number) => {
    setConditionBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? {
              ...block,
              subSections: block.subSections.map((subSection) =>
                subSection.id === subSectionId
                  ? {
                      ...subSection,
                      addBadge: subSection.addBadge === "AND" ? "OR" : "AND",
                    }
                  : subSection
              ),
            }
          : block
      )
    );
  };

  const buttonClass =
    "h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-blue-500/20";

  return (
    <div className="dark:text-gray-300 text-gray-500">
      <div className="flex justify-end items-center mb-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={closeSheet}
          className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      <h2 className="text-2xl text-center font-semibold">
        Condition Node Details
      </h2>
      <Card className="dark:bg-gray-900 border-l mt-4 border-gray-200 dark:border-gray-800">
        <CardContent className="space-y-8 mt-6">
          <Tabs defaultValue="entry" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="entry">Entry</TabsTrigger>
              <TabsTrigger value="exit">Exit</TabsTrigger>
              <TabsTrigger value="adjustment">Adjustment</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-entries">
                Max Entries using this condition:
              </Label>
              <Input
                id="max-entries"
                value={maxEntries}
                onChange={(e) => setMaxEntries(e.target.value)}
                className="w-20 text-right"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="wait-trigger">
                Check if any Wait Trade Trigger is open:
              </Label>
              <Switch
                id="wait-trigger"
                checked={waitTrigger}
                className="data-[state=checked]:bg-blue-500"
                onCheckedChange={setWaitTrigger}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="position-open">
                Check if any Position is Open:
              </Label>
              <div className="h-12">
                <Switch
                  id="position-open"
                  checked={positionOpen}
                  className="data-[state=checked]:bg-blue-500"
                  onCheckedChange={setPositionOpen}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Condition Builder</h3>
            {conditionBlocks.map((block, blockIndex) => (
              <div
                key={block.id}
                className="relative border rounded-lg px-4 py-8 mb-4"
              >
                <Badge
                  variant="secondary"
                  className="absolute -top-3 left-2 bg-blue-500"
                >
                  IF
                </Badge>
                {block.subSections.map((subSection, subIndex) => (
                  <div
                    key={subSection.id}
                    className="mb-4 last:mb-0 border-b pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">spotNF</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className={buttonClass}
                        onClick={() => toggleAddBadge(block.id, subSection.id)}
                      >
                        {subSection.addBadge}
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex">
                  <Button
                    size="sm"
                    variant="secondary"
                    className={`${buttonClass} px-2 ml-[282px]`}
                    onClick={() => addSubSection(block.id)}
                  >
                    <Plus className="h-4 w-4" />
                    ADD
                  </Button>
                </div>

                {blockIndex === conditionBlocks.length - 1 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-blue-500/20"
                    onClick={addConditionBlock}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Block
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConditionNodeSheet;
