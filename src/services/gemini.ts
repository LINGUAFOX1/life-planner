import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAssistantResponse(prompt: string, context?: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `You are a high-performance productivity coach for 'LifeSync AI'. 
          Your tone is motivational, clear, and cinematic. 
          Provide concise, actionable advice. 
          Context: ${context || "No specific context provided."}
          User message: ${prompt}` }]
        }
      ],
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: Could not connect to the AI Life Assistant.";
  }
}

export async function autoSortTasks(tasks: { id: string; title: string; priority: string }[]) {
  try {
    const taskList = tasks.map(t => `${t.id}: ${t.title} (current priority: ${t.priority})`).join("\n");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `You are an AI task optimizer. Re-sort the following tasks based on logical priority (High, Medium, Low). 
          Return a JSON array of task IDs in the new order with their updated priority.
          Tasks:
          ${taskList}
          
          Format: JSON array of objects with id and priority.` }]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || "[]");
    return result;
  } catch (error) {
    console.error("AutoSort Error:", error);
    return null;
  }
}
