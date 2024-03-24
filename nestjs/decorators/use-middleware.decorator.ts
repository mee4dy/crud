import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors, applyDecorators } from '@nestjs/common';
import { Observable } from 'rxjs';

class CrudInterceptor implements NestInterceptor {
  constructor(middleware) {
    this.middleware = middleware;
  }

  private middleware;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (this.middleware) {
      this.middleware(req);
    }

    return next.handle();
  }
}

export const UseMiddleware = (middleware: any) => {
  const crudInterceptor = new CrudInterceptor(middleware);
  const interceptorDecorator = UseInterceptors(crudInterceptor);

  return applyDecorators(interceptorDecorator);
};
