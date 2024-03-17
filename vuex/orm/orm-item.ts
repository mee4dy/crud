import * as _ from 'lodash';
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';
import { Actions } from './orm.interfaces';

export class ORMItem {
  constructor(item: object, pk: string = 'id', actions: Actions) {
    this.setPK(pk);
    this.setActions(actions);
    this.setItem(item);
  }

  private pk: string;
  private item;
  private itemOriginal;
  private actions: Actions;

  private setItem(item) {
    this.item = item;
    this.itemOriginal = _.cloneDeep(item);

    Object.keys(item).forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          return this.get(key);
        },
        set(value) {
          return this.set(key, value);
        },
      });
    });
  }

  public setActions(actions) {
    this.actions = actions;

    return this;
  }

  public getActions() {
    return this.actions;
  }

  public setPK(pk) {
    this.pk = pk;

    return this;
  }

  public getPK() {
    return this.pk;
  }

  private getItem() {
    return this.item;
  }

  private getItemOriginal() {
    return this.itemOriginal;
  }

  private callAction(action, payload) {
    return this.actions[action](payload);
  }

  public get(attribute) {
    return this.item[attribute];
  }

  public set(attribute, value) {
    this.item[attribute] = value;
  }

  public diff() {
    const item = this.getItem();
    const itemOriginal = this.getItemOriginal();
    let itemDiff = diff(itemOriginal, item);

    itemDiff = _.omit(itemDiff, ['sources']);

    // console.log(path, itemDiff);

    return itemDiff;
  }

  public commit() {
    const item = this.getItem();
    const itemDiff = this.diff();

    return this.callAction('commit', {
      pk: item.pk,
      data: itemDiff,
    });
  }

  public save() {
    const item = this.getItem();
    const itemDiff = this.diff();

    return this.callAction('update', {
      pk: item.pk,
      data: itemDiff,
    });
  }
}
