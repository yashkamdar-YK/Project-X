import SettingSheet from '@/app/(root)/dashboard/strategy-builder/_components/StrategyNavbar/SettingSheet/SettingSheet';
import NodeSheet from '@/app/(root)/dashboard/strategy-builder/_components/StrategyNavbar/NodeSheet';
// import StrategyCodeSheet from '@/app/(root)/dashboard/strategy-builder/_components/StrategyNavbar/StrategyCodeSheet';
import { useSheetStore } from '@/lib/store/SheetStore';
import React from 'react'

const CustomSheet = () => {
    const { isOpen, type } = useSheetStore();

    if (!isOpen) return null;
    return (
        <div className={`fixed right-0 top-0 bg-white dark:bg-gray-900 shadow-lg 
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"} z-50 w-fit h-full`}>

            {type === 'settings' ? <SettingSheet /> : null}
            {type === 'node' ? <NodeSheet /> : null}
            {/* {type === 'code' ? <StrategyCodeSheet/> : null} */}
        
        </div>
    )
}

export default CustomSheet