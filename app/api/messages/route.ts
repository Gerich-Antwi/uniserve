import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const { message, senderId, conversationId } = await req.json();

    if (!message || !senderId || !conversationId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 1. Verify the conversation exists
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    // 2. Create the message directly in the `message` table (relational model)
    const newMessage = await prisma.message.create({
      data: {
        id: crypto.randomUUID(),
        conversationId,
        senderId,
        content: message,
      },
    });

    // 3. Format the payload to match what the frontend likely expects
    const pusherPayload = {
      id: newMessage.id,
      senderId: newMessage.senderId,
      message: newMessage.content,
      timestamp: newMessage.createdAt.toISOString(),
    };

    // 4. Trigger the real-time event via Pusher so other clients update instantly
    await pusherServer.trigger(conversationId, "new-message", pusherPayload);

    return NextResponse.json(pusherPayload);
  } catch (error) {
    console.error("MESSAGES_POST_ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
