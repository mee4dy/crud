import * as _ from 'lodash';

export default {
  setState(state, { path, value }) {
    return _.set(state, path, value);
  },
  setCtx(state, ctx) {
    state.ctx = ctx;
  },
  setFields(state, fields) {
    state.fields = fields;
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
  delete: (state, { pk: pkval, level }) => {
    const pk = state.pk;

    if (level && level.path && level.parentPK) {
      const index = state.items.findIndex((i) => i[pk] === level.parentPK);

      if (index >= 0) {
        const { path } = level;
        const pathParse = _.toPath(path);

        state.items[index][pathParse[0]].splice(pathParse[1], 1);
      }

      return;
    }

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
