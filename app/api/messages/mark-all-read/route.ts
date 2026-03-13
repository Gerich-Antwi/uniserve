import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const unreadFromStudents = await prisma.message.findMany({
      where: {
        readAt: null,
        conversation: {
          booking: {
            providerId: userId,
          },
        },
      },
      select: {
        id: true,
        conversationId: true,
        senderId: true,
        conversation: {
          select: { booking: { select: { studentId: true } } },
        },
      },
    });

    const fromStudent = unreadFromStudents.filter(
      (m) => m.conversation.booking.studentId === m.senderId
    );
    if (fromStudent.length === 0) {
      return NextResponse.json({ ok: true, marked: 0 });
    }

    const conversationIds = [...new Set(fromStudent.map((m) => m.conversationId))];
    const readAt = new Date();

    await prisma.message.updateMany({
      where: {
        id: { in: fromStudent.map((m) => m.id) },
      },
      data: { readAt },
    });

    for (const cid of conversationIds) {
      await pusherServer.trigger(cid, "messages-read", { readAt: readAt.toISOString() });
    }

    return NextResponse.json({ ok: true, marked: fromStudent.length });
  } catch (error) {
    console.error("MARK_ALL_READ_ERROR:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
