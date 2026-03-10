import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { message, conversationId, id } = await req.json();

    if (!message || !conversationId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Use the logged-in user as sender so messages always show correctly for provider vs student
    const senderId = session.user.id;

    // 1. Verify the conversation exists and that the sender is a participant
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { booking: { select: { studentId: true, providerId: true } } },
    });

    if (!conversation?.booking) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    const { studentId, providerId } = conversation.booking;
    const isParticipant = senderId === studentId || senderId === providerId;
    if (!isParticipant) {
      return new NextResponse("You are not part of this conversation", { status: 403 });
    }

    const user1Id = studentId;
    const user2Id = providerId;

    // 2. Create the message in the `message` table (single source of truth; sender from session)
    const messageId = id || crypto.randomUUID();
    const newMessage = await prisma.message.create({
      data: {
        id: messageId,
        conversationId,
        senderId,
        content: message,
      },
    });

    // Update conversation so chat list shows latest message and correct order for both user and provider
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // 3. Daily grouping: { user1: [...], user2: [...], date: DateTime } for archival
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateIso = today.toISOString();

    type GroupData = Record<string, string[] | string>;
    let group = await prisma.messageGroup.findFirst({
      where: {
        conversationId,
        date: today,
      },
    });

    if (!group) {
      const data: GroupData = {
        [user1Id]: user1Id === senderId ? [message] : [],
        [user2Id]: user2Id === senderId ? [message] : [],
        date: dateIso,
      };
      await prisma.messageGroup.create({
        data: {
          conversationId,
          date: today,
          data: data as object,
        },
      });
    } else {
      const currentData = (group.data || {}) as GroupData;
      const user1Messages = (currentData[user1Id] ?? []) as string[];
      const user2Messages = (currentData[user2Id] ?? []) as string[];
      const data: GroupData = {
        [user1Id]: user1Id === senderId ? [...user1Messages, message] : user1Messages,
        [user2Id]: user2Id === senderId ? [...user2Messages, message] : user2Messages,
        date: dateIso,
      };
      await prisma.messageGroup.update({
        where: { id: group.id },
        data: { data: data as object },
      });
    }

    // 4. Format the payload for Pusher
    const pusherPayload = {
      id: newMessage.id,
      senderId: newMessage.senderId,
      message: newMessage.content,
      timestamp: newMessage.createdAt.toISOString(),
    };

    // 5. Trigger Pusher event
    await pusherServer.trigger(conversationId, "new-message", pusherPayload);

    return NextResponse.json(pusherPayload);
  } catch (error) {
    console.error("MESSAGES_POST_ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
