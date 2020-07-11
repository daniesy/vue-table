<template>
  <button
    class="table-action"
    :class="`table-action--${type}`"
    @click="clicked"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    type: String,
    edit: Boolean
  },
  data: () => ({
    actions: null
  }),
  methods: {
    clicked(e) {
      if (this.edit) {
        this.actions.toggleEdit();
      }
      this.$emit("clicked", e);
    },
    findActions(parent) {
      if (parent.$options.name === "Actions") {
        return parent;
      }
      return this.findActions(parent.$parent);
    }
  },
  mounted() {
    this.actions = this.findActions(this.$parent);
  }
};
</script>

<style lang="scss" scoped>
.table-action {
  text-align: center;
  outline: none;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: transparent;
  border: transparent;

  letter-spacing: 0.4px;
  font-size: inherit;
  text-transform: uppercase;
  cursor: pointer;
  &.table-action--primary {
    color: var(--table-primary-color);
    font-weight: 600;
  }
  &.table-action--secondary {
    color: var(--table-secondary-color);
  }
  &.table-action--success {
    color: var(--table-success-color);
  }
  &.table-action--danger {
    color: var(--table-danger-color);
  }
}
</style>
