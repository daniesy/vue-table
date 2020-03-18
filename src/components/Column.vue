<template>
  <th
    :id="id"
    class="table-column table-cell"
    :class="[id ? `table-cell--${id}` : '', hidden ? `table-column--hidden` : '', sotable ? `table-column--sortable` : '']">    
    {{ label }}<i v-if="sortable" class="fas fa-sort"></i>
  </th>
</template>
<script>
export default {
  name: "Column",
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
  display: flex;
  justify-content: space-between;
  &.table-column--sortable {
    cursor: pointer;
    &:hover {
      background: rgba(212, 218, 226, 0.1);
    }
  }
}
</style>

