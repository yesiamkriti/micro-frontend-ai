const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect();

const SESSION_PREFIX = 'session:';

const cacheSession = async (sessionId, sessionData) => {
  await redisClient.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(sessionData), {
    EX: 60 * 60, // 1 hour expiration
  });
};

const getCachedSession = async (sessionId) => {
  const data = await redisClient.get(`${SESSION_PREFIX}${sessionId}`);
  return data ? JSON.parse(data) : null;
};

const invalidateSessionCache = async (sessionId) => {
  await redisClient.del(`${SESSION_PREFIX}${sessionId}`);
};

module.exports = {
  cacheSession,
  getCachedSession,
  invalidateSessionCache,
};
