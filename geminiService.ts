import { GoogleGenAI } from "@google/genai";
import { SearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchBing = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Simulate a Bing search engine result for the Xbox 360 dashboard year 2009 for the query: "${query}". 
      Return a JSON array of 3 objects with 'title' and 'snippet'. Keep it brief.`,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as SearchResult[];
  } catch (error) {
    console.error("Gemini search failed", error);
    return [
      { title: "Search Error", snippet: "Could not retrieve results from Xbox Live." }
    ];
  }
};

export const getGameDescription = async (gameTitle: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a short, exciting 2-sentence marketing description for the video game "${gameTitle}" as if it appears on the Xbox 360 Marketplace.`,
    });
    return response.text || "Experience the thrill of next-gen gaming.";
  } catch (error) {
    return "Experience the thrill of next-gen gaming on Xbox 360.";
  }
}

export const generateGamertag = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a single cool, nostalgic Xbox 360 era Gamertag (e.g., xX_Sniper_Xx style or something classic). Return only the text.",
    });
    return response.text?.trim() || "PlayerOne";
  } catch (e) {
    return "MasterChief117";
  }
}

export const generateRandomMessage = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Write a short 1 sentence message a friend would send on Xbox Live in 2009. Example: 'Hop on Halo 3' or 'GG last night'.",
    });
    return response.text?.trim() || "Want to play Halo?";
  } catch (e) {
    return "Invite to party?";
  }
}