export default {
  ctx: null,
  config: {
    client: {
      cancelToken: null,
      timeout: false,
      abort: true,
    },
  },
  endpoints: {
    meta: false, // /posts/meta
    fetch: false, // /posts
    delete: false, // /posts/delete/:pk OR send pk in body
    update: false, // /posts/update/:pk OR send pk in body
  },
  pk: 'id',
  includes: [],
  filters: ['pk'],
  groups: ['pk'],
  orders: ['pk'],

  items: [],
  fields: [],
  loading: false,
  query: {},
  filtersSelected: [],
  groupsSelected: [],
  ordersSelected: [],
  groupsDefault: [],
};
