<script setup generic="T" lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";

export interface ComboBoxOption<IdType> {
  id: IdType;
  text: string;
}

export interface Props<T> {
  id: string;
  options?: ComboBoxOption<T>[];
  label?: string;
}

const { id, options = [], label = "" } = defineProps<Props<T>>();

const selected = defineModel<T>("selected", { required: true });

const popupOpen = ref(false);
const focusedIndex = ref(0);

const popup = useTemplateRef<HTMLElement>("popup");
const input = useTemplateRef<HTMLInputElement>("input");
const optionItems = useTemplateRef<HTMLLIElement[]>("optionItems");

const selectedOption = computed(() => options.find((option) => option.id == selected.value));
const inputText = computed(() =>
  selectedOption.value != undefined ? selectedOption.value.text : ""
);
const sortedOptions = computed(() =>
  options
    .slice()
    .sort((a, b) => (b.id == selected.value ? 1 : 0) - (a.id == selected.value ? 1 : 0))
);
const focusedOption = computed(() => sortedOptions.value[focusedIndex.value]);

onMounted(() => document.addEventListener("click", closePopupIfClickIsOutside));
onUnmounted(() => document.removeEventListener("click", closePopupIfClickIsOutside));

function closePopupIfClickIsOutside(event: MouseEvent): void {
  if (event.target instanceof HTMLElement) {
    popupOpen.value &&=
      popup.value?.contains(event.target) || input.value?.contains(event.target) || false;
  }
}

function makeFocusedVisible(): void {
  const optionItem = optionItems.value?.find((o) => o.dataset.id == focusedOption.value.id);

  const focusedItemTop = optionItem?.offsetTop || 0;
  const focusedItemHeight = optionItem?.clientHeight || 0;
  const popupTop = popup.value?.scrollTop || 0;
  const popupHeight = popup.value?.clientHeight || 0;

  const top = focusedItemTop - popupTop;
  const bottom = top + focusedItemHeight;

  if (top < 0) {
    popup.value?.scrollTo(0, focusedItemTop);
  } else if (bottom > popupHeight) {
    popup.value?.scrollTo(0, focusedItemTop - popupHeight + focusedItemHeight);
  }
}

function openPopup(): void {
  moveFocusToFirst();
  popupOpen.value = true;
}

function closePopup(): void {
  popupOpen.value = false;
  input.value?.focus();
}

function moveFocusToFirst(): void {
  focusedIndex.value = 0;
  makeFocusedVisible();
}

function moveFocusDown(): void {
  focusedIndex.value = (focusedIndex.value + 1) % options.length;
  makeFocusedVisible();
}

function moveFocusUp(): void {
  focusedIndex.value = (focusedIndex.value + options.length - 1) % options.length;
  makeFocusedVisible();
}

function moveFocusToLast(): void {
  focusedIndex.value = options.length - 1;
  makeFocusedVisible();
}

function selectOption(optionId: T): void {
  selected.value = optionId;
  closePopup();
}

function onDownKeyPressed(): void {
  if (!popupOpen.value) {
    openPopup();
  } else {
    moveFocusDown();
  }
}

function onClick(): void {
  if (!popupOpen.value) {
    openPopup();
  } else {
    selectOption(focusedOption.value.id);
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
      @keydown.escape.prevent="closePopup"
      @keydown.home.prevent="moveFocusToFirst"
      @keydown.end.prevent="moveFocusToLast"
      @keydown.tab="closePopup"
      :aria-controls="id + '_popup'"
      :aria-expanded="popupOpen"
      :aria-activedescendant="id + '_option_' + sortedOptions[focusedIndex].id"
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
        v-for="(option, index) in sortedOptions"
        :key="String(option.id)"
        :data-id="option.id"
        :id="id + '_option_' + option.id"
        :class="{ focused: index == focusedIndex }"
        :aria-selected="option.id == selected"
        @click="selectOption(option.id)"
        role="option"
      >
        <svg class="tick" viewBox="0 -960 960 960" role="img">
          <title>tick</title>
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M378-258q-6 0-11-2t-10-7L176-448q-9-9-9-22t9-22q9-9 21-9t21 9l160 160 363-363q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L399-267q-5 5-10 7t-11 2Z"
          />
        </svg>
        <span>{{ option.text }}</span>
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
  margin: auto;
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
