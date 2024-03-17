import { ORM } from './orm';
import * as _ from 'lodash';
import { replacePKItems } from '../common/helpers/pk.helper';

export class CrudStore {
  constructor(params) {
    this.state = {
      ctx: null,
      endpoints: {
        meta: false, // /posts/meta
        fetch: false, // /posts
        delete: false, // /posts/delete/:pk OR send pk in body
        update: false, // /posts/update/:pk OR send pk in body
        ...params.endpoints,
      },
      pk: params.pk || 'id',
      includes: params?.includes || [],
      filters: params?.filters || ['pk'],
      groups: params?.groups || ['pk'],
      orders: params?.orders || ['pk'],

      items: [],
      fields: params.fields || [],
      loading: false,
      query: {},
      filtersSelected: [],
      groupsSelected: [],
      ordersSelected: [],
      groupsDefault: params?.groupsDefault || [],
    };

    this.getters = {
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
      getFiltersSelected: (state, getters) => {
        return state.filtersSelected;
      },
      getGroupsSelected: (state, getters) => {
        return state.groupsSelected;
      },
      getOrdersSelected: (state, getters) => {
        return state.ordersSelected;
      },
      getParams: (state, getters) => {
        const includes = getters.getIncludes;
        const filters = getters.getFiltersSelected;
        const groups = getters.getGroupsSelected;
        const orders = getters.getOrdersSelected;

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

    this.actions = {
      setQuery({ commit, dispatch }, query) {
        commit('setQuery', query);
        dispatch('setQueryFiltersSelected', query);
        dispatch('setQueryGroupsSelected', query);
        dispatch('setQueryOrdersSelected', query);
      },
      setQueryFiltersSelected({ commit, state, getters }, query) {
        const filters = getters.getFilters;
        const queryFilters = query;
        const filtersSelected = {};

        for (let key in queryFilters) {
          const filterValue = queryFilters[key];

          if (key === 'pk') {
            queryFilters[state.pk] = filterValue;
            key = state.pk;
          }

          if (filters.find((filter) => filter.key === key)) {
            filtersSelected[key] = filterValue;
          }
        }

        commit('setFiltersSelected', filtersSelected);
      },
      setQueryGroupsSelected({ commit, state, getters }, query) {
        const groups = getters.getGroups.map((group) => group.key);
        const queryGroups = query?.groups ? query?.groups.split(',') : state.groupsDefault;
        const groupsSelected = [];

        for (let key of queryGroups) {
          if (key === 'pk') {
            key = state.pk;
          }

          if (groups.includes(key)) {
            groupsSelected.push(key);
          }
        }

        commit('setGroupsSelected', groupsSelected);
      },
      setQueryOrdersSelected({ commit, state, getters }, query) {
        const orders = getters.getOrders;
        const queryOrders = query?.orders ? query?.orders.split(',') : [];
        const ordersSelected = {};

        for (let key of queryOrders) {
          const directionDesc = key.charAt(0) === '-';

          if (directionDesc) {
            key = key.substring(1);
          }

          if (key === 'pk') {
            queryOrders[state.pk] = queryOrders[key];
            key = state.pk;
          }

          if (orders.includes(key)) {
            ordersSelected[key] = directionDesc ? 'desc' : 'asc';
          }
        }

        commit('setOrdersSelected', ordersSelected);
      },
      syncSelectedToQuery({ commit, state, getters }) {
        const queryFiltersSelected = getters.getFiltersSelected;
        const queryGroupsSelected = getters.getGroupsSelected.join(',');
        const queryOrdersSelected = Object.entries(getters.getOrdersSelected)
          .map(([direction, field]) => `${direction === 'desc' ? '-' : ''}${field}`)
          .join(',');

        const querySelected = {
          filters: queryFiltersSelected,
          groups: queryGroupsSelected,
          orders: queryOrdersSelected,
        };

        const queryParams = new URLSearchParams(window.location.search);

        for (const queryParam in querySelected) {
          const queryValue = querySelected[queryParam];

          if (queryValue) {
            if (typeof queryValue === 'object') {
              Object.entries(getters.getFiltersSelected).forEach(([field, value]) => {
                queryParams.set(field, value);
              });
            } else {
              queryParams.set(queryParam, queryValue);
            }
          }
        }

        const queryString = decodeURIComponent(queryParams.toString());

        history.pushState(null, null, queryString ? `?${queryString}` : '');
      },

      async setItems({ commit, state, getters, dispatch }, items) {
        await dispatch('setCtx');

        commit('setItems', items);
      },
      async fetch({ commit, state, getters, dispatch }, applyQuery = true) {
        const endpoint = getters.getEndpoint('fetch');

        if (!endpoint) {
          return;
        }

        try {
          commit('setLoading', true);
          const params = getters.getParams;

          if (applyQuery) {
            dispatch('syncSelectedToQuery');
          }

          const res = await this.$axios.get(endpoint, {
            params: params,
          });

          let items = res.data.data.items;

          dispatch('setItems', items);
        } catch (e) {
          console.log(e);
        } finally {
          commit('setLoading', false);
        }
      },
      async update({ commit, state, dispatch, getters }, { pk, data, level }) {
        if (level && level.path && level.parentPK) {
          const entity = _.toPath(level.path)[0];

          await dispatch(`${entity}/update`, { pk, data }, { root: true });

          commit('update', {
            pk,
            data,
            level,
          });

          return;
        }

        const endpoint = getters.getEndpoint('update', pk);

        if (!endpoint || !pk) {
          return;
        }

        try {
          await this.$axios.post(endpoint, {
            pk,
            data,
          });
          commit('update', {
            pk,
            data,
          });
        } catch (e) {
          console.log(e);
        }
      },
      async delete({ commit, state, getters }, pk) {
        const endpoint = getters.getEndpoint('delete', pk);

        if (!endpoint || !pk) {
          return;
        }

        try {
          await this.$axios.post(endpoint, {
            pk: pk,
          });
          commit('delete', pk);
        } catch (e) {
          console.log(e);
        }
      },
      setCtx({ getters, dispatch, state, commit }) {
        commit('setCtx', { getters, dispatch, commit, state });
      },
    };

    this.mutations = {
      setCtx(state, ctx) {
        state.ctx = ctx;
      },
      setItems(state, items) {
        state.items = items;
      },
      pushItem(state, item = {}) {
        state.items.push(item);
      },
      setLoading(state, status) {
        state.loading = status;
      },
      setQuery(state, query) {
        state.query = query;
      },
      update: (state, { pk: pkval, data, level }) => {
        const pk = state.pk;

        if (level && level.path && level.parentPK) {
          let item = state.items.find((i) => i[pk] === level.parentPK);

          if (item) {
            const { path } = level;
            _.merge(_.get(item, path), { ...data });
          }

          return;
        }

        const index = state.items.findIndex((i) => i[pk] === pkval);

        if (index >= 0) {
          const item = state.items[index];

          state.items.splice(index, 1, { ...item, ...data });
        }
      },
      delete: (state, pkval) => {
        const pk = state.pk;
        const index = state.items.findIndex((i) => i[pk] === pkval);

        if (index >= 0) {
          state.items.splice(index, 1);
        }
      },
      setFiltersSelected: (state, value) => {
        state.filtersSelected = value;
      },
      setGroupsSelected: (state, value) => {
        state.groupsSelected = value;
      },
      setOrdersSelected: (state, value) => {
        state.ordersSelected = value;
      },
    };
  }
}
