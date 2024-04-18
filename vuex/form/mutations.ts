export default {
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
  setDataField(state, { field, value }) {
    state.data = {
      ...state.data,
      ...{ [field]: value },
    };
  },
  setDataDefault(state, data) {
    state.dataDefault = { ...data };
  },
  setDataWatcher(state, dataWatcher) {
    state.dataWatcher = dataWatcher;
  },
};
