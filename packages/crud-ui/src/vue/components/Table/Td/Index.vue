<template>
  <div
    class="crud-ui-table-td"
    :class="{ 'crud-ui-table-td--center': centered }"
    :style="{ width: this.field?.width }"
    :title="tooltip"
  >
    <slot v-if="hasSlot"></slot>
    <template v-else>
      <span v-if="prefix" class="crud-ui-table-td-prefix">{{ prefix }}</span>
      <ui-table-td-boolean v-if="fieldType === 'boolean'" :data="data" v-on="$listeners"></ui-table-td-boolean>
      <ui-table-td-date v-else-if="fieldType === 'date'" :data="data" v-on="$listeners"></ui-table-td-date>
      <ui-table-td-datetime v-else-if="fieldType === 'datetime'" :data="data" v-on="$listeners"></ui-table-td-datetime>
      <ui-table-td-link v-else-if="fieldType === 'link'" :data="data" v-on="$listeners"></ui-table-td-link>
      <ui-table-td-number v-else-if="fieldType === 'number'" :data="data" v-on="$listeners"></ui-table-td-number>
      <ui-table-td-value v-else>{{ data.value }}</ui-table-td-value>
      <span v-if="suffix" class="crud-ui-table-td-suffix">{{ suffix }}</span>
    </template>
  </div>
</template>

<script>
import UiTableTdBoolean from './Boolean.vue';
import UiTableTdDate from './Date.vue';
import UiTableTdDatetime from './Datetime.vue';
import UiTableTdLink from './Link.vue';
import UiTableTdNumber from './Number.vue';
import UiTableTdValue from './Value.vue';

export default {
  components: {
    'ui-table-td-boolean': UiTableTdBoolean,
    'ui-table-td-date': UiTableTdDate,
    'ui-table-td-datetime': UiTableTdDatetime,
    'ui-table-td-link': UiTableTdLink,
    'ui-table-td-number': UiTableTdNumber,
    'ui-table-td-value': UiTableTdValue,
  },
  props: {
    data: {
      type: Object,
    },
  },
  computed: {
    field() {
      return this.data?.field;
    },
    fieldType() {
      return this.field?.type || 'value';
    },
    tooltip() {
      return this.field?.tooltip;
    },
    prefix() {
      return this.field?.prefix;
    },
    suffix() {
      return this.field?.suffix;
    },
    hasSlot() {
      return !!this.$slots['default'];
    },
    centered() {
      return this.field?.centered || ['boolean'].includes(this.fieldType);
    },
  },
};
</script>

<style lang="scss" scoped>
.crud-ui-table-td {
  display: flex;
  align-items: center;
  text-align: left;
  height: 100%;
  font-size: 14px;
  padding: 10px;

  &--center {
    align-items: center;
    justify-content: center;
  }

  .btn {
    margin-right: 5px;
    margin-bottom: 5px;
  }

  &-prefix,
  &-suffix {
    white-space: pre;
  }
}
</style>
