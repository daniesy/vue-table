<template>
  <td class="table-cell table-actions">
    <template v-if="editMode">
      <action
        @clicked="$parent.saveChanges(index)"
        type="success"
        :class="actionClass"
        :tooltip="saveLabel"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.75 0.25H1.75C0.9175 0.25 0.25 0.925 0.25 1.75V12.25C0.25 13.075 0.9175 13.75 1.75 13.75H12.25C13.075 13.75 13.75 13.075 13.75 12.25V3.25L10.75 0.25ZM7 12.25C5.755 12.25 4.75 11.245 4.75 10C4.75 8.755 5.755 7.75 7 7.75C8.245 7.75 9.25 8.755 9.25 10C9.25 11.245 8.245 12.25 7 12.25ZM9.25 4.75H1.75V1.75H9.25V4.75Z"
            fill="black"
          />
        </svg>
      </action>
      <action
        @clicked="$parent.cancelChanges(index)"
        type="secondary"
        :class="actionClass"
        :tooltip="cancelLabel"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.25 1.8075L10.1925 0.75L6 4.9425L1.8075 0.75L0.75 1.8075L4.9425 6L0.75 10.1925L1.8075 11.25L6 7.0575L10.1925 11.25L11.25 10.1925L7.0575 6L11.25 1.8075Z"
            fill="black"
          />
        </svg>
      </action>
    </template>
    <slot v-else />
  </td>
</template>

<script>
import Action from "./Action";
export default {
  name: "Actions",
  components: { Action },
  props: {
    index: Number,
    id: [String, Number],
    editMode: Boolean,
    cancelLabel: String,
    saveLabel: String,
    actionClass: String
  },
  methods: {
    toggleEdit() {
      this.$parent.toggleEdit(this.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.table-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  @media only screen and (min-width: 768px) {
    justify-content: inherit;
  }
}
</style>
