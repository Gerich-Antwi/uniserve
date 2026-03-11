import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ChatRoom from "./ChatRoom";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const { conversationId } = await params;

  // Retrieve the conversation and verify the user belongs to the associated booking
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      booking: {
        include: {
          student: { select: { id: true, name: true } },
          provider: { select: { id: true, name: true } },
        },
      },
      messages: {
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

  // Extract the stored messages from the DB (include readAt for read/unread indicators)
  type ChatMessage = {
    id: string;
    senderId: string;
    message: string;
    timestamp: string;
    readAt: string | null;
  };

  const initialMessages: ChatMessage[] = conversation.messages.map((msg) => ({
    id: msg.id,
    senderId: msg.senderId,
    message: msg.content,
    timestamp: msg.createdAt.toISOString(),
    readAt: msg.readAt?.toISOString() ?? null,
  }));

  const isCurrentUserStudent = conversation.booking.studentId === session.user.id;
  const partnerName = isCurrentUserStudent
    ? conversation.booking.provider.name ?? "Provider"
    : conversation.booking.student.name ?? "Student";

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">Chat with {partnerName}</h1>
      <ChatRoom
        conversationId={conversationId}
        currentUserId={session.user.id}
        studentId={conversation.booking.studentId}
        initialMessages={initialMessages}
        partnerName={partnerName}
      />
    </div>
  );
}
