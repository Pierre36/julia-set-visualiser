<script>
export default {
  name: "MultiComboBox",
  props: {
    options: { type: Array, default: [] },
    selected: { type: Set, default: new Set() },
    label: { type: String, default: "" },
    noOptionsSelectedText: { type: String, default: null },
    allOptionsSelectedText: { type: String, default: null },
  },
  emits: ["update:selected"],
  data() {
    return {
      popupOpen: false,
      focusedIndex: 0,
      CHECKBOX_PATH:
        "m424-325.847 268.922-268.922-42.153-42.153L424-410.153l-114-114L267.847-482 424-325.847ZM212.309-140.001q-30.308 0-51.308-21t-21-51.308v-535.382q0-30.308 21-51.308t51.308-21h535.382q30.308 0 51.308 21t21 51.308v535.382q0 30.308-21 51.308t-51.308 21H212.309Zm0-59.999h535.382q4.616 0 8.463-3.846 3.846-3.847 3.846-8.463v-535.382q0-4.616-3.846-8.463-3.847-3.846-8.463-3.846H212.309q-4.616 0-8.463 3.846-3.846 3.847-3.846 8.463v535.382q0 4.616 3.846 8.463 3.847 3.846 8.463 3.846ZM200-760V-200-760Z",
      CHECKBOX_OUTLINE_PATH:
        "M212.309-140.001q-30.308 0-51.308-21t-21-51.308v-535.382q0-30.308 21-51.308t51.308-21h535.382q30.308 0 51.308 21t21 51.308v535.382q0 30.308-21 51.308t-51.308 21H212.309Zm0-59.999h535.382q4.616 0 8.463-3.846 3.846-3.847 3.846-8.463v-535.382q0-4.616-3.846-8.463-3.847-3.846-8.463-3.846H212.309q-4.616 0-8.463 3.846-3.846 3.847-3.846 8.463v535.382q0 4.616 3.846 8.463 3.847 3.846 8.463 3.846Z",
    };
  },
  computed: {
    selectedOptions() {
      return this.options.filter((option) => this.selected.has(option.id));
    },
    inputText() {
      const nbSelected = this.selectedOptions.length;
      if (this.allOptionsSelectedText != null && nbSelected == this.options.length) {
        return this.allOptionsSelectedText;
      } else if (this.noOptionsSelectedText != null && nbSelected == 0) {
        return this.noOptionsSelectedText;
      } else if (nbSelected == 1) {
        return this.selectedOptions[0].text;
      } else {
        return `${this.selectedOptions.length} selected options`;
      }
    },
    focusedOption() {
      return this.options[this.focusedIndex];
    },
  },
  mounted() {
    document.addEventListener("click", this.closePopupIfClickIsOutside);
  },
  methods: {
    makeFocusedVisible() {
      const optionItem = this.$refs.optionItems.find((o) => o.id == this.focusedOption.id);
      const popup = this.$refs.popup;

      const top = optionItem.offsetTop - popup.scrollTop;
      const bottom = top + optionItem.clientHeight;

      if (top < 0) {
        popup.scrollTo(0, optionItem.offsetTop);
      } else if (bottom > popup.clientHeight) {
        popup.scrollTo(0, optionItem.offsetTop - popup.clientHeight + optionItem.clientHeight);
      }
    },
    closePopupIfClickIsOutside(e) {
      this.popupOpen &&= this.$refs.popup.contains(e.target) || this.$refs.input.contains(e.target);
    },
    openPopup() {
      this.moveFocusToFirst();
      this.popupOpen = true;
    },
    closePopup() {
      this.popupOpen = false;
      this.$refs.input.focus();
    },
    moveFocusDown() {
      this.focusedIndex = (this.focusedIndex + 1) % this.options.length;
      this.makeFocusedVisible();
    },
    moveFocusUp() {
      this.focusedIndex = (this.focusedIndex + this.options.length - 1) % this.options.length;
      this.makeFocusedVisible();
    },
    moveFocusToFirst() {
      this.focusedIndex = 0;
      this.makeFocusedVisible();
    },
    moveFocusToLast() {
      this.focusedIndex = this.options.length - 1;
      this.makeFocusedVisible();
    },
    toggleOptionSelected(optionId) {
      this.focusedIndex = this.options.findIndex((option) => option.id == optionId);
      const newSelected = new Set();
      this.selected.forEach((id) => newSelected.add(id));
      if (this.selected.has(optionId)) {
        newSelected.delete(optionId);
      } else {
        newSelected.add(optionId);
      }
      this.$emit("update:selected", newSelected);
    },
    onDownKeyPressed() {
      if (!this.popupOpen) {
        this.openPopup();
      } else {
        this.moveFocusDown();
      }
    },
    onClick() {
      if (!this.popupOpen) {
        this.openPopup();
      } else {
        this.toggleOptionSelected(this.focusedOption.id);
      }
    },
  },
};
</script>

<template>
  <div class="combobox">
    <button
      ref="input"
      class="input"
      @click="onClick"
      @keydown.down.prevent="onDownKeyPressed"
      @keydown.enter.prevent="onClick"
      @keydown.up.prevent="moveFocusUp"
      @keydown.escape="closePopup"
      @keydown.home.prevent="moveFocusToFirst"
      @keydown.end.prevent="moveFocusToLast"
      @keydown.tab="closePopup"
      aria-controls="popup"
      :aria-expanded="popupOpen"
      :aria-activedescendant="options[focusedIndex].id"
      :aria-label="label"
      aria-autocomplete="none"
      role="combobox"
    >
      <span class="input-text">{{ inputText }}</span>
      <svg class="input-icon" viewBox="0 -960 960 960" role="img">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M480-357q-6 0-11-2t-10-7L261-564q-8-8-7.5-21.5T262-607q10-10 21.5-8.5T304-606l176 176 176-176q8-8 21.5-9t21.5 9q10 8 8.5 21t-9.5 22L501-366q-5 5-10 7t-11 2Z"
        />
      </svg>
    </button>
    <ul ref="popup" id="popup" class="popup" v-show="popupOpen" role="listbox">
      <li
        ref="optionItems"
        v-for="(option, index) in options"
        :key="option.id"
        :id="option.id"
        :class="{ focused: index == focusedIndex }"
        :aria-selected="this.selected.has(option.id)"
        @click="toggleOptionSelected(option.id)"
        role="option"
      >
        <svg class="input-icon" viewBox="0 -960 960 960" role="img">
          <path
            fill="currentColor"
            fill-rule="evenodd"
            :d="selected.has(option.id) ? CHECKBOX_PATH : CHECKBOX_OUTLINE_PATH"
          />
        </svg>
        <span class="input-text">{{ option.text }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.combobox {
  position: relative;
}

.input {
  display: flex;
  width: 100%;
  cursor: pointer;
  padding: calc(var(--input-padding, 0.5rem) / 2);
  padding-left: var(--input-padding, 0.5rem);
  outline: var(--input-outline, none);
  color: var(--input-color, #000000);
  background-color: var(--input-background-color, #ffffff);
  border-width: var(--input-border-width, 1px);
  border-style: var(--input-border-style, solid);
  border-color: var(--input-border-color, #000000);
  border-radius: var(--input-border-radius, 0.25rem);
  text-align: var(--input-text-align, start);
  font-family: var(--input-font-family, sans-serif);
}

.input:focus-visible {
  border-color: var(--input-border-color-focus, hsl(210, 70%, 30%));
}

.input-text {
  flex-grow: 1;
  margin: auto;
  overflow-x: auto;
}

.input-icon {
  min-width: 1.5rem;
  width: 1.5rem;
}

.popup {
  position: absolute;
  z-index: var(--popup-z-index, 100);
  min-width: 100%;
  max-height: 20rem;
  overflow-y: auto;
  top: 0;
  left: 0;
  margin: 0;
  background-color: var(--popup-background-color, #ffffff);
  border-width: var(--popup-border-width, 2px);
  border-style: var(--popup-border-style, solid);
  border-color: var(--popup-border-color, #000000);
  border-radius: var(--popup-border-radius, 0.25rem);
  padding: var(--popup-padding, 0.25rem);
}

[role="listbox"] {
  white-space: nowrap;
}

[role="option"] {
  display: flex;
  gap: 0.4rem;
  cursor: pointer;
  color: var(--option-color, #333333);
  border-radius: var(--option-border-radius, 0.25rem);
  padding: var(--option-padding, 0.25rem);
  margin-block: var(--option-margin-block, 0.1rem);
}

[role="option"].focused,
[role="option"]:hover {
  background-color: var(--option-background-color-highlighted, hsl(210, 70%, 60%));
}

[role="option"][aria-selected="true"] {
  color: var(--option-color-selected, #000000);
}

.tick {
  visibility: hidden;
  width: 1.2rem;
  height: 1.2rem;
}

[aria-selected="true"] .tick {
  visibility: visible;
}
</style>
