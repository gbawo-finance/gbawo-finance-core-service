import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    // Skip interceptor for health endpoints as they have their own format
    if (path.startsWith('/health')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // If the data is already in our standard format, return it as is
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'message' in data
        ) {
          return data;
        }

        // Otherwise, wrap it in our standard format
        return ApiResponseDto.success(data);
      }),
    );
  }
}
