require("dotenv").config();
const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const apiKey = process.env.GEMINI_API_KEY; 
const ai = new GoogleGenAI({apiKey:apiKey});

const port = process.env.PORT || 5000;

app.post("/ask", async (req, res) => {
  // The user's input (e.g., "A robot who loves to garden")
  const userInput = req.body.prompt;

  try {
    console.log(`Received user input for story: ${userInput}`);
    if (!userInput) {
      throw new Error("Uh oh, no input was provided to start the story");
    }

    // --- The key change is here: Constructing the System and User Prompts ---

    // 1. Define the story instruction for the model (System/Preamble)
    const storyInstruction = `You are a creative storyteller. Based on the following user input, write a short, compelling, and descriptive story. Ensure the story has a clear beginning, middle, and end. The story should be around 200 words.`;
    
    // 2. Combine the instruction and the user's input into the final prompt
    const fullPrompt = `${storyInstruction}\n\nUser Input/Concept: "${userInput}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // Pass the fully constructed prompt to the model
      contents: [fullPrompt], 
      config: {
        // Increase maxOutputTokens to ensure the story has enough room to breathe
        maxOutputTokens: 2000, 
        temperature: 0.8, // Use a higher temperature for more creative, varied stories
      }
    });

    const completion = response.text;

    if (!completion) {
      return res.status(500).json({
        success: false,
        message: "Gemini returned no response text for the story.",
      });
    }

    return res.status(200).json({
      success: true,
      message: completion,
    });
  } catch (error) {
    console.error("An error occurred while creating the story:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while trying to create your story.",
    });
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}!!`));