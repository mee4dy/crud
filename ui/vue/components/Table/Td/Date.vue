<template>
  <div class="crud-ui-table-td-date">
    <template v-if="data.value">
      {{ data.value | date }}
    </template>
    <template v-else>-</template>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.crud-ui-table-td-date {
}
</style>
