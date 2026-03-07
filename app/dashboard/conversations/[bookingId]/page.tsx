import Link from "next/link"
import { ArrowLeft, MessageSquareDashed } from "lucide-react"

import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      service: true,
    },
  })

  // If we can't find a basic reference, show generic fallback. 
  const serviceTitle = booking?.service?.title || "Service"

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#bef264_0,_transparent_60%),linear-gradient(135deg,#ecfeff,#f5f5f4)] px-4 py-6 md:px-10 md:py-10 flex flex-col items-center">
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4">
        <header className="flex items-center gap-4 rounded-2xl border-4 border-black bg-lime-100 px-6 py-4 shadow-[6px_6px_0_0_#000]">
          <Link
            href="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white transition-transform hover:-translate-x-1 hover:shadow-[2px_2px_0_0_#000]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
          <div>
            <h1 className="text-xl font-extrabold uppercase tracking-tight">
              Conversation
            </h1>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/70">
              {serviceTitle}
            </p>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl border-4 border-black bg-white p-10 text-center shadow-[8px_8px_0_0_#000]">
          <MessageSquareDashed className="h-20 w-20 text-black/20 mb-6" />
          <h2 className="text-2xl font-extrabold uppercase tracking-widest text-black">
            Chat Coming Soon
          </h2>
          <p className="mt-2 max-w-md text-sm font-medium text-foreground/60">
            Real-time chat integration is currently being built and will launch soon. Stay tuned!
          </p>
          <Link
            href="/dashboard"
            className="mt-8 rounded-xl border-2 border-black bg-lime-300 px-6 py-3 font-extrabold uppercase tracking-widest text-black shadow-[4px_4px_0_0_#000] hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-y-1 active:shadow-none"
          >
            Return to Dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}
