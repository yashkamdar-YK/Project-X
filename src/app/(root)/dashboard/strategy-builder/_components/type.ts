export interface AccordionItemType {
    title: string;
    icon: React.ReactNode;
    items: string[];
  }
  
  export interface CustomNode {
    id: string;
    type?: string;
    position: {
      x: number;
      y: number;
    };
    data: {
      label: string;
      type?: string;
      category?: string;
    };
  }
  