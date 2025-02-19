import { applyDecorators } from '@nestjs/common';
import { UseMiddleware } from './use-middleware.decorator';

export const UseCrudScope = (callback) => {
  const middlewareDecorator = UseMiddleware((req) => {
    const crudScope = callback(req);

    if (!req.crudCtx) {
      req.crudCtx = {};
    }

    req.crudCtx.params = {
      ...req.crudCtx.params,
      ...crudScope,
    };
  });

  return applyDecorators(middlewareDecorator);
};
