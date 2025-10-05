import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

export function ApiSuccessResponse(options: ApiResponseOptions) {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Success',
      ...options,
    }),
  );
}

export function ApiCreatedResponse(options: ApiResponseOptions) {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Created successfully',
      ...options,
    }),
  );
}

export function ApiBadRequestResponse(description: string = 'Bad Request') {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description,
    }),
  );
}

export function ApiUnauthorizedResponse(description: string = 'Unauthorized') {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description,
    }),
  );
}

export function ApiForbiddenResponse(description: string = 'Forbidden') {
  return applyDecorators(
    ApiResponse({
      status: 403,
      description,
    }),
  );
}

export function ApiNotFoundResponse(description: string = 'Not Found') {
  return applyDecorators(
    ApiResponse({
      status: 404,
      description,
    }),
  );
}

export function ApiConflictResponse(description: string = 'Conflict') {
  return applyDecorators(
    ApiResponse({
      status: 409,
      description,
    }),
  );
}

export function ApiInternalServerErrorResponse(description: string = 'Internal Server Error') {
  return applyDecorators(
    ApiResponse({
      status: 500,
      description,
    }),
  );
}
