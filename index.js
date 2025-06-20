import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

app.post("/api/chat", async (req, res) => {
  const { userMessage } = req.body.message;

  if (!userMessage)
    return res.status(400).json({ reply: "Please provide a message" });
  try {
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.log(error);
    res.status(500).json({ reply: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Gemini chatbot running on http://localhost:${port}`);
});
