"use client";
import React from 'react';
import StrategyNavbar from './_components/StrategyNavbar';
import DashboardSidebar from './_components/DashboardSidebar';
import StrategyCanvas from './_components/StrategyCanvas';


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