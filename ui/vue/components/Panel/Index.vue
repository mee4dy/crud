<template>
  <div class="crud-ui-panel">
    <b-form @submit.prevent="onSubmit">
      <ui-panel-filters v-bind="$attrs" v-on="$listeners" />
      <ui-panel-groups v-bind="$attrs" v-on="$listeners" />
      <div class="d-flex">
        <ui-panel-actions v-bind="$attrs" v-on="$listeners" />
        <ui-panel-settings v-bind="$attrs" v-on="$listeners" />
      </div>
    </b-form>
  </div>
</template>

<script>
import { BForm } from 'bootstrap-vue';
import UiPanelFilters from './Filters.vue';
import UiPanelGroups from './Groups.vue';
import UiPanelActions from './Actions.vue';
import UiPanelSettings from './Settings.vue';

export default {
  components: {
    'b-form': BForm,
    'ui-panel-filters': UiPanelFilters,
    'ui-panel-groups': UiPanelGroups,
    'ui-panel-actions': UiPanelActions,
    'ui-panel-settings': UiPanelSettings,
  },
  props: {},
  data() {
    return {};
  },
  methods: {
    onSubmit() {},
  },
};
</script>

<style lang="scss" scoped>
.crud-ui-panel {
  padding: 10px;
  background: $white;
  border-radius: $ui-block-border-radius;
  margin-bottom: 15px;
}
</style>
