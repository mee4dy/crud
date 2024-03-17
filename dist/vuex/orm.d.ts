interface Actions {
    commit?: Function;
    update?: Function;
    delete?: Function;
}
interface Level {
    parentPK: string | number;
    path: string;
}
export declare class ORM {
    constructor(items: object[], pk: string, actions: Actions, includes: any[], level: Level);
    private items;
    private actions;
    private includes;
    private pk;
    private path;
    private level;
    setItems(items?: any[]): this;
    getItems(): any;
    setLevel(level: any): this;
    getLevel(): Level;
    setPK(pk: any): this;
    getPK(): string;
    setActions(actions: any): this;
    getActions(): Actions;
    setIncludes(includes: any): this;
    getIncludes(): string[];
}
export {};
