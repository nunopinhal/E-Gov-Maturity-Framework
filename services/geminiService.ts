
import { GoogleGenAI, Type } from "@google/genai";

export const getAiSuggestions = async (dimensionName: string, existingElements: string[]): Promise<{ name: string; description: string }[]> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    // Returning mock data for UI development without an API key
    return [
      { name: "AI Suggestion 1", description: "This is a mock suggestion for UI testing." },
      { name: "AI Suggestion 2", description: "Enable this by setting your API key." },
    ];
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Based on the e-government maturity dimension "${dimensionName}", and considering the existing assessment elements [${existingElements.join(', ')}], suggest 3 new, distinct, and relevant assessment elements. 
    For each suggestion, provide a brief description. The elements should be specific and measurable.
    Your response must be a JSON array of objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "The name of the new assessment element.",
              },
              description: {
                type: Type.STRING,
                description: "A brief description of what this element measures.",
              },
            },
            required: ["name", "description"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const suggestions = JSON.parse(jsonText);
    return suggestions;
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    throw new Error("Failed to get suggestions from AI. Please check your API key and network connection.");
  }
};
