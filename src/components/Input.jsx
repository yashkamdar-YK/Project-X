import React from "react";

const GradientInputShowcase = () => {
  return (
    <div className="flex flex-wrap items-center rounded-full justify-center p-8 space-y-6">
      {/* Rotated Gradient Border */}
      <div
        className="relative inline-block p-[0.15rem] rounded-full"
        style={{
          borderImageSource: "linear-gradient(90deg, #3A8CFF 0%, #9354D7 100%)",
          borderImageSlice: 1,
          borderWidth: "1.5px",
        }}
      >
        <input
          className="w-64 p-3 text-white bg-gray-800 rounded-full outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
          type="text"
          placeholder="Fill me with love..."
        />
      </div>
    </div>
  );
};

export default GradientInputShowcase;
