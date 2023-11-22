import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let status: number = HttpStatus.BAD_REQUEST;
        let message: string | object = exception.message;
        if (Object.hasOwn(exception, 'response')) {
            status = exception.getStatus();
            message = exception.getResponse();
        }

        if (typeof message === 'object') {
            response.status(status).json({
                ...message,
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        } else {
            response.status(status).json({
                statusCode: status,
                message: message,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
    }
}
