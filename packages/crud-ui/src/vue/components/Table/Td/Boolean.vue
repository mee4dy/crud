<template>
  <div class="crud-ui-table-td-boolean">
    <b-form-checkbox v-model="data.value" unchecked-value="0" value="1" v-on="$listeners" switch></b-form-checkbox>
  </div>
</template>

<script>
import { BFormCheckbox } from 'bootstrap-vue';

export default {
  components: {
    'b-form-checkbox': BFormCheckbox,
  },
  props: {
    data: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.crud-ui-table-td-boolean {
}
</style>
