<template>
  <b-dropdown v-if="fields?.length" class="crud-ui-panel-settings" size="sm" text="Колонки" ref="dropdown">
    <b-dropdown-form>
      <b-form-checkbox
        v-for="field of fieldsComputed"
        :key="field.key"
        v-model="field.value"
        @change="onChangeField(field.key, $event)"
        class="mb-1 px-2"
        >{{ field.label }}</b-form-checkbox
      >
    </b-dropdown-form>
  </b-dropdown>
</template>

<script>
import { BDropdown, BDropdownForm, BFormCheckbox } from 'bootstrap-vue';

export default {
  components: {
    'b-dropdown': BDropdown,
    'b-dropdown-form': BDropdownForm,
    'b-form-checkbox': BFormCheckbox,
  },
  props: {
    fields: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    fieldsComputed() {
      const fields = this.fields || [];

      return fields.map((field) => {
        return {
          ...field,
          value: !field.hidden,
        };
      });
    },
  },
  methods: {
    onChangeField(key, value) {
      const fields = this.fields || [];
      const newFields = fields.map((field) => {
        if (field.key === key) {
          field.hidden = !value;
        }

        return field;
      });

      this.$emit('fields:change', newFields);
    },
  },
};
</script>

<style lang="scss" scoped>
.crud-ui-panel-settings {
  :deep(.dropdown-menu) {
    width: 210px;
    padding: 0;
  }
}
</style>
