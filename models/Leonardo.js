const { PRIVATE_CONFIG } = require("../config/constantes");

class Leonardo {
    constructor() {
        this.token = null;
        this.cookie = PRIVATE_CONFIG.COOKIE_LEONARDO;
    }

    async getToken() {
        try {
            const response = await fetch("https://app.leonardo.ai/api/auth/session", {
                headers: {
                    "cookie": this.cookie
                },
                method: "GET"
            });


            if (!response.ok) {
                throw new Error(`Error al actualizar token: ${response.statusText}`);
            }

            const data = await response.json();
            this.token = data?.accessToken;
            console.log("Token actualizado");
            return this.token;
        } catch (error) {
            console.error("Error al intentar actualizar el token:", error);
        }
        return null;
    }

    async createJob(prompt) {
        if (!this.token) {
            await this.getToken();
        }

        try {
            const response = await fetch("https://api.leonardo.ai/v1/graphql", {
                headers: {
                    "accept": "*/*",
                    "authorization": `Bearer ${this.token}`,
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "Referer": "https://app.leonardo.ai/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                body: JSON.stringify({
                    operationName: "CreateSDGenerationJob",
                    variables: {
                        arg1: {
                            prompt: prompt,
                            nsfw: true,
                            num_images: 1,
                            width: 888,
                            height: 888,
                            num_inference_steps: 10,
                            guidance_scale: 7,
                            sd_version: "SDXL_LIGHTNING",
                            modelId: "e71a1c2f-4f80-4800-934f-2c68979d8cc8",
                            presetStyle: "NONE",
                            scheduler: "LEONARDO",
                            public: true,
                            tiling: false,
                            imagePrompts: [],
                            poseToImage: false,
                            poseToImageType: "POSE",
                            presetId: 34,
                            weighting: 0.75,
                            highContrast: false,
                            elements: [],
                            userElements: [],
                            controlnets: [],
                            photoReal: false,
                            transparency: "disabled",
                            styleUUID: "b2a54a51-230b-4d4f-ad4e-8409bf58645f",
                            collectionIds: [],
                            ultra: false
                        }
                    },
                    query: `mutation CreateSDGenerationJob($arg1: SDGenerationInput!) {
                        sdGenerationJob(arg1: $arg1) {
                            generationId
                            __typename
                        }
                    }`
                }),
                method: "POST"
            });

            const data = await response.json();
            if (data?.errors) {
                if (data.errors[0] && data.errors[0].message == 'Could not verify JWT: JWTExpired') {
                    this.token = null;
                    return await this.createJob(prompt);
                }
            } else {
                return data?.data?.sdGenerationJob?.generationId;
            }
        } catch (error) {
            console.error("Error al intentar crear el job:", error);
        }
        return null;
    }

    async getGenerationStatus(generationId) {
        if (!this.token) {
            await this.getToken();
        }

        try {
            const response = await fetch("https://api.leonardo.ai/v1/graphql", {
                headers: {
                    "accept": "*/*",
                    "authorization": `Bearer ${this.token}`,
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "Referer": "https://app.leonardo.ai/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                body: JSON.stringify({
                    operationName: "GetAIGenerationFeedStatuses",
                    variables: {
                        where: {
                            status: {
                                _in: ["COMPLETE", "FAILED"]
                            },
                            id: {
                                _in: [generationId]
                            }
                        }
                    },
                    query: `query GetAIGenerationFeedStatuses($where: generations_bool_exp = {}) {
                        generations(where: $where) {
                            id
                            status
                            __typename
                        }
                    }`
                }),
                method: "POST"
            });

            const data = await response.json();
            if (data?.errors) {
                if (data.errors[0] && data.errors[0].message == 'Could not verify JWT: JWTExpired') {
                    this.token = null;
                    return await this.getGenerationStatus(generationId);
                }
            } else {
                if (data?.data.generations && data.data.generations.length > 0) {
                    return data?.data.generations[0];
                }
                return {status: "PENDING"};
            }
            
        } catch (error) {
            console.error("Error al intentar obtener el estado de la generación:", error);
        }
        return null;
    }

    async getGeneratedImages(generationId) {
        if (!this.token) {
            await this.getToken();
        }

        try {
            const response = await fetch("https://api.leonardo.ai/v1/graphql", {
                headers: {
                    "accept": "*/*",
                    "authorization": `Bearer ${this.token}`,
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "Referer": "https://app.leonardo.ai/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                body: JSON.stringify({
                "operationName": "GetAIGenerationFeed",
                "variables": {
                    "offset": 0,
                    "limit": 5
                },
                "query": `query GetAIGenerationFeed($where: generations_bool_exp = {}, $userId: uuid, $limit: Int, $offset: Int = 0) {
                generations(
                    limit: $limit
                    offset: $offset
                    order_by: [{ createdAt: desc }]
                    where: $where
                ) {
                    id
                    prompt
                    status
                    generated_images {
                        id
                        url
                    }
                }
                }`
            }),
                method: "POST"
            });

            const data = await response.json();
            if (data?.errors) {
                if (data.errors[0] && data.errors[0].message == 'Could not verify JWT: JWTExpired') {
                    this.token = null;
                    return await this.getGeneratedImages(generationId);
                }
            } else {
                let images = data?.data?.generations
                    .filter((generation) => generation.id === generationId);
                return images[0].generated_images;
            }
        } catch (error) {
            console.error("Error al intentar obtener las imágenes generadas:", error);
        }
        return null;
    }

    async generateImage(prompt) {
        const generationId = await this.createJob(prompt);
        if (!generationId) {
            return null;
        }

        let status;
        do {
            await new Promise((resolve) => setTimeout(resolve, 500));
            status = await this.getGenerationStatus(generationId);
            if (status && status.status === "FAILED") {
                return null;
            }
        } while (!status || status.status !== "COMPLETE");

        return await this.getGeneratedImages(status.id);
    }
}

module.exports = Leonardo;