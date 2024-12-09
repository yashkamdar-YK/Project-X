import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface InitialOptionsProps{
  onSelect: (option: any) => void;
  filteredOptions: any[];
}

export const InitialOptions: React.FC<InitialOptionsProps> = ({ onSelect, filteredOptions }) => (
  <div className="grid gap-4">
    {filteredOptions.map((item) => {
      const Icon = item.icon;
      return (
        <Card key={item.option} className={`transition-all ${item.comingSoon ? 'opacity-50' : 'hover:bg-accent cursor-pointer'}`}>
          <CardContent className="p-4 flex justify-between items-center" onClick={() => !item.comingSoon && onSelect(item.option as any)}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">{item.title}</span>
            </div>
            {item.comingSoon ? (
              <Badge variant="secondary">Coming Soon</Badge>
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </CardContent>
        </Card>
      );
    })}
  </div>
);