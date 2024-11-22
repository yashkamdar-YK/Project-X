"use client";
import React from 'react';
import StrategyNavbar from './_components/StrategyNavbar';
import DashboardSidebar from './_components/DashboardSidebar';

const StrategyCanvas: React.FC = () => {
  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-800 p-6 w-full">
      <div className="min-h-full w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
            --
        </p>
      </div>
    </div>
  );
};

export default function StrategyBuilder() {
  return (
    <div className="flex flex-col h-full">
      <StrategyNavbar className="flex-none" />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <StrategyCanvas />
      </div>
    </div>
  );
}