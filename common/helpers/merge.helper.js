import * as _ from 'lodash';

export function merge(objA, objB) {
  return _.mergeWith(objA, objB, (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return [...a, ...b];
    }

    if (_.isObject(a) && _.isObject(b)) {
      return { ...a, ...b };
    }

    return b;
  });
}
