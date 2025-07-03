<template>
  <b-button class="crud-ui-btn" v-bind="$attrs" v-on="$listeners">
    <ui-mdi-icon v-if="icon" :icon="icon" :size="iconSizeComputed" />
    <span>
      <slot></slot>
    </span>
  </b-button>
</template>

<script>
import { BButton } from 'bootstrap-vue';
import MdiIcon from '../MdiIcon/Index.vue';

export default {
  components: {
    'b-button': BButton,
    'ui-mdi-icon': MdiIcon,
  },
  props: {
    icon: {
      type: String | Boolean,
      default: false,
    },
    iconSize: {
      type: Number,
      default: undefined,
    },
  },
  computed: {
    iconSizeComputed() {
      if (this.$attrs.size === 'sm') {
        return 14;
      }

      return;
    },
  },
};
</script>

<style lang="scss" scoped>
.crud-ui-btn {
  display: inline-flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;

  .crud-ui-mdi {
    margin-right: 5px;
  }
}
</style>
