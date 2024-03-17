import * as _ from 'lodash';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

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

    this.getters = getters;
    this.actions = actions;
    this.mutations = mutations;
  }

  public state;
  public getters;
  public actions;
  public mutations;
}
