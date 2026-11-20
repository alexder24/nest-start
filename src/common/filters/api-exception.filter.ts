import { STATUS_CODES } from 'node:http';
import {
  Catch,
  ConflictException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const error = this.toHttpException(exception);
    const statusCode = error.getStatus();
    const body = error.getResponse();

    let message = [error.message];

    if (typeof body === 'string') {
      message = [body];
    } else if ('message' in body && Array.isArray(body.message)) {
      message = body.message.filter((item) => typeof item === 'string');
    }

    response.status(statusCode).json({
      statusCode,
      error: STATUS_CODES[statusCode] ?? 'Error',
      message,
    });
  }

  private toHttpException(exception: unknown): HttpException {
    if (exception instanceof HttpException) {
      return exception;
    }

    if (exception instanceof QueryFailedError) {
      const { driverError } = exception;

      if ('code' in driverError && driverError.code === '23505') {
        return new ConflictException('Логин или email уже занят');
      }
    }

    return new InternalServerErrorException();
  }
}
