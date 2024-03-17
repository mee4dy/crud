"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORM = void 0;
const orm_item_1 = require("./orm-item");
class ORM {
    constructor(items = [], pk = 'id', actions, includes = [], level) {
        this.includes = [];
        this.setPK(pk);
        this.setLevel(level);
        this.setActions(actions);
        this.setIncludes(includes);
        this.setItems(items);
    }
    setItems(items = []) {
        const pk = this.getPK();
        const actions = this.getActions();
        const includes = this.getIncludes();
        const ormLevel = this.getLevel();
        this.items = items.map((item, key) => {
            const itemPath = (ormLevel === null || ormLevel === void 0 ? void 0 : ormLevel.path) ? `${ormLevel.path}[${key}]` : ormLevel === null || ormLevel === void 0 ? void 0 : ormLevel.path;
            const itemLevel = { ...ormLevel, path: itemPath };
            const itemORM = new orm_item_1.ORMItem(item, pk, {
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
                        path: [itemLevel === null || itemLevel === void 0 ? void 0 : itemLevel.path, include].filter((i) => i).join('.'),
                    };
                    const includeItems = new ORM(itemORM[include], pk, actions, includes, includeLevel).getItems();
                    itemORM[include] = includeItems;
                }
            });
            return itemORM;
        });
        return this;
    }
    getItems() {
        return this.items;
    }
    setLevel(level) {
        this.level = level;
        return this;
    }
    getLevel() {
        return this.level;
    }
    setPK(pk) {
        this.pk = pk;
        return this;
    }
    getPK() {
        return this.pk;
    }
    setActions(actions) {
        this.actions = actions;
        return this;
    }
    getActions() {
        return this.actions;
    }
    setIncludes(includes) {
        this.includes = includes;
        return this;
    }
    getIncludes() {
        return this.includes;
    }
}
exports.ORM = ORM;
//# sourceMappingURL=orm.js.map