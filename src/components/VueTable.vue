<template>
  <table class="vue-table" :style="sizesStyle">
    <thead>
      <tr>
        <slot/>
        <column v-if="hasActions" min="auto" max="auto" hidden label="actions"/>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="item.id">
        <cell
          v-for="(column, order) in columnsToDisplay"
          :id="column.id"        
          :index="index"
          :column="column.label"
          :order="order"
          :editable="column.editable"
          :edit-mode="editingColumns[index] || false"
          :value="item[column.id]"
          :key="`${item.id}${column.id}`"
        >{{ item[column.id] }}</cell>
        <actions
          :key="`${item.id}actions`"
          :index="index"
          :edit-mode="editingColumns[index] || false"
          :save-label="saveLabel"
          :cancel-label="cancelLabel"
          :action-class="actionClass"
        >
          <slot name="actions" :index="index"/>
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
    actionClass: String
  },
  data: () => ({
    columns: [],
    sizes: [],
    editingColumns: {}
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
      return this.$scopedSlots.actions && this.$scopedSlots.actions().length !== 0;
    }
  },
  mounted() {
    this.columns = this.$children.filter(c => c.$options.name === "Column");
    this.sizes = this.columns.map(c => ({ min: c.min, max: c.max }));
  },
  methods: {
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
        column.isSorting = column.id === id && column.sortable;
      });
      this.$emit('sort', id, direction);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

table.vue-table {
  display: block;
  min-width: 100%;
  border-collapse: collapse;
  min-width: 100%;
  border: 1px solid #EAEDF3;
  box-sizing: border-box;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  font-size: 14px;
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
    border-bottom: 1px solid #EAEDF3;
    font-weight: bold;
  }
  tr {
    &:hover {
      td {
        background: rgba(212, 218, 226, 0.15) !important;
      }
    }

    &:nth-child(2n+1) {
      td {
        background: rgba(212, 218, 226, 0.1);
      }
    }

    th,
    td.table-cell {
      padding: 20px;
    }

    td.table-cell {
      align-items: center;

      &.table-cell--editing {
        padding: 5px 20px;
      }

      &.table-actions {
        padding: 0;
      }  
      input {
        display: block;
        width: 100%;
        background: #FFFFFF;
        box-sizing: border-box;
        border-radius: 4px;
        border: 1px solid #EAEDF3;
        padding: 15px 15px;
        font-size: inherit;
        margin: 0;
      }
    }
    td.table-actions {
      border-bottom: 1px solid #EAEDF3;
    }

  }
  .table-actions {
    .table-action {
      background: transparent;
      border: transparent;
      padding: 0.7em 0;
      letter-spacing: 0.4px;
      font-size: inherit;
      text-transform: uppercase;
      &.table-action--primary {
        color: #3366FF;
        font-weight: 600;
      }
      &.table-action--secondary {
        color: #9DA4AE;
      }
      &.table-action--success {
        color: #33CC66;
      }
      &.table-action--danger {
        color: #FF3366;
      }
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
