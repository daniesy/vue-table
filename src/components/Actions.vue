<template>
  <td class="table-actions">
    <template v-if="editMode">
      <action
        @click="$parent.saveChanges(index)"
        type="success"
        :class="actionClass"
      >{{ saveLabel }}</action>
      <action
        @click="$parent.cancelChanges(index)"
        type="secondary"
        :class="actionClass"
      >{{ cancelLabel }}</action>
    </template>
    <slot v-else/>
  </td>
</template>

<script>
import Action from "./Action";
export default {
  name: "Actions",
  components: { Action },
  props: {
    index: Number,
    editMode: Boolean,
    cancelLabel: String,
    saveLabel: String,
    actionClass: String
  },
  methods: {
    toggleEdit() {
      this.$parent.toggleEdit(this.index);
    }
  }
};
</script>

<style lang="scss" scoped>
.table-actions {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media only screen and (min-width: 768px) {
    justify-content: inherit;
  }
}
</style>

