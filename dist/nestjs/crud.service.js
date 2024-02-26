"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudService = void 0;
const sequelize_1 = require("sequelize");
const filter_type_enum_1 = require("../common/enums/filter-type.enum");
const order_direction_enum_1 = require("../common/enums/order-direction.enum");
class CrudService {
    constructor(params) {
        this.pk = 'id';
        this.allowFilters = [{ key: 'pk' }];
        this.allowGroups = ['pk'];
        this.allowOrders = ['pk'];
        this.defaultGroups = ['pk'];
        this.defaultOrders = [['pk', order_direction_enum_1.OrderDirection.desc]];
        if (params) {
            Object.assign(this, { ...params });
        }
    }
    getPK() {
        return this.pk;
    }
    getFields(groups = []) {
        let fields = [];
        if (this.fields) {
            for (let [fieldQuery, fieldName] of this.fields) {
                if (this.allowGroups.includes(fieldName)) {
                    if (groups.length && groups.includes(fieldName)) {
                        fields.push([fieldQuery, fieldName]);
                    }
                }
                else {
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
                const filterKey = filter.key === 'pk' ? this.pk : filter.key;
                const filterValue = queryFilters === null || queryFilters === void 0 ? void 0 : queryFilters[filterKey];
                const filterValueFrom = queryFilters === null || queryFilters === void 0 ? void 0 : queryFilters[`${filterKey}_from`];
                const filterValueTo = queryFilters === null || queryFilters === void 0 ? void 0 : queryFilters[`${filterKey}_to`];
                const field = (this.fields || []).find(([select, key]) => key === filterKey); // Custom field
                let whereField = field ? field[0] : this.repository.sequelize.col(filterKey);
                let whereValue;
                if (filterValue) {
                    whereValue = {
                        [sequelize_1.Op.eq]: filterValue,
                    };
                    if (filter.type === filter_type_enum_1.FilterType.text) {
                        whereValue = {
                            [sequelize_1.Op.like]: `%${filterValue}%`,
                        };
                    }
                }
                if (filterValueFrom || filterValueTo) {
                    if (filter.type === filter_type_enum_1.FilterType.period) {
                        whereValue = {
                            [sequelize_1.Op.gte]: filterValueFrom,
                            [sequelize_1.Op.lte]: filterValueTo,
                        };
                    }
                }
                if (whereField && whereValue) {
                    filters.push(this.repository.sequelize.where(whereField, whereValue));
                }
            }
        }
        return filters;
    }
    getGroups(query) {
        const groups = [];
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
    findAll(...args) {
        return this.repository.findAll(...args);
    }
    findOne(...args) {
        return this.repository.findOne(...args);
    }
    getFindParams({ query }) {
        const filters = this.getFilters(query);
        const orders = this.getOrders(query);
        const groups = this.getGroups(query);
        const fields = this.getFields(groups);
        const limit = this.limit;
        return {
            attributes: fields.length ? fields : undefined,
            limit: limit,
            where: filters,
            order: orders,
            group: groups,
        };
    }
    getItems({ query }) {
        const findParams = this.getFindParams({ query });
        return this.findAll({
            ...findParams,
        });
    }
    getItem({ query }) {
        const findParams = this.getFindParams({ query });
        return this.findAll({
            ...findParams,
        });
    }
    create(data) {
        return this.repository.create({
            ...data,
        });
    }
    update(id, data, returning = true) {
        return this.repository
            .update(data, {
            where: {
                [this.pk]: id,
            },
        })
            .then((result) => {
            if (returning) {
                return this.findOne({
                    [this.pk]: id,
                });
            }
            return result;
        });
    }
    delete(where) {
        return this.repository.destroy({
            where,
        });
    }
}
exports.CrudService = CrudService;
//# sourceMappingURL=crud.service.js.map