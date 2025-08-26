<template>
  <td
    class="table-cell"
    :class="[
      `table-cell--${id}`,
      isEditing ? 'table-cell--editing' : '',
      hasError ? 'table-cell--error' : '',
      hoverIndex === index ? 'table-cell--hover' : '',
    ]"
    :title="value"
  >
    <template v-if="isEditing">
      <div class="label">{{ column }}</div>
      <input
        v-model="newValue"
        @keyup.esc="$parent.cancelChanges(index, item[trackBy])"
        @keyup.enter="$parent.saveChanges(index, item[trackBy])"
      />
      <div class="error-info" :data-tooltip="err">i</div>
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
    newValue: "",
  }),
  props: {
    item: Object,
    id: String,
    trackBy: String,
    index: Number,
    hoverIndex: Number,
    order: Number,
    editableOrder: Number,
    column: String,
    editable: Boolean,
    editMode: Boolean,
    errors: Object,
  },
  computed: {
    value() {
      return this.item[this.id] || "";
    },
    isEditing() {
      return this.editable && this.editMode;
    },
    err() {
      if (!this.errors) {
        return null;
      }
      return this.errors[this.id];
    },
    hasError() {
      return !!this.err;
    },
  },
  methods: {
    reset() {
      this.newValue = this.value;
    },
    saveEdit() {
      return {
        value: this.newValue,
        oldValue: this.value,
        key: this.id,
      };
    },
    cancelEdit() {
      this.reset();
    },
  },
  mounted() {
    this.reset();
  },
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
    color: #e12640;
    top: calc(50% + 10px);
    transform: translateY(-50%);
    opacity: 0;
    visibility: hidden;
    right: -5px;
    z-index: 10;
    transition:
      right 0.4s ease-out,
      opacity 0.3s ease-out;
  }
  &.table-cell--editing {
    position: relative;
    overflow: visible;
    &.table-cell--error {
      input {
        border-color: #e12640;
      }
      .error-info {
        opacity: 1;
        visibility: visible;
        right: 40px;
      }
    }
  }

  @media only screen and (min-width: 768px) {
    display: block;
    .label {
      display: none;
    }
    .error-info {
      top: 50%;
      transform: translateY(-50%);
      right: -5px;
    }
    &.table-cell--editing {
      &.table-cell--error {
        .error-info {
          right: 20px;
        }
      }
    }
  }
}
</style>
