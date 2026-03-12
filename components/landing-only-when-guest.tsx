"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Renders children (landing page) only when the user is not logged in.
 * Until session is known, nothing is shown. Once we know they're logged in,
 * we redirect to /services without ever showing the landing content.
 */
export function LandingOnlyWhenGuest({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (session?.user) {
      router.replace("/services");
    }
  }, [session?.user, isPending, router]);

  if (isPending) {
    return null;
  }
  if (session?.user) {
    return null;
  }
  return <>{children}</>;
}
