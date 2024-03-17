import { mapFields, getField, updateField } from 'vuex-map-fields';

export default {
  updateField(state, field) {
    updateField(state.data, field);
  },

  setLoading(state, status) {
    state.loading = status;
  },
  setSending(state, status) {
    state.sending = status;
  },
  setPK(state, pk) {
    state.pk = pk;
  },
  setData(state, data) {
    state.data = { ...data };
  },
  setDataDefault(state, data) {
    state.dataDefault = { ...data };
  },
};
