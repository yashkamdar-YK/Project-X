import { Button } from "@/components/ui/button";
import { BlockRelation } from "./types";

interface BlockRelationButtonProps {
  relation: BlockRelation;
  onClick: () => void;
}

export const BlockRelationButton: React.FC<BlockRelationButtonProps> = ({
  relation,
  onClick,
}) => {
  return (
    <Button
      onClick={onClick}
      variant="secondary"
      size="sm"
      className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10 bg-blue-500 hover:bg-blue-600 text-white min-w-[80px]"
    >
      {relation}
    </Button>
  );
};

