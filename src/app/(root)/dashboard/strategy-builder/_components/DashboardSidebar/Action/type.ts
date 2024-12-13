export interface Action {
    id?: string;
    type: 'squareoff_all' | 'stop_WaitTrade_triggers' | 'custom';
    name?: string;
    actions: Action[];
  }
  
  export interface ActionNode {
    id: string;
    name: string;
    actions: Action[];
  }
  
  export interface ActionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingActionNode?: ActionNode;
  }