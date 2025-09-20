import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api-response.dto';

/**
 * Standardized API Response decorator that wraps responses in ApiResponseDto format
 */
export function ApiStandardResponse<T>(
  status: number,
  description: string,
  dataType?: Type<T> | Type<T>[],
  options?: Partial<ApiResponseOptions>
) {
  const example = {
    success: status >= 200 && status < 300,
    message: description,
    data: dataType ? {} : null, // Will be replaced with actual data structure
  };

  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: example.success,
            description: 'Indicates if the request was successful',
          },
          message: {
            type: 'string',
            example: description,
            description: 'Human-readable message describing the result',
          },
          data: dataType
            ? Array.isArray(dataType)
              ? {
                  type: 'array',
                  items: { $ref: `#/components/schemas/${dataType[0].name}` },
                  description: 'Array of response data',
                }
              : {
                  $ref: `#/components/schemas/${dataType.name}`,
                  description: 'Response data object',
                }
            : {
                type: 'null',
                description: 'No data returned',
              },
        },
        required: ['success', 'message'],
      },
      ...options,
    })
  );
}

/**
 * Standardized Success Response decorator
 */
export function ApiSuccessResponse<T>(
  description: string,
  dataType?: Type<T> | Type<T>[],
  status: number = 200
) {
  return ApiStandardResponse(status, description, dataType);
}

/**
 * Standardized Error Response decorator
 */
export function ApiErrorResponse(
  status: number,
  description: string,
  errorDataType?: Type<any>
) {
  const example = {
    success: false,
    message: description,
    data: errorDataType ? {} : null,
  };

  return ApiResponse({
    status,
    description,
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
          description: 'Always false for error responses',
        },
        message: {
          type: 'string',
          example: description,
          description: 'Error message describing what went wrong',
        },
        data: errorDataType
          ? {
              $ref: `#/components/schemas/${errorDataType.name}`,
              description: 'Additional error details',
            }
          : {
              type: 'null',
              description: 'No additional error data',
            },
      },
      required: ['success', 'message'],
    },
  });
}

/**
 * Common error responses that can be reused across controllers
 */
export const CommonApiResponses = {
  BadRequest: ApiErrorResponse(400, 'Bad Request - Invalid input data'),
  Unauthorized: ApiErrorResponse(401, 'Unauthorized - Authentication required'),
  Forbidden: ApiErrorResponse(403, 'Forbidden - Access denied'),
  NotFound: ApiErrorResponse(404, 'Not Found - Resource not found'),
  Conflict: ApiErrorResponse(409, 'Conflict - Resource already exists'),
  InternalServerError: ApiErrorResponse(500, 'Internal Server Error'),
  ValidationError: ApiErrorResponse(400, 'Validation failed'),
};
