export default class {
  constructor(params) {
    this.state = {
      endpoints: {
        meta: false, // /posts/meta
        fetch: false, // /posts
        delete: false, // /posts/delete/:id OR send id in body
        update: false, // /posts/update/:id OR send id in body
        ...params.endpoints,
      },
      pk: params.pk || 'id',
      filters: params?.filters || [],
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
      getItems: (state) => {
        return state.items.map((item) => {
          item.pk = item[state.pk];

          return item;
        });
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
        const filters = getters.getFiltersSelected;
        const groups = getters.getGroupsSelected;
        const orders = getters.getOrdersSelected;

        return {
          filters,
          groups,
          orders,
        };
      },
      getEndpoint: (state) => (type, id) => {
        let endpoint = state?.endpoints?.[type];

        if (endpoint) {
          if (id) {
            endpoint = endpoint.split(':id').join(id);
          }
        }

        return endpoint;
      },
      getFilters: (state) => {
        return state.filters.map((filter) => {
          if (filter.key === 'pk') {
            filter.key = state.pk;
          }

          return filter;
        });
      },
      getGroups: (state) => {
        return state.groups.map((group) => {
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
          commit('setLoading', false);

          commit('setItems', res.data.data.items);
        } catch (e) {
          console.log(e);
        }
      },
      async updateItem({ commit, state, getters }, { id, data }) {
        const endpoint = getters.getEndpoint('update', id);

        if (!endpoint || !id) {
          return;
        }

        try {
          await this.$axios.post(endpoint, {
            id: id,
            data: data,
          });
          commit('updateItem', {
            id: id,
            data: data,
          });
        } catch (e) {
          console.log(e);
        }
      },
      async deleteItem({ commit, state, getters }, id) {
        const endpoint = getters.getEndpoint('delete', id);

        if (!endpoint || !id) {
          return;
        }

        try {
          await this.$axios.post(endpoint, {
            id: id,
          });
          commit('deleteItem', id);
        } catch (e) {
          console.log(e);
        }
      },
    };

    this.mutations = {
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
      updateItem: (state, { id, data }) => {
        const pk = state.pk;
        const index = state.items.findIndex((i) => i[pk] === id);
        if (index >= 0) {
          const item = state.items[index];
          state.items.splice(index, 1, { ...item, ...data });
        }
      },
      deleteItem: (state, id) => {
        const pk = state.pk;
        const index = state.items.findIndex((i) => i[pk] === id);

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
