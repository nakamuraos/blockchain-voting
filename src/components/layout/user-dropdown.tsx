"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import Popover from "@/components/shared/popover";
import Image from "next/image";
import { trimAddress } from "@/lib/utils";

export default function UserDropdown({ session }: { session: any }) {
  const { address } = session || {};
  const [openPopover, setOpenPopover] = useState(false);

  if (!address) return null;

  return (
    <div className="relative inline-block text-left">
      <Popover
        content={
          <div className="w-full rounded-md bg-white p-2 sm:w-56">
            {/* <Link
              className="flex items-center justify-start space-x-2 relative w-full rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              href="/dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
              <p className="text-sm">Dashboard</p>
            </Link> */}
            {/* <button
              className="relative flex w-full cursor-not-allowed items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              disabled
            >
              <LayoutDashboard className="h-4 w-4" />
              <p className="text-sm">Dashboard</p>
            </button> */}
            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              <p className="text-sm">Logout</p>
            </button>
          </div>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex h-8 w-44 items-center justify-center rounded overflow-hidden border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-44"
        >
          <Image
            alt={address}
            src={`https://avatars.dicebear.com/api/micah/${address}.svg`}
            width={40}
            height={40}
          />
          <div>{trimAddress(address)}</div>
        </button>
      </Popover>
    </div>
  );
}
