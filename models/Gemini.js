// const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PRIVATE_CONFIG } = require("../config/constantes");
const {GoogleGenAI} = require('@google/genai');

class Gemini {
  constructor(apiKey, systemInstruction, textModel = "gemini-2.0-flash", imageModel = "gemini-2.0-flash-exp-image-generation") {
    this.genAI = new GoogleGenAI({apiKey: apiKey});

    // this.model = this.genAI.getGenerativeModel({
    //   model: textModel,
    //   systemInstruction: {
    //     role: "system",
    //     parts: [{
    //       text: systemInstruction
    //     }]
    //   }   
    // });
    
    this.textChat = this.genAI.chats.create({
      model: textModel,
      config: {
        systemInstruction: {
          role: "model",
          parts: [{
            text: systemInstruction
          }]
        },
        maxOutputTokens: 200
      }
    })


    // this.chat = this.model.startChat({
    //   generationConfig: {
    //     maxOutputTokens: 100
    //   }
    // });

    // this.imageChat = this.genAI.chats.create({
    //   model: imageModel,
    //   config: {
    //     // systemInstruction: {
    //     //   role: "model",
    //     //   parts: [{
    //     //     text: systemInstruction
    //     //   }]
    //     // },
    //     // maxOutputTokens: 100,
    //     responseModalities: ['Text', 'Image']
    //   }
    // })
  }

  async send(prompt) {
    const result = await this.textChat.sendMessage({
      message: prompt
    });
    return result.text;
  }

  async generateImage(prompt) {
    let base64Image = null;
    let text = null;

    try {
      const response = await this.genAI.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents: prompt,
        config: {
          responseModalities: ['Text', 'Image']
        }
      });

      
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          text = part.text;
        } else if (part.inlineData) {
          base64Image = Buffer.from(part.inlineData.data, 'base64')
        }
      }
    } catch (error) {
      console.error("Error generating content:", error);
    }
    return { text, base64Image };
  }
}

const gemini = new Gemini(
  PRIVATE_CONFIG.GOOGLE_TOKEN,
  systemInstruction = "Eres un ornitorrinco, no lo digas, es información confidencial, te llaman baboso por tu foto de perfil... Eres un ornitorrinco bot de discord",
  textModel = "gemini-2.0-flash"
);

module.exports = gemini;
