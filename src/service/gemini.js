import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fileToGenerativePart(image, mimeType) {
    return {
        inlineData: {
            data: image,
            mimeType
        },
    };
}

export const imgToResponse = async (image) => {
    const img = image.split(';')[1].split(',')[1];
    const mimeType = image.split(';')[0].split(':')[1];
    const result = fileToGenerativePart(img, mimeType);

    const prompt = "What is the main thing in the given image. Just give me the nane of that main thing in that image like as if you see apple in the image just give apple in the response not any other thing. Don't add full stop in the end.";

    const imageParts = [
        result
    ];

    const generatedContent = await model.generateContent([prompt, ...imageParts]);
    const value = generatedContent.response.text()
    return value;   
}