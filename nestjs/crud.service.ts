import { Model, Op, Sequelize } from 'sequelize';
import { FilterType } from '../common/enums/filter-type.enum';
import { OrderDirection } from '../common/enums/order-direction.enum';
import { Order } from '../common/interfaces/order.interface';
import { Filter } from '../common/interfaces/filter.interface';
import { merge } from '../common/helpers/merge.helper';

export abstract class CrudService {
  constructor(params?) {
    if (params) {
      Object.assign(this, { ...params });
    }
  }

  protected pk: string = 'id';
  protected repository;
  protected limit: number;
  protected allowFilters: Filter[] = [{ key: 'pk' }];
  protected allowGroups: string[] = [];
  protected allowOrders: string[] = ['pk'];
  protected defaultGroups: string[] = ['pk'];
  protected defaultOrders: Order[] = [['pk', OrderDirection.desc]];
  protected fields;
  protected fieldsAdditional;

  getPK() {
    return this.pk;
  }

  getRepository() {
    return this.repository;
  }

  getFields(groups: string[] = []) {
    const repositoryAttributes = this.repository.getAttributes();
    const fieldsDefault = this.fields || Object.keys(repositoryAttributes).map((attr) => [attr, attr]);
    const fieldsAdditional = this.fieldsAdditional || [];
    const serviceFields = [...fieldsDefault, ...fieldsAdditional];
    let fields: any = [];

    if (serviceFields) {
      for (let [fieldQuery, fieldName] of serviceFields) {
        if (this.allowGroups.includes(fieldName)) {
          if (groups.length && groups.includes(fieldName)) {
            fields.push([fieldQuery, fieldName]);
          }
        } else {
          fields.push([fieldQuery, fieldName]);
        }
      }
    }

    return fields;
  }

  getFilters(query) {
    const filters = [];
    const queryFilters = query.filters;

    if (queryFilters) {
      for (const filter of this.allowFilters) {
        const filterType = filter.type;
        const filterKey = filter.key === 'pk' ? this.pk : filter.key;
        const filterValue = queryFilters?.[filterKey];
        const filterValueFrom = queryFilters?.[`${filterKey}_from`];
        const filterValueTo = queryFilters?.[`${filterKey}_to`];
        const field = (this.fields || []).find(([select, key]) => key === filterKey); // Custom field
        let whereField = field ? field[0] : this.repository.sequelize.col(`${this.repository.name}.${filterKey}`);
        let whereValue: any;

        switch (filterType) {
          case FilterType.text:
            if (filterValue) {
              whereValue = {
                [Op.like]: `%${filterValue}%`,
              };
            }
            break;

          case FilterType.period:
            whereValue = {};

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
              whereValue = {
                [Op.eq]: filterValue,
              };
            }
            break;
        }

        if (whereField && whereValue) {
          filters.push(this.repository.sequelize.where(whereField, whereValue));
        }
      }
    }

    return filters;
  }

  getGroups(query) {
    const groups: any = [];
    const queryGroups = (query.groups || this.defaultGroups).map((key) => (key === 'pk' ? this.pk : key));

    if (queryGroups) {
      for (let key of this.allowGroups) {
        const fieldKey = key === 'pk' ? this.pk : key;

        if (queryGroups.includes(fieldKey)) {
          groups.push(fieldKey);
        }
      }
    }

    return groups;
  }

  getOrders(query) {
    const orders = [];
    const queryOrders = query.orders
      ? Object.entries(query.orders).map(([key, direction]) => [key, direction])
      : this.defaultOrders;
    const groups = this.getGroups(query);
    const fields = this.getFields(groups).map((field) => field[1]);

    if (queryOrders) {
      for (let key of this.allowOrders) {
        const fieldKey = key === 'pk' ? this.pk : key;
        const fieldInSelect = !fields.length || fields.includes(fieldKey);

        const order = queryOrders
          .map(([field, direction]) => {
            if (field === 'pk') {
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

  getLimit(query) {
    if (query?.limit) {
      return +query.limit;
    }

    return this.limit;
  }

  getOffset(query) {
    return +query?.offset || 0;
  }

  getIncludes(query) {
    const includes = query.includes || [];

    return includes;
  }

  findAll(...args: any) {
    return this.repository.findAll(...args);
  }

  findOne(...args: any) {
    return this.repository.findOne(...args);
  }

  getFindParams({ ctx, query }) {
    const filters = this.getFilters(query);
    const includes = this.getIncludes(query);
    const orders = this.getOrders(query);
    const groups = this.getGroups(query);
    const fields = this.getFields(groups);
    const limit = this.getLimit(query);
    const offset = this.getOffset(query);
    const findParamsCtx = ctx?.findParams || {};

    return merge(
      {
        attributes: fields.length ? fields : undefined,
        include: includes,
        limit: limit,
        offset: offset,
        where: filters.length ? filters : undefined,
        order: orders,
        group: groups,
      },
      findParamsCtx
    );
  }

  getItems({ ctx, query }: { ctx?; query }) {
    const findParams = this.getFindParams({ ctx, query });

    return this.findAll({
      ...findParams,
    });
  }

  getItem({ ctx, query }: { ctx?; query }) {
    const findParams = this.getFindParams({ ctx, query });

    return this.findOne({
      ...findParams,
    });
  }

  create(data: object) {
    return this.repository.create({
      ...data,
    });
  }

  update(pk: number, data: object, returning: boolean = true) {
    return this.repository
      .update(data, {
        where: {
          [this.pk]: pk,
        },
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
