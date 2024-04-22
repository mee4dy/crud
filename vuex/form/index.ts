import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import * as _ from 'lodash';

export function mapFormData(path, params: { getterData?: string; mutationField?: string }) {
  const getterData = params?.getterData || 'getData';
  const mutationField = params?.mutationField || 'setDataField';

  return {
    get() {
      const { getters, commit } = this.$store;
      const data = getters[`${path}/${getterData}`];
      const dataClone = _.cloneDeep(data);
      const proxyResource = new Proxy(dataClone, {
        set(target, field, value) {
          commit(`${path}/${mutationField}`, {
            field,
            value,
          });

          return true;
        },
      });

      return proxyResource;
    },
  };
}

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
      dataWatcher: null,
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
