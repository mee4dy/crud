import { replacePK } from '../../common/helpers/pk.helper';
import { FormTypesEnum } from './enums/form-types.enum';

export default {
  init({ state, commit, getters, dispatch }) {
    commit('setDataWatcher', (field, value) => {
      commit('setDataField', {
        field,
        value,
      });
    });
  },
  async fetch({ state, commit, getters, dispatch }, pk = null) {
    dispatch('reset', true);
    commit('setPK', pk);

    if (getters.getType !== FormTypesEnum.edit) {
      return;
    }

    const endpoint = getters.getEndpoint('fetch');

    if (!endpoint) {
      return console.error('Endpoint for "fetch" not found! Please configure CrudStoreForm');
    }

    try {
      commit('setLoading', true);

      const url = replacePK(endpoint, getters.getPK);
      const response = await this.$axios.get(url);
      let itemData = response?.data?.data?.item;

      if (typeof state.prepareData === 'function') {
        itemData = state.prepareData(itemData);
      }

      if (itemData) {
        commit('setDataDefault', itemData);
        commit('setData', itemData);
      }
    } catch (e) {
      console.log(e);
    } finally {
      commit('setLoading', false);
    }
  },
  async submit({ commit, dispatch, getters }) {
    const endpoint = getters.getEndpointSubmit;

    if (!endpoint) {
      return console.error('Endpoint for "submit" not found! Please configure CrudStoreForm');
    }

    const url = replacePK(endpoint, getters.getPK);
    const pk = getters.getPK;
    const data = getters.getData;

    try {
      commit('setSending', true);

      const response = await this.$axios.post(url, {
        pk: pk || undefined,
        data: data,
      });

      return response;
    } catch (e) {
      console.log(e);
    } finally {
      commit('setSending', false);
    }
  },
  reset({ commit, getters }, force = false) {
    let data = getters.getDataDefault;

    if (force) {
      data = {};
    }

    commit('setData', data);
  },
};
