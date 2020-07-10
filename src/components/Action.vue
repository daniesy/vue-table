<template>
  <button class="table-action" :class="`table-action--${type}`" @click="clicked">
    <slot/>
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
      this.$emit("click", e);
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
  min-width: 90px;
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
    color: #3366ff;
    font-weight: 600;
  }
  &.table-action--secondary {
    color: #9da4ae;
  }
  &.table-action--success {
    color: #33cc66;
  }
  &.table-action--danger {
    color: #ff3366;
  }

}
</style>

