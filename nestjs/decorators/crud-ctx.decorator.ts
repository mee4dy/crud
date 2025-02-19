import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CrudCtx as CrudContext } from '../interfaces/crud-ctx.interface';

export const CrudCtx = createParamDecorator((data: unknown, ctx: ExecutionContext): CrudContext => {
  const request = ctx.switchToHttp().getRequest();

  return request.crudCtx;
});
