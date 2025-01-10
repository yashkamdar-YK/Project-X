"use client";
import React, { useEffect } from "react";
import StrategyNavbar from "./_components/StrategyNavbar";
import DashboardSidebar from "./_components/DashboardSidebar";
import StrategyCanvas from "./_components/StrategyCanvas";
import CustomSheet from "@/components/shared/custom-sheet";
import NodeSheet from "./_components/StrategyNavbar/NodeSheet";
import { withAuth } from "@/components/shared/hoc/withAuth";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { strategyService } from "./_actions";
import { reformStrategy } from "./_utils/reformStrategy";
import { useNavigationWarning } from "@/hooks/useNavigationWarning";
import { useUnsavedChangesStore } from "@/lib/store/unsavedChangesStore";

function StrategyBuilderPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const templateId = searchParams.get("templateId");
  const copy = searchParams.get("copy");

  const { data, isLoading } = useQuery({
    queryFn: () => strategyService.getStrategy((name ? name : copy) as string),
    queryKey: ["strategy", name ? name : copy],
    enabled: !!name || !!copy,
  });
  const { data: templateData } = useQuery({
    queryFn: () => strategyService.getTemplate(templateId as string),
    queryKey: ["template", templateId],
    enabled: !!templateId,
  });
  const { isUnsaved, setUnsaved } = useUnsavedChangesStore();

  useEffect(() => {
    if (data && !isLoading && (name || copy)) {
      reformStrategy(data);
      setUnsaved(false);
    }
  }, [data, isLoading]);
  useEffect(() => {
    if (templateData) {
      reformStrategy(templateData);
      setUnsaved(false);
    }
  }, [templateData]);

  useNavigationWarning();

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Strategy Navbar */}
      <div
        className={`
          transition-all duration-300 ease-in-out
        `}
      >
        <StrategyNavbar
          //@ts-ignore
          stratinfo={data?.stratinfo ?? templateData?.stratinfo}
          name={name}
        />
      </div>

      {/* Flex container for sidebar and canvas */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Fixed width dashboard sidebar */}
        <DashboardSidebar />

        {/* Flexible width canvas container */}
        <div className="flex-1 relative">
          {/* Canvas with dynamic width */}
          <div
            className={`
              w-full h-full
              transition-all duration-300 ease-in-out
            `}
          >
            <StrategyCanvas />
          </div>

          {/* Sheet */}
          <CustomSheet />
          {/* <NodeSheet /> */}
        </div>
      </div>
    </div>
  );
}

export default withAuth(StrategyBuilderPage);
