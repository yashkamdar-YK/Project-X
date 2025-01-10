import { useActionStore } from "@/lib/store/actionStore";
import { NodeItem, Action } from "@/lib/store/actionStore";
import { Position} from "./types";
interface ActionNodePayload {
  [nodeId: string]: {
    description: string;
    act: Array<{
      func: string;
      params?: {
        transactionType?: string;
        segment?: string;
        qty?: number;
        expType?: string;
        expNo?: number;
        strikeBy?: string;
        strikeVal?: number;
        legID?: number;
        optionType?: string;
        targetValue?: number;
        targetOn?: string;
        SLvalue?: number;
        SLon?: string;
        trailSL_X?: number;
        trailSL_Y?: number;
        trailSLon?: string;
        wtVal?: number;
        wtOn?: string;
        reEntryTgVal?: number;
        reEntryTgOn?: string;
        reEntryTgMaxNo?: number;
        reEntrySLVal?: number;
        reEntrySLOn?: string;
        reEntrySLMaxNo?: number;
      };
    }>;
  };
}

export const transformToActionPayload = (
  actionNodes: ReturnType<typeof useActionStore.getState>['actionNodes']
): ActionNodePayload => {
  const payload: ActionNodePayload = {};

  Object.entries(actionNodes).forEach(([nodeId, node]) => {
    // Sort items by their order property to maintain sequence
    const sortedItems = [...node.items].sort((a, b) => a.order - b.order);

    const actions = sortedItems.map((item) => {
      if (item.type === 'position') {
        const position = item.data as Position;
        const { settings } = position;
        
        const baseParams = {
          transactionType: settings.transactionType,
          segment: settings.segment,
          qty: settings.qty,
          expType: settings.expType,
          expNo: settings.expNo,
          strikeBy: 'moneyness',
          strikeVal: settings.strikeVal,
          legID: settings.legID,
        };

        const params = {
          ...baseParams,
          ...(settings.segment === 'OPT' && { optionType: settings.optionType }),
          ...(settings.isTarget && {
            isTarget: true,
            targetValue: settings.targetValue,
            targetOn: settings.targetOn === "₹" ? "val": settings.targetOn,
          }),
          ...(settings.isSL && {
            isSL: true,
            SLvalue: settings.SLvalue,
            SLon: settings.SLon === "₹" ? "val": settings.SLon,
          }),
          ...(settings.isTrailSL && {
            isTrailSL: true,
            trailSL_X: settings.trailSL_X,
            trailSL_Y: settings.trailSL_Y,
            trailSLon: settings.trailSLon === "₹" ? "val": settings.trailSLon,
          }),
          ...(settings.isWT && {
            isWT: true,
            wtVal: settings.wtVal,
            wtOn: settings.wtOn,
          }),
          ...(settings.isReEntryTg && {
            isReEntryTg: true,
            reEntryTgVal: settings.reEntryTgVal,
            reEntryTgOn: settings.reEntryTgOn,
            reEntryTgMaxNo: settings.reEntryTgMaxNo,
          }),
          ...(settings.isReEntrySL && {
            isReEntrySL: true,
            reEntrySLVal: settings.reEntrySLVal,
            reEntrySLOn: settings.reEntrySLOn,
            reEntrySLMaxNo: settings.reEntrySLMaxNo,
          }),
        };

        return {
          func: 'addLeg',
          params: cleanParams(params),
        };
      } else {
        // Handle action items
        const action = item.data as Action;
        return { func: action.func };
      }
    });

    payload[nodeId] = {
      description: node.nodeName,
      act: actions,
    };
  });

  return payload;
};

// Helper function to remove undefined and false values
const cleanParams = (params: any) => {
  const cleaned: any = {};
  
  Object.entries(params).forEach(([key, value]) => {
    // Keep 0 values but remove undefined, null, and false
    if (value !== undefined && value !== null && value !== false) {
      cleaned[key] = value;
    }
  });
  
  return cleaned;
};

// Helper function to validate and transform a single action node
export const validateActionNode = (
  nodeId: string,
  node: ReturnType<typeof useActionStore.getState>['actionNodes'][string]
): ActionNodePayload => {
  return transformToActionPayload({ [nodeId]: node });
};