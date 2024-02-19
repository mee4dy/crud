import { All, Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Response } from '../common/interfaces/response.interface';
import { CrudService } from './crud.service';

export abstract class CrudController {
  constructor(private readonly service: CrudService) {
    this.pk = this.service.getPK();
  }

  private pk;

  @Get('/')
  async items(@Query() query): Promise<Response> {
    const items = await this.service.getItems({
      query,
    });

    return {
      status: true,
      data: {
        items: items,
      },
    };
  }

  @Get('/:id')
  async item(@Param('id') id: number): Promise<Response> {
    const item = await this.service.findOne({
      where: {
        [this.pk]: id,
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
  async create(@Body('data') data: object): Promise<Response> {
    const item = await this.service.create(data);

    return {
      status: true,
      data: {
        item: item,
      },
    };
  }

  @Post('/update')
  async update(@Body('id') id: number, @Body('data') data: object): Promise<Response> {
    const item = await this.service.update(id, data);

    return {
      status: true,
      data: {
        item: item,
      },
    };
  }

  @Post('/delete')
  async delete(@Body('id') id: number): Promise<Response> {
    const result = await this.service.delete({
      [this.pk]: id,
    });

    return {
      status: true,
      data: {
        result: result,
      },
    };
  }
}
