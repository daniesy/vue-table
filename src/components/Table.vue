<template>
  <table
    class="vue-table"
    :class="{
      'vue-table--wrap': wrap,
      'vue-table--click': hasClickListener,
      'vue-table--valign': verticalAlign,
      'vue-table--alternate': alternateRows,
      'vue-table--rowspacing': rowSpacing !== 0,
      'vue-table--hover': hoverShadow,
      'vue-table--border': hasBorder
    }"
    :style="style"
  >
    <thead>
      <tr>
        <slot />
        <column
          v-if="hasActions || hasDropdownActions"
          min="auto"
          max="auto"
          hidden
          label=""
        />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in flatData"
        :key="item[trackBy]"
        @click="rowClicked($event, item, index)"
      >
        <template v-for="(column, order) in columnsToDisplay" :key="`${item[trackBy]}${column.id}`">
          <cell
            :ref="el => registerCell(el, index, column.id)"
            :name="column.id"
            :id="column.id"
            :index="index"
            :track-by="trackBy"
            :column="column.label"
            :order="order"
            :editable="column.editable"
            :edit-mode="editingColumns[item[trackBy]] || false"
            :errors="errorColumns[item[trackBy]]"
            :item="data[index]"
          >
            <slot
              :name="column.id"
              :id="column.id"
              :index="index"
              :column="column.label"
              :order="order"
              :editable="column.editable"
              :edit-mode="editingColumns[item[trackBy]] || false"
              :errors="errorColumns[item[trackBy]]"
              :item="data[index]"
            >
              {{ item[column.id] }}
            </slot>
          </cell>
        </template>
        <actions
          :key="`${item[trackBy]}-actions`"
          :index="index"
          :id="item[trackBy]"
          :edit-mode="editingColumns[item[trackBy]] || false"
          :save-label="saveLabel"
          :cancel-label="cancelLabel"
          :action-class="actionClass"
          :item="data[index]"
          v-if="hasActions"
        >
          <slot name="actions" :index="index" :item="data[index]" />
        </actions>
        <dropdown-actions
          :key="`${item[trackBy]}-dropdown-actions`"
          :index="index"
          :id="item[trackBy]"
          :edit-mode="editingColumns[item[trackBy]] || false"
          :save-label="saveLabel"
          :cancel-label="cancelLabel"
          :action-class="actionClass"
          :vertical-actions="verticalActions"
          :left-actions="leftActions"
          :active-index="dropdownActiveIndex"
          :item="data[index]"
          @toggle="changeActiveIndex"
          v-if="hasDropdownActions"
        >
          <slot name="dropdown-actions" :index="index" :item="data[index]" />
        </dropdown-actions>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { reactive } from "vue";
import Actions from "./Actions";
import DropdownActions from "./DropdownActions";
import Cell from "./Cell";
import Column from "./Column";

import { flattenObject, unflattenObject } from "../tools";

export default {
  name: "Table",
  components: {
    DropdownActions,
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
      required: true
    },
    trackBy: {
      type: String,
      default: "id"
    },
    verticalAlign: Boolean,
    verticalActions: Boolean,
    leftActions: Boolean,
    alternateRows: Boolean,
    rowSpacing: {
      type: Number,
      default: 0
    },
    hoverShadow: Boolean,
    hasBorder: Boolean
  },
  data() {
    return {
      flatData: [],
      columns: [],
      sizes: [],
      editingColumns: reactive({}),
      errorColumns: reactive({}),
      sortColumns: null,
      dropdownActiveIndex: -1,
      cellComponents: []
    };
  },
  provide() {
    return {
      table: this
    };
  },
  watch: {
    data: {
      deep: true,
      handler: function(values) {
        this.cellComponents = [];
        this.flatData = values.map(d => flattenObject(d));
      }
    }
  },
  computed: {
    columnsToDisplay() {
      return this.columns.filter(c => c.id);
    },
    sizesStyle() {
      const sizes = this.sizes.map(s => `minmax(${s.min}, ${s.max})`).join(" ");
      return `grid-template-columns: ${sizes}`;
    },
    rowsStyle() {
      return `grid-row-gap: ${this.rowSpacing}px`;
    },
    style() {
      return `${this.sizesStyle};${this.rowsStyle};`;
    },
    hasActions() {
      return !!this.$slots.actions;
    },
    hasDropdownActions() {
      return !!this.$slots["dropdown-actions"];
    },
    hasClickListener() {
      return !!this.$attrs.onClick;
    }
  },
  mounted() {
    this.loadSizes();
    this.loadSort();
    if (this.hasDropdownActions) {
      window.addEventListener("click", this.hideDropdown);
    }
    this.flatData = this.data.map(d => flattenObject(d));
  },
  methods: {
    saveSizes() {
      // wait to finish updating
      this.$nextTick(() => {
        localStorage.setItem(
          `${this.id}-column-sizes`,
          JSON.stringify(this.sizes)
        );
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
    addErrors(key, errors) {
      this.errorColumns[key] = errors;
    },
    removeError(key) {
      this.errorColumns[key] = null;
    },
    stopEdit(key) {
      this.editingColumns[key] = false;
    },
    toggleEdit(key) {
      this.editingColumns[key] = Boolean(1 - (this.editingColumns[key] | 0));
    },
    registerCell(el, index, columnId) {
      if (el) {
        this.cellComponents.push({ el, index, columnId });
      }
    },
    registerColumn(el) {
      if (el && !this.columns.includes(el)) {
        this.columns.push(el);
      }
    },
    editableCellsAtIndex(index) {
      return this.cellComponents
        .filter(c => c.el && c.index === index && c.el.editable)
        .map(c => c.el);
    },
    saveChanges(index, key) {
      const values = this.editableCellsAtIndex(index).map(c => c.saveEdit()),
        packed = unflattenObject(
          values.reduce((carry, { key, value }) => {
            carry[key] = value;
            return carry;
          }, {})
        ),
        isDirty = values.filter(({ oldValue, value }) => oldValue !== value)
          .length;

      const success = () => {
        this.stopEdit(key);
        this.removeError(key);
      };

      const error = errors => {
        this.addErrors(key, errors);
      };

      this.$emit(
        "update-item",
        { values, index, isDirty, packed },
        success,
        error
      );
    },
    cancelChanges(index, key) {
      this.stopEdit(key);
      this.removeError(key);
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

      this.saveSort({ id, direction });
      this.$emit("sort", id, direction);
    },
    saveSort(data) {
      localStorage.setItem(`${this.id}-column-sort`, JSON.stringify(data));
    },
    loadSort() {
      const sort = localStorage.getItem(`${this.id}-column-sort`);
      if (sort) {
        const { id, direction } = JSON.parse(sort);
        this.sort(id, direction);
      }
    },
    rowClicked(event, item, index) {
      if (
        this.editingColumns[index] ||
        event.target.classList.contains("table-action") ||
        event.target.classList.contains("table-dropdown-action")
      ) {
        return;
      }
      this.$emit("clicked", { event, item: unflattenObject(item), index });
    },
    changeActiveIndex(index) {
      this.dropdownActiveIndex = index;
    },
    hideDropdown() {
      this.dropdownActiveIndex = -1;
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

  display: grid;
  min-width: 100%;
  border-collapse: collapse;
  box-sizing: border-box;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  font-size: 14px;
  text-align: left;
  color: var(--table-font-color);
  position: relative;

  &.vue-table--border {
    border: 1px solid #eaedf3;
  }
  &.vue-table--wrap {
    td,
    td * {
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
      white-space: normal;
    }
    td {
      flex-wrap: wrap;
    }
  }
  &.vue-table--alternate {
    tr:nth-child(2n + 1) {
      td {
        background: rgba(212, 218, 226, 0.1);
      }
    }
  }
  &.vue-table--click {
    tr,
    tr td {
      cursor: pointer;
    }
  }
  &.vue-table--valign {
    align-items: center;
    td:not(.table-actions) {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    td.table-actions {
      display: flex;
      align-items: center;
    }
  }
  &.vue-table--rowspacing {
    border: none;
    box-shadow: none !important;
  }
  &.vue-table--hover {
    transition: box-shadow 3s ease-in;
    &:hover {
      box-shadow: 0 0.5rem 2rem #d8dfed;
    }
  }
  [data-tooltip] {
    position: relative;
    &::before,
    &::after {
      top: -15px;
      opacity: 0;
      visibility: hidden;
      transition: 0.3s top ease-in-out, 0.3s opacity ease-in-out,
        0.3s visibility ease-in-out;
    }
    &::before {
      content: "";
      position: absolute;
      display: block;
      background-color: #2b222a;
      width: 8px;
      height: 8px;
      border-radius: 0 0 0 2px;
      clip-path: polygon(0 0, 0% 100%, 100% 100%);
      transform: rotate(-45deg);
      transform-origin: center;
      left: calc(50% - 5px);
      margin-top: -4px;
      z-index: 100000;
    }
    &::after {
      content: attr(data-tooltip);
      display: inline-block;
      position: absolute;
      left: 50%;
      white-space: nowrap;
      transform: translate(-50%, -100%);
      text-transform: none;
      font-weight: normal;
      letter-spacing: normal;
      font-size: 12px;
      background-color: #2b222a;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      z-index: 100;
    }
    &:hover {
      &::before,
      &::after {
        top: -10px;
        opacity: 1;
        visibility: visible;
      }
    }
  }
  thead {
    display: none;
  }
  tbody,
  tr {
    display: contents;
  }
  .table-column {
    border-bottom: 1px solid #eaedf3;
    font-weight: bold;
  }
  tr {
    &:hover {
      td {
        background: #fafafa !important;
      }
    }

    td {
      position: relative;
      background: white;
      transition: 0.4s background ease-in-out;
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
 @media only screen and (max-width: 540px) {
    grid-template-columns: 1fr !important
  }
  @media only screen and (min-width: 540px) and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr) !important;
    td.table-actions {
      grid-column-start: 1;
      grid-column-end: 3;
    }
  }
  @media only screen and (min-width: 768px) {
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
