<template>
  <span class="crud-ui-mdi mdi" :class="icon" :style="style"></span>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
    },
    size: {
      type: Number | String,
      default: 18,
    },
  },
  computed: {
    style() {
      return {
        'font-size': `${this.size}px`,
      };
    },
  },
};
</script>
