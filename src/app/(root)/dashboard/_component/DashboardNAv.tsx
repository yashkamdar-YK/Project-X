"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DarkModeSwitch from "./DarkModeSwitch";
import { UserToggle } from "./UserToggle";
import { clearStores } from "../strategy-builder/_utils/utils";
import { useNodeStore } from "@/lib/store/nodeStore";
import {
  INITIAL_EDGES,
  INITIAL_NODES,
} from "../strategy-builder/constants/menu";
import { useUnsavedChangesStore } from "@/lib/store/unsavedChangesStore";
import { Badge } from "@/components/ui/badge";
import posthog from "posthog-js";

const DashboardNav: React.FC = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  const navLinks = [
    { href: "/dashboard/my-strategies", label: "My Strategies" },
    { href: "/dashboard/backtests", label: "Backtests" },
    { href: "/dashboard/strategy-builder", label: "Strategy Builder" },
  ];

  const { nodes, edges, setEdges, setNodes } = useNodeStore();
  const { isUnsaved } = useUnsavedChangesStore();

  const handleNavigate = (href: string) => {
    if (
      href === "/dashboard/strategy-builder" &&
      pathName !== "/dashboard/strategy-builder"
    ) {
      clearStores();
      setNodes(INITIAL_NODES);
      setEdges(INITIAL_EDGES);
    }
    router.push(href);
    setPendingNavigation(null);
  };

  const handleNavLink = (href: string) => {
    posthog.capture('navigating', { property: href })
    if (isUnsaved && pathName === "/dashboard/strategy-builder") {
      setPendingNavigation(href);
    } else {
      handleNavigate(href);
    }
  };

  const NavLinks = () => (
    <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 bg-transparent backdrop-blur-md md:space-y-0 items-start md:items-center font-medium">
      {navLinks.map((link) => (
        <div
          onClick={() => handleNavLink(link.href)}
          key={link.href}
          className={`
            transition-all duration-200 cursor-pointer
            hover:text-blue-600 dark:hover:text-blue-400
            font-semibold
            ${
              pathName === link.href
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }
          `}
        >
          {link.label}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative lg:h-7 lg:w-28 h-5 w-24">
              <img
                src="/logo_black.png"
                alt="Black Logo"
                className="dark:hidden block"
              />
              <img
                src="/logo_white.png"
                alt="White Logo"
                className="dark:block hidden"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block pl-10">
              <NavLinks />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge
              className="border-green-500 text-green-500 rounded-full"
              variant="outline"
            >
              Credits: --
            </Badge>
            <DarkModeSwitch />
            <div className="hidden md:block">
              <UserToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] sm:w-[385px]">
                  <div className="py-6">
                    <UserToggle />
                    <div className="border-b border-gray-200 dark:border-gray-700 my-6"></div>
                    <NavLinks />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      <AlertDialog
        open={!!pendingNavigation}
        onOpenChange={() => setPendingNavigation(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in your strategy. If you leave this page,
              all unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                pendingNavigation && handleNavigate(pendingNavigation)
              }
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Leave Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DashboardNav;
