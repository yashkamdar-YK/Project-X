"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, Database, BarChart2, Layers, Zap, Plus, Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

interface AccordionItemType {
  title: string
  icon: React.ReactNode
}

const DashboardSidebar: React.FC = () => {
  const [accordionItems] = useState<AccordionItemType[]>([
    { title: "Data Points", icon: <Database className="w-4 h-4" /> },
    { title: "Indicators", icon: <BarChart2 className="w-4 h-4" /> },
    { title: "Components", icon: <Layers className="w-4 h-4" /> },
    { title: "Actions", icon: <Zap className="w-4 h-4" /> },
  ])

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              className="pl-10 pr-4 border rounded-md w-full bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-100 dark:placeholder-gray-400 transition-all duration-200"
              type="text"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-4"></div>

        <Accordion type="multiple" className="space-y-2">
          {accordionItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="flex items-center justify-between py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 group">
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </div>
                <div className="flex items-center">
                  <button className="text-xs bg-blue-500 dark:bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 mr-2">
                    <Plus className="w-3 h-3" />
                  </button>
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-1 pl-6 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md shadow-sm transition-all duration-200">
                  <p>Accordion content goes here...</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-700 flex-none overflow-hidden">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar with Fixed Floating Trigger */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button 
              className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-blue-500 dark:bg-blue-600 text-white shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Open sidebar"
            >
              <Plus className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-[80%] sm:w-[385px] p-0 !pt-10"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export default DashboardSidebar