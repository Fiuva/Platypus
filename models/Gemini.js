const { GoogleGenerativeAI } = require("@google/generative-ai");

class Gemini {
  constructor(apiKey, systemInstruction, model = "gemini-2.0-flash-lite-preview-02-05") {
    this.genAI = new GoogleGenerativeAI(apiKey);

    this.model = this.genAI.getGenerativeModel({
      model: model,
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
  }

  async send(prompt) {
    const result = await this.chat.sendMessage(prompt);
    return result.response.text();
  }
}

module.exports = Gemini;