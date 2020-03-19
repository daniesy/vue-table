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
        <i class="fas" :class="sortingClass" />
      </template>
    </div>
    <div @mousedown="initResize" v-if="resizable" class="resize-handle" />
  </th>
</template>
<script>
export default {
  name: "Column",
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
    }
  },
  mounted() {
    this.currentMax = this.max;
  }
};
</script>

<style lang="scss" scoped>
.table-column {
  text-align: left;
  position: sticky;
  top: 0;
  background: white;
  display: flex;
  &.table-column--sortable .table-column-wrapper {
    flex: 1;
    user-select: none;
    display: grid;
    grid-template-columns: 1fr 10px;
    align-items: center;
    cursor: pointer;
  }
  &:hover,
  &.table-column--resizing {
    .resize-handle {
      width: 4px;
    }
  }
  &:hover {
    background: rgba(212, 218, 226, 0.2);
  }
  .resize-handle {
    cursor: col-resize;
    width: 0;
    background: black;
    transition: width 0.4s;
  }
}
</style>
