export const NodeTypes = {
  CONDITION: "CONDITION",
  ACTION: "ACTION",
  START: "START"
}


export const NODE_CONFIG = {
  [NodeTypes.START]: {
    background: '#3B82F6',
    color: 'white',
    border: 'none',
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  [NodeTypes.ACTION]: {
    background: 'white',
    border: '1px solid #E5E7EB',
    padding: '16px',
    borderRadius: '8px',
    minWidth: 200,
  },
  [NodeTypes.CONDITION]: {
    background: 'white',
    border: '1px solid #E5E7EB',
    padding: '16px',
    borderRadius: '8px',
    minWidth: 200,
  },
};