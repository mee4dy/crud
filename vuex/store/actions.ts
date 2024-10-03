import * as _ from 'lodash';
import qs from 'qs';

interface FetchOptions {
  applyQuery?: boolean;
  filters?: object;
  groups?: string[];
  orders?: object;
}

export default {
  setCtx({ getters, dispatch, state, commit }) {
    commit('setCtx', { getters, dispatch, commit, state });
  },
  setQuery({ commit, dispatch }, query) {
    commit('setQuery', query);
    dispatch('setQuerySelectedFilters', query);
    dispatch('setQuerySelectedGroups', query);
    dispatch('setQuerySelectedOrders', query);
  },
  setQuerySelectedFilters({ commit, state, getters }, query) {
    const filters = getters.getFilters;
    const queryFilters = query;
    const selectedFilters = {};

    for (let key in queryFilters) {
      const filterValue = queryFilters[key];

      if (key === 'pk') {
        queryFilters[state.pk] = filterValue;
        key = state.pk;
      }

      if (filters.find((filter) => filter.key === key)) {
        selectedFilters[key] = filterValue;
      }
    }

    commit('setSelectedFilters', selectedFilters);
  },
  setQuerySelectedGroups({ commit, state, getters }, query) {
    const groups = getters.getGroups.map((group) => group.key);
    const queryGroups = query?.groups ? query?.groups.split(',') : [];
    const selectedGroups = [];

    for (let key of queryGroups) {
      if (key === 'pk') {
        key = state.pk;
      }

      if (groups.includes(key)) {
        selectedGroups.push(key);
      }
    }

    commit('setSelectedGroups', selectedGroups);
  },
  setQuerySelectedOrders({ commit, state, getters }, query) {
    const orders = getters.getOrders;
    const queryOrders = query?.orders ? query?.orders.split(',') : [];
    const selectedOrders = {};

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
        selectedOrders[key] = directionDesc ? 'desc' : 'asc';
      }
    }

    commit('setSelectedOrders', selectedOrders);
  },
  syncSelectedToQuery({ commit, state, getters }) {
    const querySelectedFilters = getters.getSelectedFilters;
    const querySelectedGroups = getters.getSelectedGroups.join(',');
    const querySelectedOrders = Object.entries(getters.getSelectedOrders)
      .map(([direction, field]) => `${direction === 'desc' ? '-' : ''}${field}`)
      .join(',');

    const querySelected = {
      filters: querySelectedFilters,
      groups: querySelectedGroups,
      orders: querySelectedOrders,
    };

    const queryParams = new URLSearchParams(window.location.search);

    for (const queryParam in querySelected) {
      const queryValue = querySelected[queryParam];

      if (queryValue) {
        if (typeof queryValue === 'object') {
          Object.entries(getters.getSelectedFilters).forEach(([field, value]) => {
            queryParams.set(field, value.toString());
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
  async fetch({ commit, state, getters, dispatch }, options: FetchOptions) {
    const endpoint = getters.getEndpoint('fetch');

    if (!endpoint) {
      return;
    }

    try {
      commit('setLoading', true);
      const params = getters.getParams;
      const configClientAbort = getters.getState('config.client.abort');
      const cancelTokenPrev = getters.getState('config.client.cancelToken');

      if (options?.applyQuery) {
        dispatch('syncSelectedToQuery');
      }

      if (options?.filters) {
        params.filters = options.filters;
      }

      if (options?.groups) {
        params.groups = options.groups;
      }

      if (options?.orders) {
        params.orders = options.orders;
      }

      if (configClientAbort && cancelTokenPrev) {
        cancelTokenPrev.cancel();
      }

      const cancelToken = this.$axios.CancelToken;
      const source = cancelToken.source();

      commit('setState', {
        path: 'config.client.cancelToken',
        value: source,
      });

      const response = await this.$axios.get(endpoint, {
        cancelToken: source.token,
        params: params,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
      });

      commit('setState', {
        path: 'config.client.cancelToken',
        value: null,
      });

      let items = response.data.data.items;

      dispatch('setItems', items);

      return response?.data;
    } catch (e) {
      console.log(e);
    } finally {
      commit('setLoading', false);
    }
  },
  async create({ commit, state, dispatch, getters }, { data }) {
    const endpoint = getters.getEndpoint('create');

    if (!endpoint) {
      return;
    }

    try {
      const response = await this.$axios.post(endpoint, {
        data,
      });

      return response?.data;
    } catch (e) {
      console.log(e);
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
      const response = await this.$axios.post(endpoint, {
        pk,
        data,
      });
      commit('update', {
        pk,
        data,
      });

      return response?.data;
    } catch (e) {
      console.log(e);
    }
  },
  async delete({ commit, state, getters, dispatch }, { pk, level }) {
    if (level && level.path && level.parentPK) {
      const entity = _.toPath(level.path)[0];

      await dispatch(`${entity}/delete`, { pk }, { root: true });

      commit('delete', {
        pk,
        level,
      });

      return;
    }

    const endpoint = getters.getEndpoint('delete', pk);

    if (!endpoint || !pk) {
      return;
    }

    try {
      await this.$axios.post(endpoint, {
        pk: pk,
      });
      commit('delete', { pk });
    } catch (e) {
      console.log(e);
    }
  },
};
