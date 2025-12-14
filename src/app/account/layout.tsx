import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import AccountShell from "./AccountShell";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  
  return <AccountShell>{children}</AccountShell>;
}
