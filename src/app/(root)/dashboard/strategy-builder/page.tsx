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
import { backtestService } from "../backtests/_actions";
import { useAuthStore } from "@/lib/store/authStore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoginCard from "../../(auth)/_components/LoginCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

function StrategyBuilderPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const templateId = searchParams.get("templateId");
  const copy = searchParams.get("copy");
  const encr = searchParams.get("encr"); //public backtest strategy

  //to get private backtest strategy
  const strategyName = searchParams.get("strategyName");
  const runId = searchParams.get("runid");

  const { user, isLoading: loadingProfile } = useAuthStore();

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
  const { data: strategyRules } = useQuery({
    queryFn: () => backtestService.getPublicBacktestStrategyRules(encr as string),
    queryKey: ["strategyRules"],
    enabled: !!encr,
  });
  const { data: backtestStData } = useQuery({
    queryFn: () => backtestService.getBackTestRules(strategyName as string, runId as string),
    queryKey: ["backtestStData"],
    enabled: !!strategyName && !!runId,
  });
  const { isUnsaved, setUnsaved, setCanEdit } = useUnsavedChangesStore();

  useEffect(() => {
    if (!!data?.data && !isLoading && (name || copy)) {
      reformStrategy(data);
      setUnsaved(false);
    }
  }, [data, isLoading]);
  useEffect(() => {
    if (!!templateData) {
      reformStrategy(templateData);
      setUnsaved(false);
    }
  }, [templateData]);
  useEffect(() => {
    if (!!strategyRules) {
      reformStrategy(strategyRules);
      setUnsaved(false);
      setCanEdit(false);
    }
  }, [strategyRules]);
  useEffect(() => {
    if (!!backtestStData) {
      reformStrategy(backtestStData);
      setUnsaved(false);
    }
  }, [backtestStData]);

  useNavigationWarning();
  const router = useRouter();

  if (loadingProfile) {
    return <div className='flex justify-center items-center h-full w-screen flex-col'>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      <p className='text-gray-500 text-center'>
        Just a second
      </p>
    </div>
  }

  //error handling if data is empty
  // if (!data?.data || !!templateData || !!strategyRules || !!backtestStData) {
  //   return (
  //     <div className="flex flex-col justify-center items-center h-full w-screen">
  //       <p className="text-center text-gray-500">
  //         No strategy found. Please check the URL or try again.
  //       </p>
  //       <Button  onClick={() => router.push("/dashboard/my-strategies")} className="mt-4">
  //         <ArrowLeft />
  //         Go To My Strategies
  //       </Button>
  //     </div>
  //   );
  // }

  return (
    <>
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
      <Dialog open={!loadingProfile && !user} modal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription>
              Please sign in to access the Strategy Builder. Your work will be saved automatically.
            </DialogDescription>
          </DialogHeader>
          <LoginCard />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default withAuth(StrategyBuilderPage,false)
