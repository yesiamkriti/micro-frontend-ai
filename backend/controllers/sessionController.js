const Session = require('../models/Session');

exports.createSession = async (req, res) => {
  try {
    const { sessionName } = req.body;
    const session = await Session.create({
      userId: req.user.id,
      sessionName,
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: 'Could not create session', message: err.message });
  }
};

exports.getSessionsByUser = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch sessions' });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load session' });
  }
};

exports.updateSession = async (req, res) => {
  await invalidateSessionCache(req.params.id);

  try {
    const updated = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update session' });
  }
};
