<template>
  <td
    class="table-cell"
    :class="[
      `table-cell--${id}`,
      isEditing ? 'table-cell--editing' : '',
      hasError ? 'table-cell--error' : '',
      hoverIndex === index ? 'table-cell--hover' : ''
    ]"
    :title="value"
  >
    <template v-if="isEditing">
      <div class="label">{{ column }}</div>
      <input
        v-model="newValue"
        @keyup.esc="$parent.cancelChanges(index, id)"
        @keyup.enter="$parent.saveChanges(index, id)"
      />
      <div class="error-info" :data-tooltip="error">i</div>
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
    item: Object,
    id: String,
    index: Number,
    hoverIndex: Number,
    order: Number,
    editableOrder: Number,
    column: String,
    editable: Boolean,
    editMode: Boolean,
    error: {
      type: String,
      default: "This is an error",
    },
  },
  computed: {
    value() {
      return this.item[this.id] || "";
    },
    key() {
      return this.$vnode.key;
    },
    isEditing() {
      return this.editable && this.editMode;
    },
    hasError() {
      return !!this.error;
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
  &.table-cell--editing {
    position: relative;
    overflow: visible;
    .error-info {
      position: absolute;
      font-size: 10px;
      width: 12px;
      height: 12px;
      border: 1px solid;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #E12640;
      top: calc(50% + 10px);
      transform: translateY(-50%);
      opacity: 0;
      right: -5px;
      z-index: 10;
      transition: right .4s ease-out, opacity .3s ease-out;
    }
    &.table-cell--error {
      input {
        border-color: #E12640;
      }
      .error-info {
        opacity: 1;
        right: 40px;
      }
    }
  }

  @media only screen and (min-width: 768px) {
    display: block;
    .label {
      display: none;
    }
    &.table-cell--editing {
      .error-info {
        top: 50%;
        transform: translateY(-50%);
        opacity: 0;
        right: -5px;
      }
      &.table-cell--error {
        .error-info {
          right: 20px;
        }
      }
    }
  }
  
}
</style>
