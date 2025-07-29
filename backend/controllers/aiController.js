const {
  cacheSession,
  getCachedSession,
  invalidateSessionCache,
} = require('../services/redisService');

exports.generateCode = async (req, res) => {
  try {
    const { prompt, sessionId } = req.body;

    // Try Redis first
    let session = await getCachedSession(sessionId);

    if (!session) {
      const dbSession = await Session.findOne({ _id: sessionId, userId: req.user.id });
      if (!dbSession) return res.status(404).json({ message: 'Session not found' });

      session = dbSession.toObject();
    }

    const context = session.chatHistory.map(({ role, message }) => ({
      role,
      parts: [{ text: message }],
    }));

    const aiResponse = await generateComponentFromPrompt(prompt, context);

    const jsxMatch = aiResponse.match(/```(?:tsx|jsx)?\\n([\\s\\S]*?)```/);
    const cssMatch = aiResponse.match(/```css\\n([\\s\\S]*?)```/);

    const jsx = jsxMatch ? jsxMatch[1].trim() : '';
    const css = cssMatch ? cssMatch[1].trim() : '';

    session.chatHistory.push({ role: 'user', message: prompt });
    session.chatHistory.push({ role: 'ai', message: aiResponse });
    session.componentCode = { jsx, css };

    // Save to DB + Redis
    await Session.findByIdAndUpdate(sessionId, {
      chatHistory: session.chatHistory,
      componentCode: session.componentCode,
    });
    await cacheSession(sessionId, session);

    res.json({ jsx, css, chatHistory: session.chatHistory });
  } catch (err) {
    res.status(500).json({ message: 'AI generation failed', error: err.message });
  }
};
