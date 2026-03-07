import { Langbase } from "langbase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const langbase = new Langbase({
      apiKey: process.env.LANGBASE_API_KEY!,
    });

    const memoryName = process.env.LANGBASE_MEMORY_NAME || 'knowledge-base';
    const pipeName = process.env.LANGBASE_PIPE_NAME || 'ai-support-agent';

    let chunksText = '';
    
    // Check if Memory API is configured/ready, wrap in try/catch to gracefully fallback if not
    try {
      const chunks = await langbase.memories.retrieve({
        query: message,
        topK: 4,
        memory: [{ name: memoryName }],
      });

      if (chunks && Array.isArray(chunks)) {
        for (const chunk of chunks) {
          chunksText += chunk.text + '\n';
        }
      }
    } catch (memoryError) {
      console.error("Langbase Memory Retrieval Error:", memoryError);
    }

    const systemPrompt = `You're a helpful AI support assistant. Assist users with their queries accurately and concisely.
Below is some CONTEXT to help you answer questions. Try to answer from the CONTEXT.
If you do not know the answer based on the context, politely let the user know and offer general assistance.

CONTEXT:
${chunksText || 'No context found.'}`;

    const { completion } = await langbase.pipes.run({
      stream: false,
      name: pipeName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    return NextResponse.json({ reply: completion });
  } catch (error: any) {
    console.error("Langbase Pipe Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process the request" },
      { status: 500 }
    );
  }
}
