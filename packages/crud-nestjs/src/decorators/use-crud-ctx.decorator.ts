import { applyDecorators } from '@nestjs/common';
import { UseMiddleware } from './use-middleware.decorator';

export const UseCrudCtx = (callback) => {
  const middlewareDecorator = UseMiddleware((req) => {
    const crudCtx = callback(req);

    if (!req.crudCtx) {
      req.crudCtx = {};
    }

    req.crudCtx = {
      ...req.crudCtx,
      ...crudCtx,
    };
  });

  return applyDecorators(middlewareDecorator);
};
