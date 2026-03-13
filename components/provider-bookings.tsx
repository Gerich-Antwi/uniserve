"use client"

import Link from "next/link"
import { useState } from "react"
import { format } from "date-fns"
import { MessageCircle, CheckCircle2, Clock3 } from "lucide-react"

import { BookingStatus } from "@/lib/generated/prisma/client"
import type { Prisma } from "@/lib/generated/prisma/client"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: { student: true; service: true; conversation: { select: { id: true } } }
}>

interface ProviderBookingsProps {
  bookings: BookingWithRelations[]
}

export function ProviderBookings({ bookings: initial }: ProviderBookingsProps) {
  const [bookings, setBookings] = useState(initial)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleMarkAttended = async (id: string) => {
    try {
      setLoadingId(id)
      const res = await fetch(`/api/provider/bookings/${id}/attend`, {
        method: "POST",
      })
      if (!res.ok) {
        // soft error – future devs can plug in toast system if needed
        console.error("Failed to mark booking as attended")
        return
      }
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: BookingStatus.ATTENDED } : b))
    } finally {
      setLoadingId(null)
    }
  }

  if (!bookings.length) {
    return (
      <section className="rounded-xl sm:rounded-2xl border-4 border-dashed border-black bg-white/70 p-4 sm:p-6 text-center shadow-[4px_4px_0_0_#000] sm:shadow-[6px_6px_0_0_#000]">
        <h2 className="text-base sm:text-lg md:text-xl font-extrabold uppercase tracking-[0.12em] sm:tracking-[0.18em]">
          No active bookings
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-foreground/70 px-2">
          When students book your services, they&apos;ll show up here ready to be served.
        </p>
      </section>
    )
  }

  const sortedBookings = [...bookings].sort((a, b) => {
    if (a.status === BookingStatus.PENDING && b.status === BookingStatus.ATTENDED) return -1;
    if (a.status === BookingStatus.ATTENDED && b.status === BookingStatus.PENDING) return 1;
    return new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime();
  });

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {sortedBookings.map((booking, index) => (
          <article
            key={booking.id}
            className={cn(
              "group relative overflow-hidden rounded-xl sm:rounded-2xl border-4 border-black bg-white p-3 sm:p-4 shadow-[4px_4px_0_0_#000] sm:shadow-[6px_6px_0_0_#000] transition-transform hover:-translate-y-1 min-w-0",
              index % 2 === 0 ? "bg-emerald-50" : "bg-amber-50",
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.04)_0,rgba(0,0,0,0.04)_2px,transparent_2px,transparent_6px)] opacity-70" />
            <div className="relative flex flex-col gap-2 sm:gap-3">
              <header className="flex items-start justify-between gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-[0.1em] sm:tracking-[0.15em] break-words line-clamp-2">
                    {booking.service.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-foreground/70 truncate">
                    Student:{" "}
                    <span className="font-semibold">{booking.student.name}</span>
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-2 border-black bg-yellow-200 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] sm:tracking-[0.18em] shrink-0"
                >
                  <Clock3 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  {booking.status === BookingStatus.PENDING ? "Pending" : "Attended"}
                </Badge>
              </header>

              <div className="flex items-center justify-between text-xs font-medium text-foreground/70">
                <div className="flex flex-col min-w-0">
                  <span className="uppercase tracking-[0.12em] sm:tracking-[0.16em]">Booked on</span>
                  <span className="font-semibold truncate">
                    {format(new Date(booking.bookedAt), "dd MMM yyyy, HH:mm")}
                  </span>
                </div>
              </div>

              <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                {booking.conversation ? (
                  <Link
                    href={`/chat/${booking.conversation.id}`}
                    className="flex flex-1 min-w-0 items-center justify-between rounded-lg sm:rounded-xl border-2 border-black bg-white px-2.5 sm:px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.16em] shadow-[3px_3px_0_0_#000] sm:shadow-[4px_4px_0_0_#000] transition-transform group-hover:-translate-y-0.5 min-h-[44px] sm:min-h-0"
                  >
                    <span className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <span className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-black text-[10px] text-lime-300">
                        {booking.student.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate">Chat</span>
                    </span>
                    <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ml-1" />
                  </Link>
                ) : (
                  <span className="flex flex-1 min-w-0 items-center justify-between rounded-lg sm:rounded-xl border-2 border-black bg-gray-100 px-2.5 sm:px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-muted-foreground cursor-not-allowed min-h-[44px] sm:min-h-0">
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                      <span className="truncate">Chat (unavailable)</span>
                    </span>
                  </span>
                )}

                {booking.status === BookingStatus.PENDING ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="border-2 border-black bg-red-500 px-2 sm:px-3 py-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.1em] sm:tracking-[0.16em] shadow-[3px_3px_0_0_#000] sm:shadow-[4px_4px_0_0_#000] min-h-[44px] sm:min-h-0 w-full sm:w-auto"
                        disabled={loadingId === booking.id}
                      >
                        <CheckCircle2 className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                        <span className="truncate">{loadingId === booking.id ? "Updating..." : "Mark attended"}</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-4 border-black bg-amber-50 shadow-[8px_8px_0_0_#000]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-extrabold uppercase tracking-[0.2em]">
                          Confirm completion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium text-foreground">
                          You&apos;re about to mark{" "}
                          <span className="font-semibold">
                            {booking.service.title}
                          </span>{" "}
                          for{" "}
                          <span className="font-semibold">
                            {booking.student.name}
                          </span>{" "}
                          as <span className="underline">attended</span>. This will update the booking status.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-2 border-black bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] shadow-[3px_3px_0_0_#000]">
                          Keep as pending
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="border-2 border-black bg-green-500 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-black shadow-[3px_3px_0_0_#000] hover:bg-green-400"
                          onClick={() => handleMarkAttended(booking.id)}
                        >
                          Yes, mark attended
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-black bg-gray-200 px-2 sm:px-3 py-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.1em] sm:tracking-[0.16em] text-gray-500 cursor-not-allowed opacity-70 shadow-none hover:bg-gray-200 min-h-[44px] sm:min-h-0 w-full sm:w-auto"
                    disabled
                  >
                    <CheckCircle2 className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                    Completed
                  </Button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

