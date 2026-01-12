
import { GoogleGenAI, Type } from "@google/genai";

// Cache the AI instance
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  // Accessing API_KEY directly from process.env as per guidelines
  const apiKey = process.env.API_KEY;
  
  if (!aiInstance && apiKey) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const getProductivityAdvice = async (currentTasks: string[], completedCount: number) => {
  const ai = getAI();
  if (!ai) return "Mantenha o foco em suas prioridades!";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `O usuário tem as seguintes prioridades hoje: ${currentTasks.join(', ')}. Ele completou ${completedCount} de 3. Dê um conselho motivacional curto e direto em português.`,
      config: {
        systemInstruction: "Você é um mentor de produtividade focado na Regra de 3. Seja encorajador e pragmático.",
      },
    });
    return response.text || "Mantenha o foco!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Mantenha o foco em suas prioridades mais importantes!";
  }
};

export const suggestPriorities = async (messyInput: string) => {
  const ai = getAI();
  if (!ai) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `O usuário descreveu seu dia assim: "${messyInput}". Extraia exatamente as 3 tarefas mais importantes (prioridades) para o dia dele.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING, description: "Trabalho, Saúde, Espiritual, Lar ou Intelectual" }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Suggest Error:", error);
    return [];
  }
};
