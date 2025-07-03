<template>
  <div class="crud-ui-table-td-link">
    <a class="overflow-auto" :href="link" target="_blank">{{ data.value }}</a>
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
    link() {
      const value = this.data.value;

      return value.startsWith('http') ? value : `https://${value}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.crud-ui-table-td-link {
  display: flex;
  max-width: 100%;
}
</style>
