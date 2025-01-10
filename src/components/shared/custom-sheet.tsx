import React from 'react'
import SettingSheet from '@/app/(root)/dashboard/strategy-builder/_components/StrategyNavbar/SettingSheet/SettingSheet'
import NodeSheet from '@/app/(root)/dashboard/strategy-builder/_components/StrategyNavbar/NodeSheet'
import { useSheetStore } from '@/lib/store/SheetStore'

const CustomSheet = () => {
    const { isOpen, type } = useSheetStore()

    return (
        <>
            {/* Partial overlay that only covers the sheet's area */}
            {isOpen && (
                <div 
                    className="fixed right-0 top-0 bottom-0 bg-transparent w-[550px] z-[29]"
                    style={{ 
                        pointerEvents: 'auto',
                        touchAction: 'none'
                    }}
                />
            )}
            <div 
                className={`fixed right-0 top-0 bg-white dark:bg-gray-900 shadow-lg 
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "translate-x-full"} sm:w-fit w-screen h-full z-[30]`}
            >
                {type === 'settings' && <SettingSheet />}
                {type === 'node' && <NodeSheet />}
            </div>
        </>
    )
}

export default CustomSheet
