export class CrudStore {
    constructor(params: any);
    state: {
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
        getItems: (state: any) => any;
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
        fetch({ commit, state, getters, dispatch }: {
            commit: any;
            state: any;
            getters: any;
            dispatch: any;
        }, applyQuery?: boolean): Promise<void>;
        update({ commit, state, getters }: {
            commit: any;
            state: any;
            getters: any;
        }, { pk, data }: {
            pk: any;
            data: any;
        }): Promise<void>;
        delete({ commit, state, getters }: {
            commit: any;
            state: any;
            getters: any;
        }, pk: any): Promise<void>;
    };
    mutations: {
        setItems(state: any, items: any): void;
        pushItem(state: any, item?: {}): void;
        setLoading(state: any, status: any): void;
        setQuery(state: any, query: any): void;
        update: (state: any, { pk: pkval, data }: {
            pk: any;
            data: any;
        }) => void;
        delete: (state: any, pkval: any) => void;
        setFiltersSelected: (state: any, value: any) => void;
        setGroupsSelected: (state: any, value: any) => void;
        setOrdersSelected: (state: any, value: any) => void;
    };
}
