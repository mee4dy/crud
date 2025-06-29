import { Op, Model, ModelStatic } from 'sequelize';
import { FilterType } from '../common/enums/filter-type.enum';
import { OrderDirection } from '../common/enums/order-direction.enum';
import { Order } from '../common/interfaces/order.interface';
import { Filter } from '../common/interfaces/filter.interface';
import { merge } from '../common/helpers/merge.helper';
import { FindParams } from './interfaces/find-params.interface';
import { PK } from '../common/constatns/constatns';

export abstract class CrudService<T extends Model> {
  constructor(params?) {
    if (params) {
      Object.assign(this, { ...params });
    }
  }

  protected pk: string = 'id';
  protected repository: ModelStatic<T>;
  protected limit: number;
  protected allowFilters: Filter[] = [{ key: PK }];
  protected allowGroups: string[] = [];
  protected allowOrders: string[] = [PK];
  protected defaultGroups: string[] = [PK];
  protected defaultOrders: Order[] = [[PK, OrderDirection.desc]];
  protected fields;
  protected fieldsExclude: string[];

  getPK(): string {
    return this.pk;
  }

  getRepository(): ModelStatic<T> {
    return this.repository;
  }

  getFields(groups: string[] = []): { include: any; exclude: any } {
    const fields = this.fields || [];
    const fieldsExclude = this.fieldsExclude || [];
    const fieldsInclude: any = [];

    for (const [fieldQuery, fieldName] of fields) {
      if (this.allowGroups.includes(fieldName)) {
        if (groups.length && groups.includes(fieldName)) {
          fieldsInclude.push([fieldQuery, fieldName]);
        } else {
          fieldsExclude.push(fieldName);
        }
      } else {
        fieldsInclude.push([fieldQuery, fieldName]);
      }
    }

    return {
      include: fieldsInclude,
      exclude: fieldsExclude,
    };
  }

  getQueryFilters(queryFilters: object) {
    const filters = structuredClone(queryFilters);

    if (filters?.[PK]) {
      filters[this.pk] = filters[PK];
      delete filters[PK];
    }

    return filters;
  }

  getAllowFilters(): Filter[] {
    const allowFilters = structuredClone(this.allowFilters);

    return allowFilters.map((filter) => {
      return {
        ...filter,
        key: filter.key === PK ? this.pk : filter.key,
      };
    });
  }

  getAllowOrders(): string[] {
    const allowOrders = this.allowOrders;

    return allowOrders.map((key) => {
      return key === PK ? this.pk : key;
    });
  }

  getFilters(query) {
    const filters = [];
    const queryFilters = this.getQueryFilters(query.filters);
    const allowFilters = this.getAllowFilters();

    if (queryFilters) {
      for (const { key, field, type } of allowFilters) {
        const filterKey = key;
        const filterFiled = field || filterKey;
        const filterValue = queryFilters?.[filterKey];
        const filterValueFrom = queryFilters?.[`${filterFiled}_from`];
        const filterValueTo = queryFilters?.[`${filterFiled}_to`];
        const filterField = (this.fields || []).find(([select, fieldKey]) => fieldKey === filterFiled); // Custom field
        let whereField = filterField
          ? filterField[0]
          : this.repository.sequelize.col(`${this.repository.name}.${filterFiled}`);
        const whereValue: any = {};

        switch (type) {
          case FilterType.text:
            if (filterValue) {
              whereValue[Op.like] = `%${filterValue}%`;
            }
            break;

          case FilterType.period:
          case FilterType.range:
            if (filterValueFrom) {
              whereValue[Op.gte] = filterValueFrom;
            }

            if (filterValueTo) {
              whereValue[Op.lte] = filterValueTo;
            }
            break;

          case FilterType.number:
          default:
            if (filterValue) {
              whereValue[Op.eq] = filterValue;
            }
            break;
        }

        if (whereField && Reflect.ownKeys(whereValue).length) {
          filters.push(this.repository.sequelize.where(whereField, whereValue));
        }
      }
    }

    return filters;
  }

  getGroups(query) {
    const groups: any = [];
    const queryGroups = (query.groups || this.defaultGroups).map((key) => (key === PK ? this.pk : key));

    if (queryGroups) {
      for (let key of this.allowGroups) {
        const fieldKey = key === PK ? this.pk : key;

        if (queryGroups.includes(fieldKey)) {
          groups.push(fieldKey);
        }
      }
    }

    return groups;
  }

  getOrders(query) {
    const orders = [];
    const allowOrders = this.getAllowOrders();
    const queryOrders = query.orders
      ? Object.entries(query.orders).map(([key, direction]) => [key, direction])
      : this.defaultOrders;
    const groups = this.getGroups(query);
    const fields = this.getFields(groups);
    const fieldNames = fields.include.map((field) => field[1]);

    if (queryOrders) {
      for (const key of allowOrders) {
        const fieldKey = key;
        const fieldInSelect = !fieldNames.length || fieldNames.includes(fieldKey);

        const order = queryOrders
          .map(([field, direction]) => {
            if (field === PK) {
              field = this.pk;
            }

            return [field, direction];
          })
          .find(([field, direction]) => {
            return field === fieldKey;
          });

        if (order && fieldInSelect) {
          orders.push(order);
        }
      }
    }

    return orders;
  }

  getLimit(query): number {
    if (query?.limit) {
      return +query.limit;
    }

    return this.limit;
  }

  getOffset(query): number {
    return +query?.offset || 0;
  }

  getIncludes(query) {
    const includes = query.includes || [];

    return includes;
  }

  findAll({ scope, ...params }: FindParams) {
    return this.repository.scope(scope).findAll(params as object);
  }

  findOne({ scope, ...params }: FindParams) {
    return this.repository.scope(scope).findOne(params as object);
  }

  getFindParams({ params, query }): FindParams {
    const filters = this.getFilters(query);
    const includes = this.getIncludes(query);
    const orders = this.getOrders(query);
    const groups = this.getGroups(query);
    const fields = this.getFields(groups);
    const limit = this.getLimit(query);
    const offset = this.getOffset(query);
    const findParams = params || {};
    const findParamsBase = {
      attributes: {
        include: fields?.include?.length ? fields?.include : [],
        exclude: fields?.exclude?.length ? fields?.exclude : [],
      },
      include: includes,
      scope: ['defaultScope'],
      limit: limit,
      offset: offset,
      where: filters.length ? filters : undefined,
      order: orders,
      group: groups,
    };

    return merge(findParamsBase, findParams);
  }

  getItems({ params, query }: { params?; query? }) {
    const findParams = this.getFindParams({ params, query });

    return this.findAll({
      ...findParams,
    });
  }

  getItem({ params, query }: { params?; query? }) {
    const findParams = this.getFindParams({ params, query });

    return this.findOne({
      ...findParams,
    });
  }

  create(data: object) {
    return this.repository.create(data as any);
  }

  update(pk: number, data: object, returning: boolean = true) {
    return this.repository
      .update(data, {
        where: {
          [this.pk]: pk,
        } as any,
      })
      .then((result: any) => {
        if (returning) {
          return this.findOne({
            where: {
              [this.pk]: pk,
            },
          });
        }

        return result;
      });
  }

  delete(where?) {
    return this.repository.destroy({
      where,
    });
  }
}
