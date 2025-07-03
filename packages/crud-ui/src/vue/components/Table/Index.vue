<template>
  <div class="crud-ui-table">
    <b-overlay :show="$attrs.busy" rounded opacity="0.6" spinner spinner-variant="secondary">
      <b-table
        responsive
        fixed
        hover
        bordered
        :show-empty="!$attrs.busy"
        :sticky-header="stickyHeader"
        label-sort-asc=""
        label-sort-desc=""
        label-sort-clear=""
        :fields="fieldsComputed"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <template #head()="data">
          <ui-table-th :data="data" />
        </template>
        <template #cell()="data">
          <ui-table-td :data="data" @change="onChange(data, $event)" />
        </template>

        <template #empty="scope">
          <div>{{ emptyText }}</div>
        </template>
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
          <ui-table-td v-if="slot.startsWith('cell')" :data="scope" @change="onChange(scope, $event)">
            <slot :name="slot" v-bind="scope" />
          </ui-table-td>
          <slot v-else :name="slot" v-bind="scope" />
        </template>
      </b-table>
    </b-overlay>
  </div>
</template>

<script>
import { BOverlay, BTable } from 'bootstrap-vue';
import UiTableTh from './Th/Index.vue';
import UiTableTd from './Td/Index.vue';

export default {
  components: {
    'ui-table-th': UiTableTh,
    'ui-table-td': UiTableTd,
    'b-overlay': BOverlay,
    'b-table': BTable,
  },
  data() {
    return {
      stickyHeader: 'calc(100vh - 55px - 20px)',
      emptyText: 'Нет данных',
    };
  },
  computed: {
    fieldsComputed() {
      const fields = this.$attrs?.fields || [];

      return fields
        .filter((field) => !field.hidden)
        .map((field) => {
          if (field.width) {
            field.thStyle = {
              width: field.width,
            };
          }

          return field;
        });
    },
  },
  methods: {
    onChange(data, newValue) {
      this.$emit('update:value', data, newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.crud-ui-table::v-deep {
  flex: 1;

  .b-overlay-wrap {
    min-height: 100%;
  }

  .table {
    width: auto;
    min-width: 100%;
    height: 1px;
    border-radius: $ui-block-border-radius;
    overflow: hidden;

    .b-table-empty-row {
      td {
        text-align: center;
        padding: 30px;
      }
    }

    tr {
      th {
        padding: 0;
        border-top: none;
        border-left: none;
        border-bottom-width: 1px;

        &[aria-sort] {
          background-size: 0.45em 0.8em !important;
        }
      }

      td {
        box-shadow: none;
        background-color: $white;
        padding: 0;
        border-top: none;
        border-left: none;
      }

      &:hover {
        td {
          background-color: $grey-light;
        }
      }
    }
  }
}
</style>
