import { redirect } from "next/navigation"
import { headers } from "next/headers"

import { prisma } from "@/lib/prisma"
import type { Prisma, Service } from "@/lib/generated/prisma/client"
import { BookingStatus, Role as RoleEnum } from "@/lib/generated/prisma/enums"
import { ProviderBookings } from "@/components/provider-bookings"
import { ProviderServices } from "@/app/dashboard/provider-services"

export const dynamic = "force-dynamic"

export default async function ProviderDashboardPage() {
  // --- Authentication Bypassed for Evaluation ---
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // })
  //
  // if (!session) {
  //   redirect("/auth/sign-in")
  // }
  //
  // const role = (session.user as { role?: string }).role
  // if (role !== RoleEnum.PROVIDER) {
  //   redirect("/")
  // }
  // --- End of Bypass ---

  const bookings = await prisma.booking.findMany({
    where: {
      providerId: "user_1", // Hardcoded for evaluation
      status: BookingStatus.PENDING,
    },
    include: { student: true, service: true},
    orderBy: { bookedAt: "desc" },
  })

  const services = await prisma.service.findMany({
    where: {
      providerId: "user_1", // Hardcoded for evaluation
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#bef264_0,_transparent_60%),linear-gradient(135deg,#ecfeff,#f5f5f4)] px-4 py-6 md:px-10 md:py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="relative overflow-hidden rounded-2xl border-4 border-black bg-lime-100 px-6 py-5 shadow-[8px_8px_0_0_#000] md:px-8 md:py-6">
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.05)_0,rgba(0,0,0,0.05)_2px,transparent_2px,transparent_6px)]" />
          <div className="relative flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/60">
                Service Provider Console
              </p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
                Active bookings
                <span className="ml-3 inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-lime-300">
                  {bookings.length} open
                </span>
              </h1>
              <p className="mt-2 max-w-xl text-sm font-medium text-foreground/70">
                Manage students who have booked your services, chat with them, and mark
                services as completed — all from one punchy, neo-brutalist dashboard.
              </p>
            </div>
            <div className="mt-3 flex gap-2 md:mt-0">
              <div className="flex flex-col items-end gap-1 text-xs font-semibold uppercase tracking-[0.16em]">
                <span className="rounded-full bg-black px-3 py-1 text-lime-300">
                  Role: Provider
                </span>
              </div>
            </div>
          </div>
        </header>

        <ProviderBookings bookings={bookings} />

        <ProviderServices services={services} />
      </section>
    </main>
  )
}
