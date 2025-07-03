<template>
  <div class="crud-ui-panel-actions">
    <ui-btn class="mr-2" icon="mdi-sync" size="sm" type="submit" @click="$emit('refresh')">Применить</ui-btn>
    <ui-btn class="mr-2" icon="mdi-close" size="sm" @click="$emit('reset')">Сброс</ui-btn>
  </div>
</template>

<script>
import UiBtn from '../Btn/Index.vue';

export default {
  components: {
    'ui-btn': UiBtn,
  },
};
</script>

<style lang="scss" scoped>
.crud-ui-panel-actions {
}
</style>
