
/**
 * Converts a File object to a base64 encoded string with its mime type.
 * @param file The file to convert.
 * @returns An object containing the base64 data and mime type.
 */
const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const encoded = reader.result as string;
      const parts = encoded.split(",", 2);
      if (parts.length !== 2) {
        return reject(new Error("Invalid data URL."));
      }
      const mimeType = parts[0].split(":")[1].split(";")[0];
      resolve({ data: parts[1], mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Generates content by calling our secure serverless API endpoint.
 * @param prompt The text prompt for the AI.
 * @param image An optional image File object.
 * @param config An optional configuration object for the API call, including response schema.
 * @returns The text response from the Gemini API.
 */
export const generateContent = async (prompt: string, image: File | null, config?: any): Promise<string> => {
    try {
        let imagePayload = null;
        if (image) {
            imagePayload = await fileToBase64(image);
        }

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, image: imagePayload, config }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API request failed');
        }

        const data = await response.json();
        return data.text;

    } catch (error) {
        console.error("Error calling backend API for content generation:", error);
        if (error instanceof Error) {
            return Promise.reject(new Error(`API Error: ${error.message}`));
        }
        return Promise.reject(new Error("Failed to generate content due to an unknown API error."));
    }
};

/**
 * Streams a chat response from our secure serverless API endpoint.
 * @param history The full chat history, including the latest user message.
 */
export async function* streamChatResponse(history: {role: 'user' | 'model', text: string}[]) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history }),
        });

        if (!response.ok || !response.body) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Chat API request failed');
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            yield decoder.decode(value);
        }

    } catch (error) {
         console.error("Chat streaming error:", error);
         yield "Sorry, I encountered an error. Please try again later.";
    }
}
