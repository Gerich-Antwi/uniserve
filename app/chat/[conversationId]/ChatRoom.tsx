"use client";

import { useEffect, useState, useRef } from "react";
import { pusherClient } from "@/lib/pusherClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
};

interface ChatRoomProps {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
  partnerName?: string;
}

export default function ChatRoom({
  conversationId,
  currentUserId,
  initialMessages,
  partnerName = "Partner",
}: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const byId = new Map<string, Message>();
    initialMessages.forEach((m) => byId.set(m.id, m));
    return Array.from(byId.values()).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  });
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // 1. Subscribe to the unique channel for this conversation
    const channel = pusherClient.subscribe(conversationId);

    // 2. Listen for 'new-message' events from the server
    channel.bind("new-message", (incomingMessage: Message) => {
      setMessages((prev) => {
        const messageExists = prev.some((msg) => msg.id === incomingMessage.id);
        if (messageExists) return prev;
        const next = [...prev, incomingMessage].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        return next;
      });
    });

    // 3. Cleanup: Unsubscribe when the component unmounts
    return () => {
      pusherClient.unsubscribe(conversationId);
      channel.unbind("new-message");
    };
  }, [conversationId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);

    // Create an optimistic local message object
    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      senderId: currentUserId,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Add locally to the UI immediately for a snappy feel
    setMessages((prev) => [...prev, optimisticMessage]);
    const messageToSend = newMessage;
    setNewMessage("");

    try {
      // POST the real message to the server
      await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          senderId: currentUserId,
          conversationId,
          id: optimisticMessage.id,
        }),
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optional: Handle error by removing optimistic message or showing a toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-background">
      {/* Messages Feed */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        ref={scrollRef}
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No messages yet. Say hello!
          </div>
        ) : (
          Object.entries(
            messages.reduce((groups: { [key: string]: Message[] }, message) => {
              const date = new Date(message.timestamp).toLocaleDateString();
              if (!groups[date]) groups[date] = [];
              groups[date].push(message);
              return groups;
            }, {})
          ).map(([date, groupMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex justify-center my-4">
                <span className="text-xs font-black bg-muted px-3 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                  {date === new Date().toLocaleDateString() ? "Today" : date}
                </span>
              </div>
              {groupMessages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex w-full flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1 ${isMe ? "mr-1" : "ml-1"}`}>
                      {isMe ? "You" : partnerName}
                    </span>
                    <div
                      className={`max-w-[75%] rounded-lg p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                        isMe
                          ? "bg-pink-300 text-black"
                          : "bg-white text-black"
                      }`}
                    >
                      <p className="text-sm font-bold">{msg.message}</p>
                      <span className="text-[10px] font-black opacity-70 mt-1 block w-full text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Input Area - Enter sends, same as Send button */}
      <div className="border-t p-4">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e as unknown as React.FormEvent);
              }
            }}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
            autoComplete="off"
          />
          <Button type="submit" disabled={isLoading || !newMessage.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
