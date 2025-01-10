import { useState } from "react";
import { Button } from "@/components/ui/button";

const StrategyDescription = ({ description }: { description: string }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div>
      <p className={` text-sm ${showFullDescription ? "" : "line-clamp-2"}`}>
        {description || "No description provided"}
      </p>
      <div className="flex justify-end">
      {description && description.length > 126 && (
        <Button
          variant="link"
          size="sm"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? "Show Less" : "View More"}
        </Button>
      )}
      </div>
    </div>
  );
};

export default StrategyDescription;

