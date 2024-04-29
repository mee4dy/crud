export default {
  endpoints: {
    fetch: false, // /item/:pk
    create: false, // /item/create
    update: false, // /item/update/:pk OR send pk in body
  },
  pk: null,
  loading: false,
  sending: false,
  data: {},
  dataDefault: {},
  prepareData: null,
  dataWatcher: null,
};
