<template>
  <div class="crud-ui-panel-groups">
    <b-form-group label="Гуппировка">
      <b-form-checkbox-group v-model="value" :options="options" size="sm" buttons></b-form-checkbox-group>
    </b-form-group>
  </div>
</template>

<script>
import { BFormGroup, BFormCheckboxGroup } from 'bootstrap-vue';

export default {
  components: {
    'b-form-group': BFormGroup,
    'b-form-checkbox-group': BFormCheckboxGroup,
  },
  props: {
    groups: {
      type: Array,
      default: () => [],
    },
    selectedGroups: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selected: 'date',
    };
  },
  computed: {
    options() {
      return this.groups.map((group) => {
        return { text: group.label, value: group.key };
      });
    },
    value: {
      get() {
        return this.selectedGroups;
      },
      set(value) {
        this.$emit('groups:change', value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.crud-ui-panel-groups {
  .col-form-label {
    font-size: 14px;
    font-weight: 500;
    padding-bottom: 3px;
  }

  .btn-group-toggle {
    .btn {
      &:not(.active) {
        &:hover,
        &:active,
        &:focus,
        &.focus {
          color: #fff;
          background-color: #6c757d;
          border-color: #6c757d;
        }
      }
    }
  }
}
</style>
