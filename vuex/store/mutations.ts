import * as _ from 'lodash';

export default {
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
