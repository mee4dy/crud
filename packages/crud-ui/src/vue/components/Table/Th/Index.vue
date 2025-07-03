<template>
  <div class="crud-ui-table-th">{{ data.label }}</div>
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
.crud-ui-table-th {
  display: flex;
  align-items: center;
  text-align: left;
  height: 100%;
  font-size: 14px;
  font-weight: 500;
  padding: 10px;
}
</style>
