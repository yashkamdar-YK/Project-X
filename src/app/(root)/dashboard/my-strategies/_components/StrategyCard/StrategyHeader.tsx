import { Globe, Lock, MoreVertical } from 'lucide-react';
import { CardTitle } from "@/components/ui/card";
import { StatusBadge } from "../status-badge";
import { TStrategy } from "../../types";
import StrategyMenu from "./StrategyMenu";

const StrategyHeader = ({ strategy, onEditInfo, onDelete,isSettingsOpen,setIsSettingsOpen }: { 
  strategy: TStrategy; 
  onEditInfo: () => void;
  onDelete: (name: string) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="text-lg font-bold truncate">
        {strategy.strategyName}
      </CardTitle>
      <div className="flex items-center space-x-2">
        {strategy.visiblity === "public" ? (
          <Globe className="h-4 w-4 text-gray-500" />
        ) : (
          <Lock className="h-4 w-4 text-gray-500" />
        )}
        <StatusBadge
          status={strategy.status as any}
          showTooltip={strategy.status === "scheduled"}
        />
        <StrategyMenu strategy={strategy} onEditInfo={onEditInfo} isSettingsOpen={isSettingsOpen}
            setIsSettingsOpen={setIsSettingsOpen} onDelete={onDelete} isScheduled={strategy.status === "scheduled"} />
      </div>
    </div>
  );
};

export default StrategyHeader;
