export class CrudStore {
    constructor(params: any);
    state: {
        ctx: any;
        endpoints: any;
        pk: any;
        includes: any;
        filters: any;
        groups: any;
        orders: any;
        items: any[];
        fields: any;
        loading: boolean;
        query: {};
        filtersSelected: any[];
        groupsSelected: any[];
        ordersSelected: any[];
        groupsDefault: any;
    };
    getters: {
        getCtx: (state: any) => any;
        getPK: (state: any) => any;
        getItems: (state: any, getters: any, globalState: any, globalGetters: any) => any;
        getItemsORM: (state: any, getters: any) => any;
        getIncludes: (state: any, getters: any) => any;
        getFields: (state: any, getters: any) => any;
        getLoading: (state: any) => any;
        getFiltersSelected: (state: any, getters: any) => any;
        getGroupsSelected: (state: any, getters: any) => any;
        getOrdersSelected: (state: any, getters: any) => any;
        getParams: (state: any, getters: any) => {
            includes: any;
            filters: any;
            groups: any;
            orders: any;
        };
        getEndpoint: (state: any) => (type: any, pk: any) => any;
        getFilters: (state: any) => any;
        getGroups: (state: any) => any;
        getOrders: (state: any) => any;
    };
    actions: {
        setQuery({ commit, dispatch }: {
            commit: any;
            dispatch: any;
        }, query: any): void;
        setQueryFiltersSelected({ commit, state, getters }: {
            commit: any;
            state: any;
            getters: any;
        }, query: any): void;
        setQueryGroupsSelected({ commit, state, getters }: {
            commit: any;
            state: any;
            getters: any;
        }, query: any): void;
        setQueryOrdersSelected({ commit, state, getters }: {
            commit: any;
            state: any;
            getters: any;
        }, query: any): void;
        syncSelectedToQuery({ commit, state, getters }: {
            commit: any;
            state: any;
            getters: any;
        }): void;
        setItems({ commit, state, getters, dispatch }: {
            commit: any;
            state: any;
            getters: any;
            dispatch: any;
        }, items: any): Promise<void>;
        fetch({ commit, state, getters, dispatch }: {
            commit: any;
            state: any;
            getters: any;
            dispatch: any;
        }, applyQuery?: boolean): Promise<void>;
        update({ commit, state, dispatch, getters }: {
            commit: any;
            state: any;
            dispatch: any;
            getters: any;
        }, { pk, data, level }: {
            pk: any;
            data: any;
            level: any;
        }): Promise<void>;
        delete({ commit, state, getters }: {
            commit: any;
            state: any;
            getters: any;
        }, pk: any): Promise<void>;
        setCtx({ getters, dispatch, state, commit }: {
            getters: any;
            dispatch: any;
            state: any;
            commit: any;
        }): void;
    };
    mutations: {
        setCtx(state: any, ctx: any): void;
        setItems(state: any, items: any): void;
        pushItem(state: any, item?: {}): void;
        setLoading(state: any, status: any): void;
        setQuery(state: any, query: any): void;
        update: (state: any, { pk: pkval, data, level }: {
            pk: any;
            data: any;
            level: any;
        }) => void;
        delete: (state: any, pkval: any) => void;
        setFiltersSelected: (state: any, value: any) => void;
        setGroupsSelected: (state: any, value: any) => void;
        setOrdersSelected: (state: any, value: any) => void;
    };
}
