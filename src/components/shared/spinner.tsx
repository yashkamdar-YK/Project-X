import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Spinner = ({className,size='16'}:{
    className?: string;
    size?: string;
}) => (
    <Loader2 size={size} className={
        cn("animate-spin", className)
    } />
  );

export default Spinner;