import { All, Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Response } from '../common/interfaces/response.interface';
import { CrudService } from './crud.service';
import { CrudCtx } from './decorators/crud-ctx.decorator';

export abstract class CrudController {
  constructor(private readonly service: CrudService) {
    this.pk = this.service.getPK();
  }

  private pk;

  @Get('/')
  async items(@CrudCtx() { params }, @Query() query): Promise<Response> {
    const items = await this.service.getItems({
      params,
      query,
    });

    return {
      status: true,
      data: {
        items: items,
      },
    };
  }

  @Get('/:pk')
  async item(@CrudCtx() { params }, @Param('pk') pk: number): Promise<Response> {
    const item = await this.service.getItem({
      params,
      query: {
        filters: {
          [this.pk]: pk,
        },
      },
    });

    return {
      status: true,
      data: {
        item: item,
      },
    };
  }

  @Post('/create')
  async create(@CrudCtx() { params }, @Body('data') data: object): Promise<Response> {
    const item = await this.service.create(data);

    return {
      status: true,
      data: {
        item: item,
      },
    };
  }

  @Post('/update')
  async update(@CrudCtx() { params }, @Body('pk') pk: number, @Body('data') data: object): Promise<Response> {
    const item = await this.service.update(pk, data);

    return {
      status: true,
      data: {
        item: item,
      },
    };
  }

  @Post('/delete')
  async delete(@CrudCtx() { params }, @Body('pk') pk: number): Promise<Response> {
    const result = await this.service.delete({
      [this.pk]: pk,
    });

    return {
      status: true,
      data: {
        result: result,
      },
    };
  }
}
