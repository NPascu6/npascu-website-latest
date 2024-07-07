import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
const apiKey = import.meta.env.VITE_API_KEY;
// Reminder: This should only be for local testing

// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(apiKey);

// ...

// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const openai = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    "Content-Type": "application/json",
    //Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    Authorization: `Bearer`,
  },
});

const gemini = axios.create({
  baseURL: "https://api.google.com/gemini/v1", // Update with the correct base URL for Google Gemini
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
});

export const getResponse = async (prompt: any) => {
  const response = await gemini.post("/chat/completions", {
    model: "gemini-1", // or the correct model identifier for Google Gemini
    messages: [
      {
        role: "user",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
    ],
  });
  return response.data.choices[0].message.content;
};
