<template>
  <div class="crud-ui-table-td-number">
    <template v-if="data.value">
      {{ data.value | number(' ', precision) }}
    </template>
    <template v-else>0</template>
    <span v-if="percent !== undefined" class="percent">{{ percent }}%</span>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
    },
  },
  computed: {
    percent() {
      const { field, item, value } = this.data;

      if (!field?.percent?.from) {
        return;
      }

      const valueFrom = item[field.percent.from];

      return valueFrom > 0 && value > 0 ? ((+value / +valueFrom) * 100).toFixed(2) : 0;
    },
    precision() {
      return this.data?.field?.precision;
    },
  },
  filters: {
    number(value, delimiter = ' ', precision = 0) {
      return (Math.round(parseFloat(value) * 100) / 100)
        .toFixed(precision)
        .toString()
        .replace(/,/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
    },
  },
};
</script>

<style lang="scss" scoped>
.crud-ui-table-td-number {
  .percent {
    font-weight: 100;
    color: #444;
    margin-left: 5px;
  }
}
</style>
