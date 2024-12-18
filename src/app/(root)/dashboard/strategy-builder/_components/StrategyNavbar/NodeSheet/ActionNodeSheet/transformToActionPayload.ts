import { useActionStore } from "@/lib/store/actionStore";

// actionTransform.ts
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
    const actions: Array<{
      func: string;
      params?: any;
    }> = [];

    // Transform positions to addLeg actions
    node.positions.forEach((position) => {
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
          targetValue: settings.targetValue,
          targetOn: settings.targetOn,
        }),
        ...(settings.isSL && {
          SLvalue: settings.SLvalue,
          SLon: settings.SLon,
        }),
        ...(settings.isTrailSL && {
          trailSL_X: settings.trailSL_X,
          trailSL_Y: settings.trailSL_Y,
          trailSLon: settings.trailSLon,
        }),
        ...(settings.isWT && {
          wtVal: settings.wtVal,
          wtOn: settings.wtOn,
        }),
        ...(settings.isReEntryTg && {
          reEntryTgVal: settings.reEntryTgVal,
          reEntryTgOn: settings.reEntryTgOn,
          reEntryTgMaxNo: settings.reEntryTgMaxNo,
        }),
        ...(settings.isReEntrySL && {
          reEntrySLVal: settings.reEntrySLVal,
          reEntrySLOn: settings.reEntrySLOn,
          reEntrySLMaxNo: settings.reEntrySLMaxNo,
        }),
      };

      actions.push({
        func: 'addLeg',
        params: cleanParams(params),
      });
    });

    // Add other actions (squareoff_all, stop_WaitTrade_triggers)
    node.actions.forEach((action) => {
      actions.push({ func: action.func });
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