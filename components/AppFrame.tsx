"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/header/Header";

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
      <Header />
      {children}
    </div>
  );
}
