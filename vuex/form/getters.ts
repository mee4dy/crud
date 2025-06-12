import { FormTypesEnum } from './enums/form-types.enum';
import * as _ from 'lodash';

export default {
  getLoading: (state) => state.loading,
  getSending: (state) => state.sending,
  getType(state) {
    return !state.data[state.pk] ? FormTypesEnum.create : FormTypesEnum.edit;
  },
  getEndpoints(state) {
    return state.endpoints;
  },
  getEndpoint: (state, getters) => (endpointType) => {
    const endpoints = getters.getEndpoints;

    return endpoints?.[endpointType];
  },
  getEndpointSubmit(state, getters) {
    const endpoints = getters.getEndpoints;
    const type = getters.getType;
    let endpoint;

    switch (type) {
      case FormTypesEnum.create:
        endpoint = endpoints.create;
        break;
      case FormTypesEnum.edit:
        endpoint = endpoints.update;
        break;
    }

    return endpoint;
  },
  getPK(state) {
    return state.pk;
  },
  getData(state, getters) {
    const dataDefault = getters.getDataDefault;
    const data = state.data;

    return {
      ...dataDefault,
      ...data,
    };
  },
  getDataDefault(state) {
    return state.dataDefault;
  },
  getFields(state, getters) {
    const data = getters.getData;

    return Object.keys(data);
  },
  getField: (state, getters) => (field) => {
    const data = getters.getData;

    return data?.[field];
  },
};
