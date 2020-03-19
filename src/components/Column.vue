<template>
  <th
    @click="sort"
    :id="id"
    class="table-column table-cell"
    :class="[id ? `table-cell--${id}` : '', hidden ? `table-column--hidden` : '', sortable ? `table-column--sortable` : '']">    

    {{ label }}
    <template v-if="sortable">
      <i class="fas" :class="sortingClass"></i>
    </template>

  </th>
</template>
<script>
export default {
  name: "Column",
  data: () => ({
    isSorting: false,
    isSortingDesc: false,
  }),
  props: {
    id: String,
    editable: Boolean,
    sortable: Boolean,
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
    },
  },
  methods: {
    sort() {
      this.isSortingDesc = this.isSorting ? !this.isSortingDesc : true;
      this.$parent.sort(this.id, this.isSortingDesc ? 'desc' : 'asc');
    }
  }
};
</script>

<style lang="scss" scoped>
.table-column {
  text-align: left;
  position: sticky;
  top: 0;
  background: white;
  &.table-column--sortable {  
      user-select: none;
      display: grid;
      grid-template-columns: 1fr 10px;
      align-items: center;    
      cursor: pointer;
      &:hover {
        background: rgba(212, 218, 226, 0.1);
      }
  }
}
</style>

