<template>
  <table class="vue-table" :class="{'vue-table--wrap': wrap}" :style="sizesStyle">
    <thead>
      <tr>
        <slot />
        <column v-if="hasActions" min="auto" max="auto" hidden label="" />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="item.id">
        <template v-for="(column, order) in columnsToDisplay">
          <slot
            :name="column.id"
            :id="column.id"
            :index="index"
            :column="column.label"
            :order="order"
            :editable="column.editable"
            :edit-mode="editingColumns[index] || false"
            :item="item"
          >
            <cell
              :name="column.id"
              :id="column.id"
              :index="index"
              :column="column.label"
              :order="order"
              :editable="column.editable"
              :edit-mode="editingColumns[index] || false"
              :item="item"
              :key="`${item.id}${column.id}`"
            >
              {{ item[column.id] }}
            </cell>
          </slot>
        </template>
        <actions
          :key="`${item.id}actions`"
          :index="index"
          :edit-mode="editingColumns[index] || false"
          :save-label="saveLabel"
          :cancel-label="cancelLabel"
          :action-class="actionClass"
        >
          <slot name="actions" :index="index" />
        </actions>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Actions from "./Actions";
import Cell from "./Cell";
import Column from "./Column";

export default {
  name: "Table",
  components: {
    Actions,
    Cell,
    Column
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    saveLabel: {
      type: String,
      default: "Save"
    },
    cancelLabel: {
      type: String,
      default: "Cancel"
    },
    actionClass: String,
    wrap: Boolean,
    id: {
      type: String,
      required: true,
    }
  },
  data: () => ({
    columns: [],
    sizes: [],
    editingColumns: {},
    sortColumns: null,
  }),
  computed: {
    columnsToDisplay() {
      return this.columns.filter(c => c.id);
    },
    sizesStyle() {
      const sizes = this.sizes.map(s => `minmax(${s.min}, ${s.max})`).join(" ");
      return `grid-template-columns: ${sizes}`;
    },
    hasActions() {
      return (
        this.$scopedSlots.actions && this.$scopedSlots.actions().length !== 0
      );
    }
  },
  mounted() {
    this.columns = this.$children.filter(c => c.$options.name === "Column");
    this.loadSizes();    
    this.loadSort();
  },
  methods: {
    saveSizes() {
      // wait to finish updating
      this.$nextTick(() => {
        localStorage.setItem(`${this.id}-column-sizes`, JSON.stringify(this.sizes));
      });
    },
    loadSizes() {
      const sizes = localStorage.getItem(`${this.id}-column-sizes`);
      if (sizes) { 
        this.sizes = JSON.parse(sizes);
      } else {
        this.refreshSizes();
      }
    },
    refreshSizes() {    
      this.sizes = this.columns.map(c => ({ min: c.min, max: c.currentMax }));
    },
    stopEdit(index) {
      this.$set(this.editingColumns, index, false);
    },
    toggleEdit(index) {
      this.$set(
        this.editingColumns,
        index,
        Boolean(1 - (this.editingColumns[index] | 0))
      );
    },
    editableCellsAtIndex(index) {
      return this.$children.filter(
        c => c.$options.name === "Cell" && c.index === index && c.editable
      );
    },
    saveChanges(index) {
      this.stopEdit(index);
      const values = this.editableCellsAtIndex(index).map(c => c.saveEdit());
      this.$emit("update-item", values, index);
    },
    cancelChanges(index) {
      this.stopEdit(index);
      this.editableCellsAtIndex(index).forEach(c => c.cancelEdit());
    },
    sort(id, direction) {
      this.columns.forEach(column => {
        if (column.id === id && column.sortable) {
          column.isSorting = true;
          column.isSortingDesc = direction === "desc";
        } else {
          column.isSorting = false;
        }
      });

      this.saveSort({id, direction})
      this.$emit("sort", id, direction);
    },
    saveSort(data) {
      localStorage.setItem(`${this.id}-column-sort`, JSON.stringify(data));
    },
    loadSort() {
      const sort = localStorage.getItem(`${this.id}-column-sort`);
      if (sort) {
        const {id, direction} = JSON.parse(sort);
        this.sort(id, direction);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

table.vue-table {

  --table-font-color: #203152;
  --table-primary-color: #3366ff;
  --table-secondary-color: #9da4ae;
  --table-success-color: #33cc66;
  --table-danger-color: #ff3366;

  display: block;
  min-width: 100%;
  border-collapse: collapse;
  border: 1px solid #eaedf3;
  box-sizing: border-box;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  font-size: 14px;
  text-align: left;
  color: var(--table-font-color);

  &.vue-table--wrap {
    td,
    td * {
        overflow-wrap: break-word;
        word-wrap: break-word;
        hyphens: auto;
        white-space: normal;
    }
  }
  thead {
    display: none;
  }
  tbody,
  tr {
    display: contents;
  }
  &:hover {
    box-shadow: 0 0.5rem 2rem #d8dfed;
  }
  .table-column {
    border-bottom: 1px solid #eaedf3;
    font-weight: bold;
  }
  tr {
    &:hover {
      td {
        background: rgba(212, 218, 226, 0.15) !important;
      }
    }

    &:nth-child(2n + 1) {
      td {
        background: rgba(212, 218, 226, 0.1);
      }
    }

    th .table-column-wrapper,
    td.table-cell {
      padding: 20px;
    }

    td.table-cell {
      min-height: 100%;
      box-sizing: border-box;
      // align-items: center;

      &.table-cell--editing {
        padding: 5px 20px;
      }

      input {
        display: block;
        width: 100%;
        background: #ffffff;
        box-sizing: border-box;
        border-radius: 4px;
        border: 1px solid #eaedf3;
        padding: 15px 15px;
        font-size: inherit;
        margin: 0;
      }
    }
    td.table-actions {
      border-bottom: 1px solid #eaedf3;
    }
  }

  @media only screen and (min-width: 768px) {
    display: grid;
    align-items: center;
    min-width: 100%;
    thead {
      display: contents;
    }
    tbody {
      tr {
        td.table-cell {
          &.table-cell--editing {
            padding: 5px 5px;
          }
        }
        td.table-actions {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
