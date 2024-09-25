<script setup generic="T" lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import type { ComboBoxOption } from "./ComboBox.vue";

export interface Props<T> {
  id: string;
  options?: ComboBoxOption<T>[];
  label?: string;
  noOptionsSelectedText?: string;
  allOptionsSelectedText?: string;
}

const {
  id,
  options = [],
  label = "",
  noOptionsSelectedText = null,
  allOptionsSelectedText = null,
} = defineProps<Props<T>>();

const selected = defineModel<Set<T>>("selected", { required: true });

const popupOpen = ref(false);
const focusedIndex = ref(0);

const CHECKBOX_PATH =
  "m424-325.847 268.922-268.922-42.153-42.153L424-410.153l-114-114L267.847-482 424-325.847ZM212.309-140.001q-30.308 0-51.308-21t-21-51.308v-535.382q0-30.308 21-51.308t51.308-21h535.382q30.308 0 51.308 21t21 51.308v535.382q0 30.308-21 51.308t-51.308 21H212.309Zm0-59.999h535.382q4.616 0 8.463-3.846 3.846-3.847 3.846-8.463v-535.382q0-4.616-3.846-8.463-3.847-3.846-8.463-3.846H212.309q-4.616 0-8.463 3.846-3.846 3.847-3.846 8.463v535.382q0 4.616 3.846 8.463 3.847 3.846 8.463 3.846ZM200-760V-200-760Z";
const CHECKBOX_OUTLINE_PATH =
  "M212.309-140.001q-30.308 0-51.308-21t-21-51.308v-535.382q0-30.308 21-51.308t51.308-21h535.382q30.308 0 51.308 21t21 51.308v535.382q0 30.308-21 51.308t-51.308 21H212.309Zm0-59.999h535.382q4.616 0 8.463-3.846 3.846-3.847 3.846-8.463v-535.382q0-4.616-3.846-8.463-3.847-3.846-8.463-3.846H212.309q-4.616 0-8.463 3.846-3.846 3.847-3.846 8.463v535.382q0 4.616 3.846 8.463 3.847 3.846 8.463 3.846Z";

const popup = useTemplateRef<HTMLElement>("popup");
const input = useTemplateRef<HTMLInputElement>("input");
const optionItems = useTemplateRef<HTMLLIElement[]>("optionItems");

const selectedOptions = computed(() => options.filter((option) => selected.value.has(option.id)));
const inputText = computed(() => {
  const selectedCount = selectedOptions.value.length;
  if (allOptionsSelectedText != null && selectedCount == options.length) {
    return allOptionsSelectedText;
  } else if (noOptionsSelectedText != null && selectedCount == 0) {
    return noOptionsSelectedText;
  } else if (selectedCount == 1) {
    return selectedOptions.value[0].text;
  } else {
    return `${selectedOptions.value.length} selected options`;
  }
});
const focusedOption = computed(() => options[focusedIndex.value]);

onMounted(() => document.addEventListener("click", closePopupIfClickIsOutside));
onUnmounted(() => document.removeEventListener("click", closePopupIfClickIsOutside));

function makeFocusedVisible() {
  const optionItem = optionItems.value?.find((o) => o.dataset.id == focusedOption.value.id);

  const top = optionItem!.offsetTop - popup.value!.scrollTop;
  const bottom = top + optionItem!.clientHeight;

  if (top < 0) {
    popup.value?.scrollTo(0, optionItem!.offsetTop);
  } else if (bottom > popup.value!.clientHeight) {
    popup.value?.scrollTo(
      0,
      optionItem!.offsetTop - popup.value.clientHeight + optionItem!.clientHeight
    );
  }
}

function closePopupIfClickIsOutside(e: any) {
  popupOpen.value &&= popup.value!.contains(e.target) || input.value!.contains(e.target);
}

function openPopup() {
  moveFocusToFirst();
  popupOpen.value = true;
}

function closePopup() {
  popupOpen.value = false;
  input.value?.focus();
}

function moveFocusDown() {
  focusedIndex.value = (focusedIndex.value + 1) % options.length;
  makeFocusedVisible();
}

function moveFocusUp() {
  focusedIndex.value = (focusedIndex.value + options.length - 1) % options.length;
  makeFocusedVisible();
}

function moveFocusToFirst() {
  focusedIndex.value = 0;
  makeFocusedVisible();
}

function moveFocusToLast() {
  focusedIndex.value = options.length - 1;
  makeFocusedVisible();
}

function toggleOptionSelected(optionId: T) {
  focusedIndex.value = options.findIndex((option) => option.id == optionId);
  if (selected.value.has(optionId)) {
    selected.value.delete(optionId);
  } else {
    selected.value.add(optionId);
  }
}

function onDownKeyPressed() {
  if (!popupOpen.value) {
    openPopup();
  } else {
    moveFocusDown();
  }
}

function onClick() {
  if (!popupOpen.value) {
    openPopup();
  } else {
    toggleOptionSelected(focusedOption.value.id);
  }
}
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
      :aria-controls="id + '_popup'"
      :aria-expanded="popupOpen"
      :aria-activedescendant="id + '_option_' + options[focusedIndex].id"
      :aria-label="label"
      aria-autocomplete="none"
      role="combobox"
    >
      <span class="input-text">{{ inputText }}</span>
      <svg class="input-icon" viewBox="0 -960 960 960" role="img">
        <title>down-arrow</title>
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M480-357q-6 0-11-2t-10-7L261-564q-8-8-7.5-21.5T262-607q10-10 21.5-8.5T304-606l176 176 176-176q8-8 21.5-9t21.5 9q10 8 8.5 21t-9.5 22L501-366q-5 5-10 7t-11 2Z"
        />
      </svg>
    </button>
    <ul ref="popup" :id="id + '_popup'" class="popup" v-show="popupOpen" role="listbox">
      <li
        ref="optionItems"
        v-for="(option, index) in options"
        :key="String(option.id)"
        :id="id + '_option_' + option.id"
        :data-id="option.id"
        :class="{ focused: index == focusedIndex }"
        :aria-selected="selected.has(option.id)"
        @click="toggleOptionSelected(option.id)"
        role="option"
      >
        <svg class="input-icon" viewBox="0 -960 960 960" role="img">
          <title>checkbox</title>
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
