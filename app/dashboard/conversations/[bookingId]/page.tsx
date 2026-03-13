import { redirect, notFound } from "next/navigation"
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
      conversation: { select: { id: true } },
    },
  })

  if (!booking) {
    notFound()
  }

  if (booking.conversation) {
    redirect(`/chat/${booking.conversation.id}`)
  }

  redirect("/dashboard/bookings")
}
