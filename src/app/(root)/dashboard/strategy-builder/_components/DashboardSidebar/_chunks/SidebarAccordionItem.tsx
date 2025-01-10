import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ChevronDown, Plus } from 'lucide-react';

interface SidebarAccordionItemProps {
  index: number;
  item: any;
  renderContent: () => React.ReactNode;
}

export const SidebarAccordionItem: React.FC<SidebarAccordionItemProps> = ({ index, item, renderContent }) => (
  <AccordionItem value={`item-${index}`}>
    <AccordionTrigger className="flex mb-2 items-center justify-between py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-md transition-all duration-200 group">
      <div className="flex items-center">
        {<item.icon size={16} />}
        <span className="ml-2">{item.title}</span>
      </div>
      <div className="flex items-center">
        <button
          onClick={item.onClick}
          className="text-xs bg-blue-500 dark:bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 mr-2"
        >
          <Plus className="w-3 h-3" />
        </button>
        <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 group-data-[state=open]:rotate-180 transition-transform duration-200" />
      </div>
    </AccordionTrigger>
    <AccordionContent>
      <div className="pl-4 pr-3 py-2 text-sm text-gray-600 dark:text-gray-300  shadow-sm transition-all duration-200">
        <div className="space-y-1">
          {renderContent()}
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
);
