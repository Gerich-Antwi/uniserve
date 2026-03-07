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
}

export default function ChatRoom({
  conversationId,
  currentUserId,
  initialMessages,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
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
        // Prevent duplicate messages if we are the sender
        const messageExists = prev.some((msg) => msg.id === incomingMessage.id);
        if (messageExists) return prev;
        return [...prev, incomingMessage];
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
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    isMe
                      ? "bg-primary text-primary-foreground min-w-[200px]"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <span className="text-[10px] opacity-70 mt-1 block w-full text-right">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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
