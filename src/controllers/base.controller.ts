import { Request, Response, NextFunction } from 'express';

export abstract class BaseController {
  protected sendResponse<T>(res: Response, statusCode: number, data: T) {
    return res.status(statusCode).json(data);
  }

  protected sendError(res: Response, statusCode: number, message: string) {
    return res.status(statusCode).json({ message });
  }

  protected getUserIdOrThrow(req: Request): string {
    if (!req.user || !req.user.id) {
      throw new Error('Unauthorized');
    }
    return req.user.id;
  }

  protected handleError(err: unknown, res: Response, next?: NextFunction) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}