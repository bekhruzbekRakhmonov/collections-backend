import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { StatusMessage } from '../http-status-message.enum';
import { ResponseInterface } from './response.interface';

class ApiResponse {
    constructor(private readonly response: Response) {}

    private send(data: any, statusCode: number): ResponseInterface {
        return this.response.status(statusCode).json({
            data: data,
            message: StatusMessage[statusCode],
            timestamp: new Date().toISOString(),
            path: this.response.req.url,
        });
    }

    statusCreated<TData>(data: TData = null): ResponseInterface {
        return this.send(data, HttpStatus.CREATED);
    }

    statusOK<TData>(data: TData = null): ResponseInterface {
        return this.send(data, HttpStatus.OK);
    }

    statusNoContent<TData>(data: TData = null): ResponseInterface {
        return this.send(data, HttpStatus.NO_CONTENT)
    }

    statusBadRequest<TData>(data: TData = null): ResponseInterface {
        return this.send(data, HttpStatus.BAD_REQUEST);
    }

    statusNotFound<TData>(data: TData = null): ResponseInterface {
        return this.send(data, HttpStatus.NOT_FOUND);
    }

    statusForbidden<TData>(data: TData = null): ResponseInterface {
        return this.send(data, HttpStatus.FORBIDDEN);
    }

    statusUnauthorized<TData>(data: TData = null): ResponseInterface {
        return this.send(data, HttpStatus.UNAUTHORIZED);
    }

    statusMethodNotAllowed<TData>(data: TData = null): ResponseInterface {
        return this.send(data, HttpStatus.METHOD_NOT_ALLOWED);
    }
}

const _old = ApiResponse;
export const APIResponse = (res: Response) => new _old(res);
