
import { GoogleGenAI, Type } from "@google/genai";

// This function runs on the server, so process.env is safe to use.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey });

// Helper to map string types from the client to the SDK's Enum types
const mapSchema = (schema: any) => {
    if (!schema) return undefined;
    const newSchema: any = { type: Type[schema.type as keyof typeof Type] };
    if (schema.properties) {
        newSchema.properties = {};
        for (const key in schema.properties) {
            newSchema.properties[key] = mapSchema(schema.properties[key]);
        }
    }
    if (schema.items) {
        newSchema.items = mapSchema(schema.items);
    }
    return newSchema;
};

// Vercel API route handler
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { prompt, image, config } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required.' });
        }

        const parts: any[] = [{ text: prompt }];
        if (image && image.data && image.mimeType) {
            parts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
        }

        const mappedConfig = config ? {
            ...config,
            responseSchema: mapSchema(config.responseSchema)
        } : undefined;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: mappedConfig,
        });
        
        return res.status(200).json({ text: response.text });

    } catch (error) {
        console.error("Error in /api/generate:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ error: "Failed to generate content from the API.", details: errorMessage });
    }
}
