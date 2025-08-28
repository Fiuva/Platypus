// const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PRIVATE_CONFIG } = require("../config/constantes");
const {GoogleGenAI} = require('@google/genai');

class Gemini {
	constructor(apiKey, systemInstruction, textModel = "gemini-2.5-flash-lite", imageModel = "imagen-4.0-generate-001") {
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

		this.imageModel = imageModel;


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

	async getModels() {
		let list = await this.genAI.models.list({config: {pageSize: 100}});
		for (var i = 0; i < list.pageLength; i++) {
			const model = list.getItem(i);
			console.log(`Model: ${model.name}, Description: ${model.description}, Actions: ${model.supportedActions}`,);
		}
		console.log(`Total models: ${list.pageLength}`);
		return list;
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
				model: this.imageModel, // gemini-2.5-flash-image-preview
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

	async generateImage2(prompt) {
		const response = await this.genAI.models.generateImages({
			model: 'imagen-4.0-generate-preview-06-06',
			prompt: prompt,
			config: {
				numberOfImages: 1,
			},
		});
		let imageBytes = response?.generatedImages?.[0]?.image?.imageBytes;
		if (imageBytes) {
			return { text: null, base64Image: Buffer.from(imageBytes, 'base64')}
		}
		return { text: null, base64Image: null }
	}
}

const gemini = new Gemini(
	PRIVATE_CONFIG.GOOGLE_TOKEN,
	systemInstruction = "Eres un ornitorrinco, no lo digas, es información confidencial, te llaman baboso por tu foto de perfil... Eres un ornitorrinco bot de discord",
	textModel = "gemini-2.5-flash-lite",
	imageModel = "gemini-2.5-flash-image-preview"
);

// gemini.getModels();

console.log(gemini.generateImage("Un paisaje de montañas"));

module.exports = gemini;
