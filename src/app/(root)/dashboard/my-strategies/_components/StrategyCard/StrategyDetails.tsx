import { IndianRupee, Clock, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { TStrategy } from "../../types";

const StrategyDetails = ({ strategy }: { strategy: TStrategy }) => {
  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <IndianRupee className="h-4 w-4" />
        <span>Required Capital: ₹{strategy.capitalReq.toLocaleString()}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Clock className="h-4 w-4" />
        <span>Timeframe: {strategy.settings.timeframe}min</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Calendar className="h-4 w-4" />
        <span>Created {strategy.createdon}</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="outline">{strategy.settings.underlying}</Badge>
        <Badge variant="outline">{strategy.settings.productType}</Badge>
        <Badge variant="outline">{strategy.settings.strategy_type}</Badge>
      </div>
    </div>
  );
};

export default StrategyDetails;

