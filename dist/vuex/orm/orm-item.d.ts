import { Actions } from './orm.interfaces';
export declare class ORMItem {
    constructor(item: object, pk: string, actions: Actions);
    private pk;
    private item;
    private itemOriginal;
    private actions;
    private setItem;
    setActions(actions: any): this;
    getActions(): Actions;
    setPK(pk: any): this;
    getPK(): string;
    private getItem;
    private getItemOriginal;
    private callAction;
    get(attribute: any): any;
    set(attribute: any, value: any): void;
    diff(): object;
    commit(): any;
    save(): any;
}
