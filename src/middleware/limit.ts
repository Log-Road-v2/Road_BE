import rateLimit from 'express-rate-limit';

export const apiLimit = rateLimit({
  windowMs: 1000 * 60,
  max: 5,
  handler(req, res) {
    res.status(429).json({
      message: '과도한 요청, 잠시 후 다시 시도하세요'
    });
  }
});

export const getApiLimit = rateLimit({
  windowMs: 1000 * 60,
  max: 10,
  handler(req, res) {
    res.status(429).json({
      message: '과도한 요청, 잠시 후 다시 시도하세요'
    });
  }
});
