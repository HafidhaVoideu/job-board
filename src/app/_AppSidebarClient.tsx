"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppSidebarClient({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-1 border-b p-2">
          <SidebarTrigger></SidebarTrigger>
          <span className="text-xl text-nowrap">Dream jobs</span>
        </div>

        <div className="flex-1 flex"> {children}</div>
      </div>
    );
  }

  return children;
}
