import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BookingStatus } from "@/lib/generated/prisma/enums"

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // TODO: Re-enable role check when database is ready
  // if ((session.user as { role?: string }).role !== RoleEnum.PROVIDER) {
  //   return new NextResponse("Forbidden", { status: 403 })
  // }

  const bookings = await prisma.booking.findMany({
    where: {
      providerId: session.user.id,
      status: BookingStatus.PENDING,
    },
    include: {
      student: true,
      service: true,
    },
    orderBy: {
      bookedAt: "desc",
    },
  })

  return NextResponse.json(bookings)
}

