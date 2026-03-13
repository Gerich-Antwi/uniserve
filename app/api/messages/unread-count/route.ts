import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 });
    }

    const userId = session.user.id;

    // Count only messages sent by the student to the provider that the provider has not read.
    // When the student hasn't sent any message yet (through the booking), count stays 0 — no red notice.
    const unreadMessages = await prisma.message.findMany({
      where: {
        readAt: null,
        conversation: {
          booking: {
            providerId: userId,
          },
        },
      },
      select: {
        senderId: true,
        conversation: {
          select: {
            booking: { select: { studentId: true } },
          },
        },
      },
    });
    const count = unreadMessages.filter(
      (m) => m.conversation.booking.studentId === m.senderId
    ).length;

    return NextResponse.json({ count });
  } catch (error) {
    console.error("UNREAD_COUNT_ERROR:", error);
    return NextResponse.json({ count: 0 });
  }
}
