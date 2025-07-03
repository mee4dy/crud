import * as _ from 'lodash';

export function merge(objA, objB) {
  return _.mergeWith(objA, objB, (a, b) => {
    if (_.isPlainObject(a) && _.isPlainObject(b)) {
      return { ...a, ...b };
    }

    return b;
  });
}
