require("dotenv").config();
const express = require("express");
const OpenAI=require( 'openai');
const cors=require('cors');

const app = express();
app.use(express.json());
const apiKey=process.env.VUE_APP_OPENAI_API_KEY;

const openai =  new OpenAI({
   apiKey:apiKey
  });
  app.use(cors())



const port = process.env.PORT || 5000;

app.post("/ask", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    console.log(prompt);
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }

    const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt,
        max_tokens: 1000,
      });

    const completion = response.choices[0].text;

    return res.status(200).json({
      success: true,
      message: completion,
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
        console.error(error.status);  // e.g. 401
        console.error(error.message); // e.g. The authentication token you passed was indataid...
        console.error(error.code);  // e.g. 'indataid_api_key'
        console.error(error.type);  // e.g. 'indataid_request_error'
      } else {
        // Non-API error
        console.log(error);
      }
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}!!`));