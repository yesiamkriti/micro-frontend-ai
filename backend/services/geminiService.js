const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const generateComponentFromPrompt = async (prompt, context = []) => {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          ...context,
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || 'No output from AI.';
  } catch (error) {
    console.error('Gemini error:', error?.response?.data || error.message);
    throw new Error('Gemini AI failed to respond.');
  }
};

module.exports = generateComponentFromPrompt;
