<template>
  <div class="crud-ui-panel-filters">
    <b-form-group v-for="filter in filters" :key="filter.key" :label="filter.label">
      <ui-panel-filters-item
        :filter="filter"
        :values="selectedFilters"
        @filter:change="onFilterChange(filter.key, $event)"
      ></ui-panel-filters-item>
    </b-form-group>
  </div>
</template>

<script>
import { BFormGroup } from 'bootstrap-vue';
import UiPanelFiltersItem from './FiltersItem.vue';

export default {
  components: {
    'b-form-group': BFormGroup,
    'ui-panel-filters-item': UiPanelFiltersItem,
  },
  props: {
    filters: {
      type: Array,
    },
    selectedFilters: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    onFilterChange(filterKey, newValue) {
      this.$emit('filters:change', {
        ...this.selectedFilters,
        ...newValue,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.crud-ui-table-filters {
  .col-form-label {
    font-size: 14px;
    font-weight: 500;
    padding-bottom: 3px;
  }
}
</style>
