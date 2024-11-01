import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import i18n from './i18n.setup';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const lang = req.headers['accept-language']?.split(',')[0] || 'en';
    i18n.changeLanguage(lang);
    next();
  }
}
