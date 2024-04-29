import * as _ from 'lodash';
import state from './state';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

export class CrudStore {
  constructor(params = {}) {
    this.state = Object.assign(state, params);
    this.getters = getters;
    this.actions = actions;
    this.mutations = mutations;
  }

  public state;
  public getters;
  public actions;
  public mutations;
}
