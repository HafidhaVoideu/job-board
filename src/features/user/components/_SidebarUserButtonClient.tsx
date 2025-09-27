"use client";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronsUpDown } from "lucide-react";

type userButtonProps = {
  email: string;
  name: string;
  imageUrl: string;
};

export function SidebarUserButtonClient({ user }: { user: userButtonProps }) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size={"lg"}
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <UserInfo {...user}></UserInfo>

          <ChevronsUpDown className="ml-auto group-data-[state=collapsed]:hidden"></ChevronsUpDown>
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent></DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserInfo({ imageUrl, name, email }: userButtonProps) {
  const nameInitials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <Avatar className="rounded-lg size-9 ">
        <AvatarImage
          className="size-full rounded-lg  object-cover "
          src="/profile.jpeg"
          alt={name}
        />
        <AvatarFallback className=" rounded-lg flex items-center justify-center  size-full uppercase bg-primary text-primary-foreground">
          {nameInitials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
        <span className="truncate text-sm font-semibold">{name}</span>
        <span className="truncate text-xs">{email}</span>
      </div>
    </div>
  );
}
