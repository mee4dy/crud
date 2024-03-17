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
exports.ORMItem = void 0;
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
        const item = this.getItem();
        const itemOriginal = this.getItemOriginal();
        let itemDiff = (0, deep_object_diff_1.diff)(itemOriginal, item);
        itemDiff = _.omit(itemDiff, ['sources']);
        // console.log(path, itemDiff);
        return itemDiff;
    }
    commit() {
        const item = this.getItem();
        const itemDiff = this.diff();
        return this.callAction('commit', {
            pk: item.pk,
            data: itemDiff,
        });
    }
    save() {
        const item = this.getItem();
        const itemDiff = this.diff();
        return this.callAction('update', {
            pk: item.pk,
            data: itemDiff,
        });
    }
}
exports.ORMItem = ORMItem;
//# sourceMappingURL=orm-item.js.map