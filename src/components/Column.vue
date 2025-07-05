<template>
  <th
    @click="sort"
    :id="id"
    class="table-column table-cell"
    :class="[
      id ? `table-cell--${id}` : '',
      hidden ? `table-column--hidden` : '',
      sortable ? `table-column--sortable` : '',
      resizable ? `table-column--resizable` : '',
      isResizing ? 'table-column--resizing' : ''
    ]"
  >
    <div class="table-column-wrapper">
      {{ label }}
      <template v-if="sortable">
        <svg
          width="9"
          viewBox="0 0 287 399"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            v-if="!isSorting || (isSorting && !isSortingDesc)"
            d="M262.0660 167.050H24.0657C2.665680 167.050 -8.03432 141.15 7.06568 126.05L126.0660 7.05C135.466 -2.35 150.666 -2.35 159.966 7.05L278.966 126.05C294.166 141.15 283.466 167.050 262.0660 167.050Z"
            fill="black"
          />
          <path
            v-if="!isSorting || (isSorting && isSortingDesc)"
            d="M24.0657 231H262.0660C283.466 231 294.166 256.9 279.0660 272L160.0660 391C150.666 400.4 135.466 400.4 126.166 391L7.06568 272C-8.03432 256.9 2.665680 231 24.0657 231Z"
            fill="black"
          />
        </svg>
      </template>
    </div>
    <div
      @mousedown="initResize"
      @dblclick="resetSize"
      v-if="resizable"
      class="resize-handle"
    />
  </th>
</template>
<script>
export default {
  name: "Column",
  inject: ['table'],
  data: () => ({
    isResizing: false,
    isSorting: false,
    isSortingDesc: false,
    currentMax: ""
  }),
  props: {
    id: String,
    editable: Boolean,
    sortable: Boolean,
    resizable: Boolean,
    label: String,
    hidden: Boolean,
    min: {
      type: String,
      default: "100px"
    },
    max: {
      type: String,
      default: "1fr"
    }
  },
  computed: {
    _class() {
      return this.id ? `table-cell--${this.id}` : "";
    },
    text() {
      return this.hidden ? "&nbsp;" : this.label;
    },
    sortingClass() {
      if (!this.isSorting) {
        return "fa-sort";
      }
      if (this.isSortingDesc) {
        return "fa-sort-down";
      }
      return "fa-sort-up";
    }
  },
  methods: {
    sort() {
      this.isSortingDesc = this.isSorting ? !this.isSortingDesc : true;
      this.$parent.sort(this.id, this.isSortingDesc ? "desc" : "asc");
    },
    initResize() {
      this.isResizing = true;
      window.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("mouseup", this.onMouseUp);
    },
    onMouseMove(e) {
      const column = this.$el;
      requestAnimationFrame(() => {
        const horizontalScrollOffset = document.documentElement.scrollLeft;
        this.currentMax = `${horizontalScrollOffset +
          e.clientX -
          column.offsetLeft}px`;
        this.$parent.refreshSizes();
      });
    },
    onMouseUp() {
      this.isResizing = false;
      window.removeEventListener("mousemove", this.onMouseMove);
      window.removeEventListener("mouseup", this.onMouseUp);
      this.$parent.saveSizes();
    },
    resetSize() {
      this.currentMax = this.max;
      this.$parent.refreshSizes();
    }
  },
  mounted() {
    this.currentMax = this.max;
    if (this.table) {
      this.table.registerColumn(this);
    }
  }
};
</script>

<style lang="scss" scoped>
th.table-column {
  text-align: left;
  position: sticky;
  top: 0;
  background: white;
  display: flex;
  height: calc(100% - 2px);
  z-index: 2;

  &.table-column--sortable .table-column-wrapper {
    flex: 1;
    user-select: none;
    display: grid;
    grid-template-columns: 1fr 10px;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    user-select: none;
  }
  &:hover,
  &.table-column--resizing {
    .resize-handle {
      width: 4px;
    }
  }
  &.table-column--resizing,
  &.table-column--sortable:hover,
  &.table-column--resizable:hover {
    background: rgba(212, 218, 226, 0.2);
  }
  .resize-handle {
    cursor: col-resize;
    width: 0;
    background: black;
    transition: width 0.4s;
  }
  &.table-column--resizing + th.table-column {
    .resize-handle {
      width: 0;
    }
    &:hover {
      background: rgba(212, 218, 226, 0);
    }
  }
}
</style>
