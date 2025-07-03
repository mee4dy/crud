<template>
  <div class="crud-ui-panel-filters-item">
    <b-row>
      <b-col v-if="filter.options">
        <b-form-select @change="onChange" :options="options"></b-form-select>
      </b-col>
      <template v-if="filter.type === 'period'">
        <b-col>
          <b-form-datepicker
            :value="values?.[`${filter.key}_from`]"
            @input="onChange({ from: $event })"
            :placeholder="filter.placeholder"
            size="sm"
          />
        </b-col>
        <b-col>
          <b-form-datepicker
            :value="values?.[`${filter.key}_to`]"
            @input="onChange({ to: $event })"
            :placeholder="filter.placeholder"
            size="sm"
          />
        </b-col>
      </template>
      <template v-else>
        <b-col>
          <b-form-input :value="values?.[filter.key]" @change="onChange" :placeholder="filter.placeholder" size="sm" />
        </b-col>
      </template>
    </b-row>
  </div>
</template>

<script>
import { BRow, BCol, BFormSelect, BFormDatepicker, BFormInput } from 'bootstrap-vue';
import moment from 'moment';

export default {
  components: {
    'b-row': BRow,
    'b-col': BCol,
    'b-form-select': BFormSelect,
    'b-form-datepicker': BFormDatepicker,
    'b-form-input': BFormInput,
  },
  props: {
    filter: {
      type: Object,
    },
    values: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    options() {
      return this.filter.options.map((option) => {
        return {
          text: option.label,
          value: option.value,
        };
      });
    },
  },
  methods: {
    dateFormat(value) {
      const dateFormat = 'YYYY-MM-DD';

      return moment(value).format(dateFormat);
    },
    onChange(newValue) {
      if (newValue?.from || newValue?.to) {
        const { values, filter } = this;
        const keyFrom = `${filter.key}_from`;
        const keyTo = `${filter.key}_to`;

        return this.$emit('filter:change', {
          [keyFrom]: this.dateFormat(newValue.from || values?.[keyFrom]),
          [keyTo]: this.dateFormat(newValue.to || values?.[keyTo]),
        });
      }

      this.$emit('filter:change', newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.crud-ui-panel-filters-item {
}
</style>
