import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}
// ${checked ? 'bg-blue-500' : 'bg-gray-200'}
const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        background: "linear-gradient(90deg, #4451ED 0%, #5521B5 100%)",
      }}
      className={`
        relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75
      `}
    >
      <span className="sr-only">Toggle switch</span>
      <span
        className={`
          ${checked ? "translate-x-9" : "translate-x-1"}
          pointer-events-none inline-block h-6 w-6 transform rounded-full
          bg-gray-900 shadow-lg ring-0 transition duration-200 ease-in-out
          my-1
        `}
      />
    </button>
  );
};

export default ToggleSwitch;
