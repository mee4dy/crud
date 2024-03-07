export const mapFormData: any;
export class CrudStoreForm {
    constructor(params: any);
    state: {
        endpoints: any;
        pk: any;
        loading: boolean;
        sending: boolean;
        data: {};
        dataDefault: any;
        prepareData: any;
    };
    getters: {
        getField(state: any): any;
        getLoading: (state: any) => any;
        getSending: (state: any) => any;
        getType(state: any): "create" | "edit";
        getEndpoints(state: any): any;
        getEndpoint: (state: any, getters: any) => (endpointType: any) => any;
        getEndpointSubmit(state: any, getters: any): any;
        getPK(state: any): any;
        getData(state: any): any;
        getDataDefault(state: any): any;
        getFields(state: any, getters: any): string[];
    };
    actions: {
        fetch({ state, commit, getters, dispatch }: {
            state: any;
            commit: any;
            getters: any;
            dispatch: any;
        }, pk?: any): Promise<void>;
        submit({ commit, dispatch, getters }: {
            commit: any;
            dispatch: any;
            getters: any;
        }): Promise<any>;
        reset({ commit, getters }: {
            commit: any;
            getters: any;
        }, force?: boolean): void;
    };
    mutations: {
        updateField(state: any, field: any): void;
        setLoading(state: any, status: any): void;
        setSending(state: any, status: any): void;
        setPK(state: any, pk: any): void;
        setData(state: any, data: any): void;
        setDataDefault(state: any, data: any): void;
    };
}
