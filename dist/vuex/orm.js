"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORM = void 0;
const _ = __importStar(require("lodash"));
const deep_object_diff_1 = require("deep-object-diff");
class ORMItem {
    constructor(item, pk = 'id', actions) {
        this.setPK(pk);
        this.setActions(actions);
        this.setItem(item);
    }
    setItem(item) {
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
    setActions(actions) {
        this.actions = actions;
        return this;
    }
    getActions() {
        return this.actions;
    }
    setPK(pk) {
        this.pk = pk;
        return this;
    }
    getPK() {
        return this.pk;
    }
    getItem() {
        return this.item;
    }
    getItemOriginal() {
        return this.itemOriginal;
    }
    getPath() {
        return this.path;
    }
    getParentPK() {
        return this.parentPK;
    }
    callAction(action, payload) {
        return this.actions[action](payload);
    }
    get(attribute) {
        return this.item[attribute];
    }
    set(attribute, value) {
        this.item[attribute] = value;
    }
    diff() {
        const path = this.getPath();
        const item = this.getItem();
        const itemOriginal = this.getItemOriginal();
        let itemDiff = (0, deep_object_diff_1.diff)(itemOriginal, item);
        itemDiff = _.omit(itemDiff, ['sources']);
        // console.log(path, itemDiff);
        return itemDiff;
    }
    commit() {
        const parentPK = this.getParentPK();
        const path = this.getPath();
        const item = this.getItem();
        const itemDiff = this.diff();
        return this.callAction('commit', {
            pk: item.pk,
            data: itemDiff,
            // path: path,
            // parentPK: parentPK,
        });
    }
    save() {
        const parentPK = this.getParentPK();
        const path = this.getPath();
        const item = this.getItem();
        const itemDiff = this.diff();
        return this.callAction('update', {
            pk: item.pk,
            data: itemDiff,
            // path: path,
            // parentPK: parentPK,
        });
    }
}
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
// export const mapORMItem = (item, actions, pk = 'pk', path, parentPK) => {
//   const { update, commit } = actions;
//   let itemOriginal;
//   if (pk && !item.pk && item[pk]) {
//     item.pk = item[pk];
//   }
//   const ormProps = {
//     diff() {
//       let itemDiff = diff(itemOriginal, item);
//       itemDiff = _.omit(itemDiff, ['sources']);
//       console.log(path, itemDiff);
//       return itemDiff;
//     },
//     commit() {
//       const itemDiff = item.diff();
//       commit({
//         pk: item.pk,
//         data: itemDiff,
//         path: path,
//         parentPK: parentPK,
//       });
//     },
//     save() {
//       const itemDiff = item.diff();
//       update({
//         pk: item.pk,
//         data: itemDiff,
//         path: path,
//         parentPK: parentPK,
//       });
//     },
//   };
//   item = Object.assign(item, ormProps);
//   itemOriginal = _.cloneDeep(item);
//   return item;
// };
// export const mapORM = (items, actions, pk = 'pk', path, parentPK) => {
//   return items.map((item, key) => {
//     const itemPath = path ? `${path}[${key}]` : '';
//     item = mapORMItem(item, actions, pk, itemPath, parentPK);
//     if (item.sources) {
//       console.log(item.sources);
//       item.sources = mapORM(item.sources, actions, pk, 'sources', item[pk]);
//     }
//     return item;
//   });
// };
//# sourceMappingURL=orm.js.map