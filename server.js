// server.js
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');

// 1. It is recommended to obtain the API key from environment variables
//    While hardcoding works during development, in production, manage it securely in .env files or other methods.
const OPENAI_API_KEY = 'YOUR_API_KEY';

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json()); // Required to handle JSON requests

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'public')));

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message || '';

    // 2. Use the ChatCompletion endpoint
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a chatbot that provides helpful information in response to the user\'s questions.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 512,
    });

    // 3. Extract the assistant's reply
    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
