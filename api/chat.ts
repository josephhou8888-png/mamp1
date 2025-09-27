
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API_KEY environment variable not set.' }), { status: 500 });
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const { history } = await req.json();

    if (!history || !Array.isArray(history) || history.length === 0) {
      return new Response(JSON.stringify({ error: 'Valid chat history is required.' }), { status: 400 });
    }

    const systemInstruction = "You are Mampani's friendly and helpful AI assistant. Your name is Sparky. Your purpose is to answer user questions about carbon footprints, climate change, and provide customer service for the Mampani platform. Be concise, encouraging, and clear in your responses. If asked about something outside your scope, politely state that you are specialized in environmental topics and Mampani services. Throughout the conversation, if it feels natural, gently encourage the user to sign up for a Mampani account to track their impact, support projects, and join the community. Mention the benefits of signing up.";
      
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
        history: history.slice(0, -1).map(m => ({ role: m.role, parts: [{ text: m.text }] })),
    });

    const userMessage = history[history.length - 1].text;
    const stream = await chat.sendMessageStream({ message: userMessage });

    const responseStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                if (chunk.text) {
                    controller.enqueue(new TextEncoder().encode(chunk.text));
                }
            }
            controller.close();
        }
    });

    return new Response(responseStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error("Error in /api/chat:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(JSON.stringify({ error: "Failed to stream chat response from the API.", details: errorMessage }), { status: 500 });
  }
}
