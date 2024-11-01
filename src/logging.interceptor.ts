import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    this.logger.log(`Request: ${method} ${url}`);

    const now = Date.now();

    return next.handle().pipe(
      tap(() =>
        this.logger.log(`Response: ${method} ${url} - ${Date.now() - now}ms}`),
      ),
      catchError((error) => {
        this.logger.error(
          `Error: ${method} ${url} - ${Date.now() - now}ms - ${error.message}`,
          error.stack,
        );
        throw error;
      }),
    );
  }
}
