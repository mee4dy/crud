"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudStoreForm = exports.mapFormData = void 0;
const vuex_map_fields_1 = require("vuex-map-fields");
const pk_helper_1 = __importDefault(require("../common/helpers/pk.helper"));
const TYPE_CREATE = 'create';
const TYPE_EDIT = 'edit';
exports.mapFormData = vuex_map_fields_1.mapFields;
class CrudStoreForm {
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
        this.getters = {
            getField(state) {
                return (0, vuex_map_fields_1.getField)(state.data);
            },
            getLoading: (state) => state.loading,
            getSending: (state) => state.sending,
            getType(state) {
                return !state.pk ? TYPE_CREATE : TYPE_EDIT;
            },
            getEndpoints(state) {
                return state.endpoints;
            },
            getEndpoint: (state, getters) => (endpointType) => {
                const endpoints = getters.getEndpoints;
                return endpoints === null || endpoints === void 0 ? void 0 : endpoints[endpointType];
            },
            getEndpointSubmit(state, getters) {
                const endpoints = getters.getEndpoints;
                const type = getters.getType;
                let endpoint;
                switch (type) {
                    case TYPE_CREATE:
                        endpoint = endpoints.create;
                        break;
                    case TYPE_EDIT:
                        endpoint = endpoints.update;
                        break;
                }
                return endpoint;
            },
            getPK(state) {
                return state.pk;
            },
            getData(state) {
                return state.data;
            },
            getDataDefault(state) {
                return state.dataDefault;
            },
            getFields(state, getters) {
                const data = getters.getData;
                return Object.keys(data);
            },
        };
        this.actions = {
            async fetch({ state, commit, getters, dispatch }, pk = null) {
                var _a, _b;
                dispatch('reset', true);
                commit('setPK', pk);
                if (getters.getType !== TYPE_EDIT) {
                    return;
                }
                const endpoint = getters.getEndpoint('fetch');
                if (!endpoint) {
                    return console.error('Endpoint for "fetch" not found! Please configure CrudStoreForm');
                }
                try {
                    commit('setLoading', true);
                    const url = (0, pk_helper_1.default)(endpoint, getters.getPK);
                    const response = await this.$axios.get(url);
                    let itemData = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.item;
                    if (typeof state.prepareData === 'function') {
                        itemData = state.prepareData(itemData);
                    }
                    if (itemData) {
                        commit('setDataDefault', itemData);
                        commit('setData', itemData);
                    }
                }
                catch (e) {
                    console.log(e);
                }
                finally {
                    commit('setLoading', false);
                }
            },
            async submit({ commit, dispatch, getters }) {
                const endpoint = getters.getEndpointSubmit;
                if (!endpoint) {
                    return console.error('Endpoint for "submit" not found! Please configure CrudStoreForm');
                }
                const url = (0, pk_helper_1.default)(endpoint, getters.getPK);
                const pk = getters.getPK;
                const data = getters.getData;
                try {
                    commit('setSending', true);
                    const response = await this.$axios.post(url, {
                        pk: pk || undefined,
                        data: data,
                    });
                    return response;
                }
                catch (e) {
                    console.log(e);
                }
                finally {
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
        this.mutations = {
            updateField(state, field) {
                (0, vuex_map_fields_1.updateField)(state.data, field);
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
    }
}
exports.CrudStoreForm = CrudStoreForm;
//# sourceMappingURL=form.js.map