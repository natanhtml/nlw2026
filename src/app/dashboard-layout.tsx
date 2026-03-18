"use client";

import { Navbar } from "@/components/navbar";
import { TRPCReactProvider } from "@/trpc/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </main>
    </>
  );
}
