import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

declare module 'express' {
  interface Request {
    realIp?: string;
  }
}

@Injectable()
export class CloudflareIpMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const cfConnectingIp = req.headers['cf-connecting-ip'];
    const xForwardedFor = req.headers['x-forwarded-for'];
    const xRealIp = req.headers['x-real-ip'];

    if (cfConnectingIp) {
      req.realIp = Array.isArray(cfConnectingIp)
        ? cfConnectingIp[0]
        : cfConnectingIp;
    } else if (xForwardedFor) {
      const ips = Array.isArray(xForwardedFor)
        ? xForwardedFor[0]
        : xForwardedFor;
      req.realIp = ips.split(',')[0].trim();
    } else if (xRealIp) {
      req.realIp = Array.isArray(xRealIp) ? xRealIp[0] : xRealIp;
    }

    next();
  }
}
