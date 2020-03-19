<template>
  <td
    class="table-cell"
    :class="[
      `table-cell--${id}`,
      isEditing ? 'table-cell--editing' : '',
      hoverIndex === index ? 'table-cell--hover' : ''
    ]"
    :title="value"
  >
    <template v-if="isEditing">
      <div class="label">{{ column }}</div>
      <input
        v-model="newValue"
        @keyup.esc="$parent.cancelChanges(index)"
        @keyup.enter="$parent.saveChanges(index)"
      />
    </template>
    <template v-else>
      <div class="label">{{ column }}</div>
      <div class="value"><slot /></div>
    </template>
  </td>
</template>
<script>
export default {
  name: "Cell",
  data: () => ({
    newValue: ""
  }),
  props: {
    id: String,
    index: Number,
    hoverIndex: Number,
    order: Number,
    editableOrder: Number,
    column: String,
    value: String,
    editable: Boolean,
    editMode: Boolean
  },
  computed: {
    key() {
      return this.$vnode.key;
    },
    isEditing() {
      return this.editable && this.editMode;
    }
  },
  methods: {
    reset() {
      this.newValue = this.value;
    },
    saveEdit() {
      return {
        value: this.newValue,
        oldValue: this.value,
        key: this.id
      };
    },
    cancelEdit() {
      this.reset();
    }
  },
  mounted() {
    this.reset();
  }
};
</script>

<style lang="scss" scoped>
.table-cell {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  .label {
    font-weight: bold;
  }
  @media only screen and (min-width: 768px) {
    display: block;
    .label {
      display: none;
    }
  }
}
</style>
