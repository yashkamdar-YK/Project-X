import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutPanelTop,
  Search,
  SlidersHorizontal,
  IndianRupee,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useNodeStore } from "@/lib/store/nodeStore";
import { STRATEGY_TEMPLATES } from "../../constants/menu";
import { useActionStore } from "@/lib/store/actionStore";
import { useConditionStore } from "@/lib/store/conditionStore";
import { useQuery } from "@tanstack/react-query";
import { strategyService } from "../../_actions";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { clearStores } from "../../_utils/utils";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type TemplateKey = keyof typeof STRATEGY_TEMPLATES;

interface TemplateCardProps {
  name: string;
  description: string;
  onSelect: () => void;
  metadata?: {
    underlying?: string;
    capitalReq?: number;
    createdon?: string;
    strategy_type?: string;
    timeframe?: number;
  };
}

const TemplateCard = ({ name, description, onSelect, metadata }:TemplateCardProps) => (
  <div
    onClick={onSelect}
    className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-all duration-200 dark:bg-gray-900"
  >
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 break-words">
        {name}
      </h3>
      {metadata?.strategy_type && (
        <Badge variant="outline" className="w-fit">{metadata.strategy_type}</Badge>
      )}
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{description}</p>
    {metadata && (
      <div className="space-y-3">
        {metadata.underlying && (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{metadata.underlying}</Badge>
            {metadata.timeframe && (
              <Badge variant="secondary">{metadata.timeframe}min</Badge>
            )}
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-gray-500">
          <div className="flex items-center gap-1">
            <IndianRupee className="h-4 w-4" />
            <span className="text-sm">{metadata.capitalReq?.toLocaleString()}</span>
          </div>
          {metadata.createdon && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{formatDistanceToNow(new Date(metadata.createdon))} ago</span>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

const TemplateCardSkeleton = () => (
  <div className="p-4 border rounded-lg bg-white dark:bg-gray-900">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-5 w-20" />
    </div>
    <Skeleton className="h-4 w-full mb-3" />
    <Skeleton className="h-4 w-3/4 mb-3" />
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  </div>
);

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  templateName: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  templateName,
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Apply Template</DialogTitle>
        <DialogDescription>
          Are you sure you want to apply the <strong>{templateName}</strong> template? This will
          replace your current canvas.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button className="mt-2 md:mt-0" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Apply Template</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const TemplateSelector = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateKey | null>(null);
  const [selectedPublicStrategy, setSelectedPublicStrategy] = React.useState<string | null>(null);
  const { setNodes, setEdges } = useNodeStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedUnderlyings, setSelectedUnderlyings] = React.useState<string[]>([]);
  const [capitalRange, setCapitalRange] = React.useState([0, 1000000]);
  const [sortBy, setSortBy] = React.useState("newest");

  const { data: publicStrategies, isLoading, error  } = useQuery({
    queryFn: strategyService.getPublicStrategies,
    queryKey: ["publicStrategies"],
    enabled: dialogOpen,
  });

  const handleTemplateSelect = (templateKey: TemplateKey) => {
    setSelectedTemplate(templateKey);
    setSelectedPublicStrategy(null);
    setIsOpen(true);
  };

  const handlePublicStrategySelect = (strategyName: string) => {
    setSelectedPublicStrategy(strategyName);
    setSelectedTemplate(null);
    setIsOpen(true);
  };
const router  =useRouter()
  const handleConfirm = () => {
    clearStores();
    if (selectedTemplate) {
//build in
    } else if (selectedPublicStrategy && publicStrategies) {
      if(!selectedPublicStrategy){
        toast({
          title:"Something went wrong",
          variant:"destructive",
        })
      }
      router.push(`/dashboard/strategy-builder?templateId=${selectedPublicStrategy}`);
    }
    setIsOpen(false);
    setDialogOpen(false);
  };

  const getFilteredStrategies = () => {
    if (!publicStrategies) return [];

    let filtered = publicStrategies.filter((strategy) => {
      const matchesSearch = searchQuery
        ? strategy.strategyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          strategy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          strategy.settings.underlying.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesUnderlyings = selectedUnderlyings.length
        ? selectedUnderlyings.includes(strategy.settings.underlying)
        : true;

      const matchesCapital =
        strategy.capitalReq >= capitalRange[0] &&
        strategy.capitalReq <= capitalRange[1];

      return matchesSearch && matchesUnderlyings && matchesCapital;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdon).getTime() - new Date(a.createdon).getTime();
        case "oldest":
          return new Date(a.createdon).getTime() - new Date(b.createdon).getTime();
        case "capital-high":
          return b.capitalReq - a.capitalReq;
        case "capital-low":
          return a.capitalReq - b.capitalReq;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const uniqueUnderlyings = React.useMemo(() => {
    if (!publicStrategies) return [];
    return Array.from(
      new Set(publicStrategies.map((s) => s.settings.underlying))
    );
  }, [publicStrategies]);

  const maxCapital = React.useMemo(() => {
    if (!publicStrategies) return 1000000;
    return Math.max(...publicStrategies.map((s) => s.capitalReq));
  }, [publicStrategies]);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="dark:bg-gray-900">
            <LayoutPanelTop size={14} className="mr-2" />
            Templates
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Strategy Templates</DialogTitle>
            <DialogDescription>
              Choose a template or explore public strategies to get started
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="public" className="mt-4">
            <TabsList className="grid grid-cols-2 w-fit">
              <TabsTrigger value="public">Public Strategies</TabsTrigger>
              <TabsTrigger value="templates">Built-in Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="public" className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search strategies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-full"
                      disabled={isLoading || !!error}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select 
                      value={sortBy} 
                      onValueChange={setSortBy}
                      disabled={isLoading || !!error}
                    >
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="capital-high">Highest Capital</SelectItem>
                        <SelectItem value="capital-low">Lowest Capital</SelectItem>
                      </SelectContent>
                    </Select>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline"
                          disabled={isLoading || !!error}
                          className="w-full sm:w-auto"
                        >
                          <SlidersHorizontal className="h-4 w-4 mr-2" />
                          Filters
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[calc(100vw-2rem)] sm:w-80" align="end">
                        <div className="space-y-4">
                          {uniqueUnderlyings?.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Underlying</h4>
                              <div className="flex flex-wrap gap-2">
                                {uniqueUnderlyings.map((underlying) => (
                                  <Badge
                                    key={underlying}
                                    variant={selectedUnderlyings.includes(underlying) ? "default" : "outline"}
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setSelectedUnderlyings((prev) =>
                                        prev.includes(underlying)
                                          ? prev.filter((u) => u !== underlying)
                                          : [...prev, underlying]
                                      );
                                    }}
                                  >
                                    {underlying}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium mb-2">Capital Required</h4>
                            <Slider
                              min={0}
                              max={maxCapital}
                              step={10000}
                              value={capitalRange}
                              onValueChange={setCapitalRange}
                            />
                            <div className="flex justify-between mt-2 text-sm text-gray-500">
                              <span>₹{capitalRange[0].toLocaleString()}</span>
                              <span>₹{capitalRange[1].toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Failed to load public strategies. Please try again later.
                    </AlertDescription>
                  </Alert>
                ) : isLoading ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <TemplateCardSkeleton key={i} />
                    ))}
                  </div>
                ) : getFilteredStrategies().length === 0 ? (
                  <Alert>
                    <AlertTitle>No strategies found</AlertTitle>
                    <AlertDescription>
                      Try adjusting your search or filter criteria.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {getFilteredStrategies().map((strategy) => (
                      <TemplateCard
                        key={strategy.strategyID}
                        name={strategy.strategyName}
                        description={strategy.description || "No description provided"}
                        onSelect={() => handlePublicStrategySelect(strategy.strategyID as string)}
                        metadata={{
                          underlying: strategy.settings.underlying,
                          capitalReq: strategy.capitalReq,
                          createdon: strategy.createdon,
                          strategy_type: strategy.settings.strategy_type,
                          timeframe: strategy.settings.timeframe,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="templates">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-gray-500 dark:text-gray-400 text-center col-span-2 py-6">
                  Coming soon...
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        templateName={
          selectedTemplate
            ? STRATEGY_TEMPLATES[selectedTemplate].name
            : selectedPublicStrategy || ""
        }
      />
    </>
  );
};

export default TemplateSelector;