interface Field {
  key: string;
  label: string;
  sortable: boolean;
  type: string;
  hidden: boolean;
  width: string;
}

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
    create: false, // /posts/create
    update: false, // /posts/update/:pk OR send pk in body
    delete: false, // /posts/delete/:pk OR send pk in body
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
  selectedFilters: {},
  selectedGroups: [],
  selectedOrders: {},
  defaultFilters: {}, // used when selected is empty
  defaultGroups: [], // used when selected is empty
  defaultOrders: {}, // used when selected is empty
};
