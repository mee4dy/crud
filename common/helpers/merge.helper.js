import * as _ from 'lodash';

export function merge(objA, objB) {
  return _.mergeWith(objA, objB, (a, b) => {
    if (!_.isObject(b)) return b;

    return Array.isArray(a) ? [...a, ...b] : { ...a, ...b };
  });
}
