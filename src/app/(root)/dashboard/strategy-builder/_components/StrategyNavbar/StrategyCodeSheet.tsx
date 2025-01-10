import React, { useCallback, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/providers/theme-provider";
import { Highlight, themes } from "prism-react-renderer";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { strategyService } from "../../_actions";
import { Button } from "@/components/ui/button";
import { Copy, Check, FileCode2 } from "lucide-react";
import { useUnsavedChangesStore } from "@/lib/store/unsavedChangesStore";
import { toast } from "@/hooks/use-toast";
import { transformSettingsToPayload } from "./SettingSheet/transformSettingsToPayload";
import { transformDataPointsToPayload } from "../DashboardSidebar/DatapointDialog/transformDataPointsToPayload";
import { transformIndicatorsToPayload } from "../DashboardSidebar/Indicators/transformIndicatorsToPayload";
import { transformToActionPayload } from "./NodeSheet/ActionNodeSheet/transformToActionPayload";
import { transformConditionToPayload } from "./NodeSheet/ConditionNodeSheet/transformConditionToPayload";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import { useIndicatorStore } from "@/lib/store/IndicatorStore";
import { useConditionStore } from "@/lib/store/conditionStore";
import { useActionStore } from "@/lib/store/actionStore";
import { useNodeStore } from "@/lib/store/nodeStore";
import { NodeTypes } from "../../_utils/nodeTypes";
import { getSaveStrategyData } from "../../_utils/utils";

interface StrategyCodeSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const StrategyCodeSheet = ({ isOpen, onClose }: StrategyCodeSheetProps) => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const [activeTab, setActiveTab] = React.useState("python");
  const [copied, setCopied] = React.useState(false);
  const { isUnsaved, setUnsaved } = useUnsavedChangesStore();

  const updateStrategyMutation = useMutation({
    mutationFn: ({ strategyName, data }: any) =>
      strategyService.updateStrategy(strategyName, data),
    mutationKey: ["updateStrategy"],
    onSuccess: () => {
      toast({
        title: "Strategy saved successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save strategy",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const codeM = useMutation({
    mutationFn: strategyService.getStCode,
    mutationKey: [`strategyCode-${name}`],
  });
  const { dataPoints } = useDataPointsStore();
  const { selectedSymbol, selectedTimeFrame } = useDataPointStore();
  const { indicators } = useIndicatorStore();
  const { conditionBlocks } = useConditionStore();
  const { actionNodes } = useActionStore();
  const { nodes, edges } = useNodeStore();

  const getConditionNodes = useCallback(() => {
    return nodes?.filter((node) => node.type === NodeTypes.CONDITION);
  }, [nodes]);

  useEffect(() => {
    async function fetchCode() {
      if (name && isOpen) {
        if (isUnsaved) {
          setUnsaved(false);
          await updateStrategyMutation.mutateAsync({
            data: getSaveStrategyData(name),
            strategyName: name,
          });
        }
        codeM.mutate(name);
      }
    }
    fetchCode();
  }, [name, isOpen]);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleCopyCode = () => {
    if (codeM.data?.code) {
      navigator.clipboard.writeText(codeM.data.code);
      setCopied(true);
    }
  };

  const formatCode = (code: string) => {
    try {
      // Parse the code if it's a JSON string
      const parsedCode = typeof code === "string" ? JSON.parse(code) : code;
      return parsedCode.code || "No code available";
    } catch {
      return code || "No code available";
    }
  };

  if (codeM.isPending) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:max-w-2xl">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (codeM.isError || codeM?.data === undefined) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <FileCode2 className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
            <p className="text-gray-500 text-center">
              First create and save your strategy to view code
            </p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto"
      >
        <SheetHeader className="mb-4">
          <SheetTitle>Strategy Code</SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Code
                </>
              )}
            </Button>
          </div>

          <TabsContent value="python" className="mt-0">
            <div className="relative rounded-md overflow-hidden border dark:border-gray-800">
              <Highlight
                theme={theme === "dark" ? themes.dracula : themes.github}
                code={formatCode(codeM?.data?.code)}
                language="python"
              >
                {({
                  className,
                  style,
                  tokens,
                  getLineProps,
                  getTokenProps,
                }) => (
                  <pre
                    className={`${className} p-4 overflow-x-auto`}
                    style={style}
                  >
                    {tokens.map((line, i) => (
                      <div
                        key={i}
                        {...getLineProps({ line })}
                        className="table-row"
                      >
                        <span className="table-cell text-right pr-4 select-none opacity-50 text-sm">
                          {i + 1}
                        </span>
                        <span className="table-cell whitespace-pre">
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </span>
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default StrategyCodeSheet;