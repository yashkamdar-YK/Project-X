import { useNodeStore } from "@/lib/store/nodeStore";
import { useSheetStore } from "@/lib/store/SheetStore"; // Import the store

const NodeSheet = () => {
  const { closeSheet, type, selectedItem } = useSheetStore();
  const {nodes,edges} = useNodeStore();

  if (type !== 'node' || !selectedItem) return null;

  return (
    <div className={`sm:h-full h-screen w-screen sm:w-[380px]`}>
      <div className="h-full border-l-2 overflow-y-auto">
        <div className="p-6 text-gray-900 dark:text-gray-100">
          <button
            onClick={closeSheet}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            aria-label="Close node"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <div className="items-center flex font-medium justify-center text-2xl mt-6">
            <h1>Node Details</h1>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Node ID: {selectedItem.id}</p>
            <p className="text-sm text-gray-500">
              Position: ({selectedItem.position.x}, {selectedItem.position.y})
            </p>
            <p className="text-sm text-gray-500">Label: {selectedItem?.data?.label}</p>
          </div>

          <div className="">
            <span className="text-lg">DEBUG: </span>
            <pre className="text-xs" >{JSON.stringify({nodes,edges}, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeSheet;
