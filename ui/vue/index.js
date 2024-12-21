import './scss/style.scss';
import UiPanel from './components/Panel/Index.vue';
import UiTable from './components/Table/Index.vue';

const CrudPanel = {
  install(Vue, options) {
    Vue.component('CrudPanel', UiPanel);
  },
};

const CrudTable = {
  install(Vue, options) {
    Vue.component('CrudTable', UiTable);
  },
};

export { CrudPanel, CrudTable };
