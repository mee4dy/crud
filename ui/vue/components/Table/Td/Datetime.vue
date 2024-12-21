<template>
  <div class="crud-ui-table-td-datetime">
    <template v-if="data.value">
      {{ data.value | datetime }}
    </template>
    <template v-else>-</template>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    data: {
      type: Object,
    },
  },
  filters: {
    date: (val) => moment(val).format('DD.MM.YYYY'),
    datetime: (val) => moment(val).format('DD.MM.YYYY hh:mm:ss'),
  },
};
</script>

<style lang="scss" scoped>
.crud-ui-table-td-datetime {
}
</style>
