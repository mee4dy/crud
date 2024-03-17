import * as _ from 'lodash';

export default {
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
      // await this.$axios.post(endpoint, {
      //   pk: pk,
      // });
      commit('delete', { pk });
    } catch (e) {
      console.log(e);
    }
  },
  setCtx({ getters, dispatch, state, commit }) {
    commit('setCtx', { getters, dispatch, commit, state });
  },
};
