import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ChatRoom from "./ChatRoom";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { conversationId } = await params;

  // Retrieve the conversation and verify the user belongs to the associated booking
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      booking: true,
      message: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!conversation || !conversation.booking) {
    return notFound();
  }

  // Check if current user is either the student or the provider
  const isParticipant =
    conversation.booking.studentId === session.user.id ||
    conversation.booking.providerId === session.user.id;

  if (!isParticipant) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">
          You do not have permission to view this conversation.
        </p>
      </div>
    );
  }

  // Extract the stored messages from the DB
  type ChatMessage = {
    id: string;
    senderId: string;
    message: string;
    timestamp: string;
  };

  const initialMessages: ChatMessage[] = conversation.message.map((msg) => ({
    id: msg.id,
    senderId: msg.senderId,
    message: msg.content,
    timestamp: msg.createdAt.toISOString(),
  }));

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">Chat Room</h1>
      <ChatRoom
        conversationId={conversationId}
        currentUserId={session.user.id}
        initialMessages={initialMessages}
      />
    </div>
  );
}
