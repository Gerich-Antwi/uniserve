import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default async function ChatListPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  async function createTestChat() {
    "use server"
    const crypto = require("crypto");
    
    // Always use a specific test user so you know exactly who to log in as in the other browser
    let otherUser = await prisma.user.findFirst({
      where: { 
        email: "swiftwilliams868@gmail.com"
      }
    });

    if (!otherUser) {
      // Import the hash endpoint better-auth uses, or simply create the better-auth account
      // via the server-side auth client if available. To make it simpler without risking a DB mismatch:
      otherUser = await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          name: "Swift Williams",
          email: "swiftwilliams868@gmail.com",
          role: "PROVIDER"
        }
      });

      // You can generate this hash yourself or use Better-auth's default bcrypt (it expects a hash)
      // Since it's just for testing, we can inject a pre-hashed password for "password123"
      await prisma.account.create({
        data: {
          id: crypto.randomUUID(),
          accountId: "password", // The better-auth credential provider name
          providerId: "credential", 
          userId: otherUser.id,
          password: "password123" // Note: If BetterAuth rejects raw passwords in the DB, you will need to sign-up via the UI for the second user instead.
        }
      });
    }

    // Create a fake service for them
    let fakeService = await prisma.service.findFirst({
      where: { providerId: otherUser.id }
    });

    if (!fakeService) {
      fakeService = await prisma.service.create({
        data: {
          title: "Test Chat Service",
          description: "A service for testing chat features",
          category: "Other",
          providerId: otherUser.id,
        }
      });
    }

    // Create a booking & conversation
    const booking = await prisma.booking.create({
      data: {
        studentId: userId,
        providerId: otherUser.id,
        serviceId: fakeService.id,
        conversation: {
          create: {}
        }
      },
      include: {
        conversation: true
      }
    });

    redirect(`/chat/${booking.conversation?.id}`);
  }

  // Find all conversations where the user is either the student or the provider
  const conversations = await prisma.conversation.findMany({
    where: {
      booking: {
        OR: [{ studentId: userId }, { providerId: userId }],
      },
    },
    include: {
      booking: {
        include: {
          student: {
            select: { id: true, name: true, image: true },
          },
          provider: {
            select: { id: true, name: true, image: true },
          },
          service: {
            select: { title: true },
          },
        },
      },
      message: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1, // Only get the latest message for the preview
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (conversations.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
          <p className="mt-2 text-center text-muted-foreground w-full py-20 border rounded-lg bg-card">
            Book a service or receive a booking to start chatting.
          </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <form action={createTestChat}>
          <Button type="submit" variant="outline">
            + Create Test Chat
          </Button>
        </form>
      </div>
      <div className="space-y-4">
        {conversations.map((conversation) => {
          const { booking, message } = conversation;
          const isStudent = booking.studentId === userId;

          // The "other" person in the chat
          const chatPartner = isStudent ? booking.provider : booking.student;
          const partnerRole = isStudent ? "Provider" : "Student";
          const latestMessage = message[0];

          return (
            <Link key={conversation.id} href={`/chat/${conversation.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chatPartner.image || ""} />
                    <AvatarFallback>
                      {chatPartner.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold truncate">
                        {chatPartner.name}
                      </h3>
                      {latestMessage && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {new Date(latestMessage.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <p className="text-muted-foreground truncate max-w-[70%]">
                        {latestMessage
                          ? latestMessage.content
                          : `New conversation regarding: ${booking.service.title}`}
                      </p>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                        {partnerRole}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
