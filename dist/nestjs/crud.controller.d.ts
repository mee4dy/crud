import { Response } from '../common/interfaces/response.interface';
import { CrudService } from './crud.service';
export declare abstract class CrudController {
    private readonly service;
    constructor(service: CrudService);
    private pk;
    items(query: any): Promise<Response>;
    item(pk: number): Promise<Response>;
    create(data: object): Promise<Response>;
    update(pk: number, data: object): Promise<Response>;
    delete(pk: number): Promise<Response>;
}
