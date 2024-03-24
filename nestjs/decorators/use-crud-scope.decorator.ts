import { applyDecorators } from '@nestjs/common';
import { UseMiddleware } from './use-middleware.decorator';

export const UseCrudScope = (callback) => {
  const middlewareDecorator = UseMiddleware((req) => {
    const crudScope = callback(req);

    if (!req.crud) {
      req.crud = {};
    }

    req.crud.findParams = {
      ...req.crud.findParams,
      ...crudScope,
    };
  });

  return applyDecorators(middlewareDecorator);
};
