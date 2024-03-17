import * as _ from 'lodash';
import { Actions, Level } from './orm.interfaces';
import { ORMItem } from './orm-item';

export class ORM {
  constructor(items: object[] = [], pk = 'id', actions: Actions, includes = [], level: Level) {
    this.setPK(pk);
    this.setLevel(level);
    this.setActions(actions);
    this.setIncludes(includes);
    this.setItems(items);
  }

  private items;
  private actions: Actions;
  private includes: string[] = [];
  private pk: string;
  private path: string;
  private level: Level;

  public setItems(items = []) {
    const pk = this.getPK();
    const actions = this.getActions();
    const includes = this.getIncludes();
    const ormLevel = this.getLevel();

    this.items = items.map((item, key) => {
      const itemPath = ormLevel?.path ? `${ormLevel.path}[${key}]` : ormLevel?.path;
      const itemLevel = { ...ormLevel, path: itemPath };
      const itemORM = new ORMItem(item, pk, {
        commit(args) {
          return actions.commit ? actions.commit({ ...args, level: itemLevel }) : null;
        },
        update(args) {
          return actions.update ? actions.update({ ...args, level: itemLevel }) : null;
        },
      });

      includes.forEach((include) => {
        if (itemORM.hasOwnProperty(include)) {
          const includeLevel = {
            parentPK: item.pk,
            path: [itemLevel?.path, include].filter((i) => i).join('.'),
          };
          const includeItems = new ORM(itemORM[include], pk, actions, includes, includeLevel).getItems();

          itemORM[include] = includeItems;
        }
      });

      return itemORM;
    });

    return this;
  }

  public getItems() {
    return this.items;
  }

  public setLevel(level) {
    this.level = level;

    return this;
  }

  public getLevel() {
    return this.level;
  }

  public setPK(pk) {
    this.pk = pk;

    return this;
  }

  public getPK() {
    return this.pk;
  }

  public setActions(actions) {
    this.actions = actions;

    return this;
  }

  public getActions() {
    return this.actions;
  }

  public setIncludes(includes) {
    this.includes = includes;

    return this;
  }

  public getIncludes() {
    return this.includes;
  }
}
