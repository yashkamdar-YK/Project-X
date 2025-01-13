import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Pencil, Play, CircleStop, FlaskConical } from "lucide-react";
import { TStrategy } from "../../types";
import StrategyHeader from "./StrategyHeader";
import StrategyDetails from "./StrategyDetails";
import StrategyActions from "./StrategyActions";
import StrategyDescription from "./StrategyDescription";
import SettingSheet from "../SettingSheet";
import SaveStrategyDialog from "../../../strategy-builder/_components/StrategyNavbar/SaveStrategyDialog";
import BacktestDialog from "./BacktestDialog";

export const StrategyCard = ({
  strategy,
  onEdit,
  onDelete,
  deletingStrategies,
  onBacktest,
  backtestStrategies,
}: {
  strategy: TStrategy;
  onEdit: () => void;
  onDelete: (name: string) => void;
  deletingStrategies: string[] | null;
  onBacktest: (startDate: string, endDate: string) => void;
  backtestStrategies: string[] | null;
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);
  const [isBacktestOpen, setIsBacktestOpen] = useState(false);
  const isDeleting = deletingStrategies?.includes(strategy.strategyName);
  const isBacktesting = backtestStrategies?.includes(strategy.strategyName);

  const handleBacktest = (startDate: string, endDate: string) => {
    onBacktest(startDate, endDate);
    setIsBacktestOpen(false);
  };

  return (
    <>
      <SettingSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        strategy={strategy}
      />
      <SaveStrategyDialog
        isOpen={isEditInfoOpen}
        onClose={() => setIsEditInfoOpen(false)}
        name={strategy.strategyName}
        defaultName={strategy.strategyName}
        stratinfo={{
          description: strategy.description,
          visiblity: strategy.visiblity as any,
          capitalReq: strategy.capitalReq,
          createdon: strategy.createdon,
          status: strategy.status as any,
        }}
      />
      <BacktestDialog
        open={isBacktestOpen}
        onOpenChange={setIsBacktestOpen}
        onSubmit={handleBacktest}
        underlying={strategy.settings.underlying}
        isLoading={isBacktesting}
      />

      <Card className="w-full flex flex-col">
        <CardHeader>
          <StrategyHeader
            isSettingsOpen={isSettingsOpen}
            setIsSettingsOpen={setIsSettingsOpen}
            strategy={strategy}
            onEditInfo={() => setIsEditInfoOpen(true)}
            onDelete={onDelete}
          />
        </CardHeader>

        <CardContent className="flex-grow">
          <StrategyDescription description={strategy.description} />
          <StrategyDetails strategy={strategy} />
        </CardContent>

        <CardFooter className="flex justify-between space-x-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            disabled={isDeleting || isBacktesting}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBacktestOpen(true)}
              disabled={isDeleting || isBacktesting}
            >
              {isBacktesting ? (
                <>
                  <span className="animate-spin h-4 w-4 mr-1 border-2 border-b-transparent rounded-full" />
                  Backtesting...
                </>
              ) : (
                <>
                  <FlaskConical className="h-4 w-4 mr-1" />
                  Backtest
                </>
              )}
            </Button>
            <StrategyActions
              strategy={strategy}
              isDeleting={isDeleting || false}
            />
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default StrategyCard;
