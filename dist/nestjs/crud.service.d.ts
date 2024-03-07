import { Order } from '../common/interfaces/order.interface';
import { Filter } from '../common/interfaces/filter.interface';
export declare abstract class CrudService {
    constructor(params?: any);
    protected pk: string;
    protected repository: any;
    protected limit: any;
    protected allowFilters: Filter[];
    protected allowGroups: string[];
    protected allowOrders: string[];
    protected defaultGroups: string[];
    protected defaultOrders: Order[];
    protected fields: any;
    getPK(): string;
    getFields(groups?: string[]): any;
    getFilters(query: any): any[];
    getGroups(query: any): any;
    getOrders(query: any): any[];
    findAll(...args: any): any;
    findOne(...args: any): any;
    getFindParams({ query }: {
        query: any;
    }): {
        attributes: any;
        limit: any;
        where: any[];
        order: any[];
        group: any;
    };
    getItems({ query }: {
        query: any;
    }): any;
    getItem({ query }: {
        query: any;
    }): any;
    create(data: object): any;
    update(pk: number, data: object, returning?: boolean): any;
    delete(where?: any): any;
}
