import { mapFields, getField, updateField } from 'vuex-map-fields';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

export const mapFormData = mapFields;

export class CrudStoreForm {
  constructor(params) {
    this.state = {
      endpoints: {
        fetch: false, // /item/:pk
        create: false, // /item/create
        update: false, // /item/update/:pk OR send pk in body
        ...params.endpoints,
      },
      pk: null,
      loading: false,
      sending: false,
      data: {},
      dataDefault: {
        ...params.dataDefault,
      },
      prepareData: params.prepareData,
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
