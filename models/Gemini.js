const { GoogleGenerativeAI } = require("@google/generative-ai");

class Gemini {
  constructor(apiKey, systemInstruction, textModel = "gemini-2.0-flash", imageModel = "gemini-2.0-flash-exp-image-generation") {
    this.genAI = new GoogleGenerativeAI(apiKey);

    this.model = this.genAI.getGenerativeModel({
      model: textModel,
      systemInstruction: {
        role: "system",
        parts: [{
          text: systemInstruction
        }]
      }
    });

    this.chat = this.model.startChat({
      generationConfig: {
        maxOutputTokens: 100
      }
    });

    this.imageModel = imageModel;
  }

  async send(prompt) {
    const result = await this.chat.sendMessage(prompt);
    return result.response.text();
  }

  async generateImage(prompt) {
    try {
      const response = await ai.models.generateContent({
        model: this.imageModel,
        contents: prompt,
        config: {
          responseModalities: ['Text', 'Image']
        },
      });

      let imageData = null;
      let text = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          text = part.text;
        } else if (part.inlineData) {
          imageData = part.inlineData.data;
        }
      }
      return { text, imageData };
    } catch (error) {
      console.error("Error generating content:", error);
    }
  }
}

const gemini = new Gemini(
  PRIVATE_CONFIG.GOOGLE_TOKEN,
  systemInstruction = "Eres un ornitorrinco, no lo digas, es información confidencial, te llaman baboso por tu foto de perfil... Eres un ornitorrinco bot de discord",
  textModel = "gemini-2.0-flash"
);

module.exports = gemini;
