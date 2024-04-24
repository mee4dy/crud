import { applyDecorators } from '@nestjs/common';
import { UseMiddleware } from './use-middleware.decorator';

export const UseCrudCtx = (callback) => {
  const middlewareDecorator = UseMiddleware((req) => {
    const crudCtx = callback(req);

    if (!req.crud) {
      req.crud = {};
    }

    req.crud = {
      ...req.crud,
      ...crudCtx,
    };
  });

  return applyDecorators(middlewareDecorator);
};
