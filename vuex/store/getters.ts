import { replacePKItems } from '../../common/helpers/pk.helper';
import { ORM } from '../orm';
import * as _ from 'lodash';

export default {
  getState: (state) => (path) => {
    return _.get(state, path);
  },
  getCtx: (state) => {
    return state.ctx;
  },
  getPK: (state) => {
    return state.pk;
  },
  getItems: (state, getters, globalState, globalGetters) => {
    const includes = getters.getIncludes;

    return state.items.map((item) => {
      item.pk = item[state.pk];

      for (const include of includes) {
        if (item[include]) {
          const includePK = globalGetters[`${include}/getPK`];

          if (includePK) {
            replacePKItems(item[include], includePK);
          }
        }
      }

      return item;
    });
  },
  getItemsORM: (state, getters) => {
    if (!getters.getCtx) {
      return [];
    }

    const { dispatch, commit } = getters.getCtx;
    const items = _.cloneDeep(getters.getItems);
    const includes = getters.getIncludes;

    const itemsORM = new ORM(
      items,
      'pk',
      {
        update({ pk, data, level }) {
          return dispatch('update', { pk, data, level });
        },
        commit({ pk, data, level }) {
          return commit('update', { pk, data, level });
        },
        delete({ pk, data, level }) {
          return commit('delete', { pk, level });
        },
      },
      includes
    ).getItems();

    return itemsORM;
  },
  getIncludes: (state, getters) => {
    return state.includes;
  },
  getFields: (state, getters) => {
    const groups = getters.getGroups.map((group) => group.key);
    const firstItem = state.items?.[0];

    return state.fields.filter((field) => {
      return firstItem && (!groups.includes(field.key) || firstItem.hasOwnProperty(field.key));
    });
  },
  getLoading: (state) => state.loading,
  getSelectedFilters: (state, getters) => {
    return state.selectedFilters;
  },
  getSelectedGroups: (state, getters) => {
    return state.selectedGroups;
  },
  getSelectedOrders: (state, getters) => {
    return state.selectedOrders;
  },
  getDefaultFilters: (state, getters) => {
    return state.defaultFilters;
  },
  getDefaultGroups: (state, getters) => {
    return state.defaultGroups;
  },
  getDefaultOrders: (state, getters) => {
    return state.defaultOrders;
  },
  getParams: (state, getters) => {
    const includes = getters.getIncludes;
    const filters = [getters.getSelectedFilters, getters.getDefaultFilters].find((item) => !_.isEmpty(item));
    const groups = [getters.getSelectedGroups, getters.getDefaultGroups].find((item) => !_.isEmpty(item));
    const orders = [getters.getSelectedOrders, getters.getDefaultOrders].find((item) => !_.isEmpty(item));

    return {
      includes,
      filters,
      groups,
      orders,
    };
  },
  getEndpoint: (state) => (type, pk) => {
    let endpoint = state?.endpoints?.[type];

    if (endpoint) {
      if (pk) {
        endpoint = endpoint.split(':pk').join(pk);
      }
    }

    return endpoint;
  },
  getFilters: (state) => {
    return state.filters.map((filter) => {
      if (typeof filter === 'string') {
        filter = {
          key: filter,
        };
      }

      if (filter.key === 'pk') {
        filter.key = state.pk;
      }

      return filter;
    });
  },
  getGroups: (state) => {
    return state.groups.map((group) => {
      if (typeof group === 'string') {
        group = {
          key: group,
        };
      }

      if (group.key === 'pk') {
        group.key = state.pk;
      }

      return group;
    });
  },
  getOrders: (state) => {
    return state.orders.map((key) => (key === 'pk' ? state.pk : key));
  },
};
