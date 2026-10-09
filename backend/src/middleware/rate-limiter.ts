import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 1000; // 1000 requests per minute per IP for high-concurrency stress tolerance

/**
 * In-memory rate limiting middleware
 */
export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "global-client";
  const now = Date.now();

  if (!store[ip] || now > store[ip].resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
  } else {
    store[ip].count += 1;
  }

  res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
  res.setHeader("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - store[ip].count));

  if (store[ip].count > MAX_REQUESTS) {
    res.status(429).json({
      success: false,
      error: "Too Many Requests. Rate limit exceeded. Please wait a minute before retrying.",
    });
    return;
  }

  next();
}
