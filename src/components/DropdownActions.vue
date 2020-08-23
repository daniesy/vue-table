<template>
  <td
    class="table-cell table-dr-actions"
    :class="{
      'table-dr-actions--vertical': verticalActions,
      'table-dr-actions--left': leftActions
    }"
  >
    <div
      @click.stop="toggle"
      :for="`dropdown-${index}`"
      class="table-dropdown"
      :class="{ 'table-dropdown--active': isVisible }"
    >
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="dropdown-menu">
        <template v-if="editMode">
          <action
            @clicked="$parent.saveChanges(index)"
            type="success"
            :class="actionClass"
            >{{ saveLabel }}</action
          >
          <action
            @clicked="$parent.cancelChanges(index)"
            type="secondary"
            :class="actionClass"
            >{{ cancelLabel }}</action
          >
        </template>
        <slot v-else />
      </div>
    </div>
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
    actionClass: String,
    verticalActions: Boolean,
    leftActions: Boolean,
    activeIndex: Number
  },
  computed: {
    isVisible() {
      return this.index === this.activeIndex;
    }
  },
  methods: {
    toggleEdit() {
      this.$parent.toggleEdit(this.id);
    },
    elementChanged(e) {
      this.dropdownActive = e.target.checked;
    },
    toggle() {
      this.$emit("toggle", this.isVisible ? -1 : this.index);
    }
  }
};
</script>

<style lang="scss" scoped>
.table-dr-actions {
  .table-dropdown {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 30px;
    height: 20px;
    padding: 5px;
    box-sizing: border-box;
    transition: 0.3s background ease-in-out;
    border-radius: 4px;
    user-select: none;
    cursor: pointer;
    &:hover {
      background: #eaedf3;
      .circle {
        background: #203152;
      }
    }
    .circle {
      display: block;
      width: 4px;
      height: 4px;
      flex: 0 0 auto;
      background: #9da4ae;
      border-radius: 50%;
      transition: 0.3s background ease-in-out;
    }
    .dropdown-menu {
      position: absolute;
      right: 0;
      top: 100%;
      background: #eaedf3;
      border-radius: 4px 0 4px 4px;
      box-sizing: border-box;
      display: none;
      z-index: 1;
      button {
        padding: 10px 15px;
      }
    }
    &.table-dropdown--active {
      border-radius: 4px 4px 0 0;
      background: #eaedf3;
      .circle {
        background: #203152;
      }
      .dropdown-menu {
        display: block;
      }
    }
  }

  &.table-dr-actions--vertical {
    .table-dropdown {
      flex-direction: column;
      height: 30px;
      width: 20px;
    }
  }
  &.table-dr-actions--left {
    .table-dropdown {
      &.table-dropdown--active {
        border-radius: 0 4px 4px 0;
      }
      .dropdown-menu {
        position: absolute;
        right: 100%;
        top: 0;
      }
    }
  }
}
</style>
