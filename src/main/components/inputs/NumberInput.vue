<script setup lang="ts">
import { computed, ref, useTemplateRef, type ComputedRef } from "vue";

export interface Props {
  min?: number;
  max?: number;
  step?: number;
  isIntegerOnly?: boolean;
  wrongInputMessage?: string;
  label?: string;
}

const {
  min = undefined,
  max = undefined,
  step = 1,
  isIntegerOnly = false,
  wrongInputMessage = "Please enter a valid number",
  label = "",
} = defineProps<Props>();

const value = defineModel<number>("value", { default: 0 });

const isWrong = ref(false);

const input = useTemplateRef<HTMLInputElement>("input");

const inputValue: ComputedRef<string | undefined> = computed(() =>
  isWrong.value ? input.value?.value : value.value.toString()
);

function stepDown(): void {
  input.value?.stepDown();
  input.value?.dispatchEvent(new Event("change"));
}

function stepUp(): void {
  input.value?.stepUp();
  input.value?.dispatchEvent(new Event("change"));
}

function goToMin(): void {
  if (min != undefined) value.value = min;
}

function goToMax(): void {
  if (max != undefined) value.value = max;
}

function isIncorrectValue(newValue: number): boolean {
  return (
    isNaN(newValue) ||
    (isIntegerOnly && newValue % 1 != 0) ||
    (min != undefined && newValue < min) ||
    (max != undefined && newValue > max)
  );
}

function checkAndUpdate(): void {
  const newValue = parseFloat(input.value?.value || "");
  isWrong.value = isIncorrectValue(newValue);
  if (!isWrong.value) value.value = newValue;
}
</script>

<template>
  <div class="input-container">
    <input
      ref="input"
      class="input"
      type="number"
      :value="inputValue"
      :min="min"
      :aria-valuemin="min"
      :max="max"
      :aria-valuemax="max"
      :step="step"
      :aria-label="label"
      :aria-invalid="isWrong"
      role="spinbutton"
      @keydown.down.prevent="stepDown"
      @keydown.up.prevent="stepUp"
      @keydown.home.prevent="goToMin"
      @keydown.end.prevent="goToMax"
      @change="checkAndUpdate"
    />
    <svg viewBox="0 -960 960 960" role="img" class="wrong-input-svg" v-if="isWrong">
      <title>{{ wrongInputMessage }}</title>
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M92-120q-9 0-15.652-4.125Q69.696-128.25 66-135q-4.167-6.6-4.583-14.3Q61-157 66-165l388-670q5-8 11.5-11.5T480-850q8 0 14.5 3.5T506-835l388 670q5 8 4.583 15.7-.416 7.7-4.583 14.3-3.696 6.75-10.348 10.875Q877-120 868-120H92Zm52-60h672L480-760 144-180Zm340.175-57q12.825 0 21.325-8.675 8.5-8.676 8.5-21.5 0-12.825-8.675-21.325-8.676-8.5-21.5-8.5-12.825 0-21.325 8.675-8.5 8.676-8.5 21.5 0 12.825 8.675 21.325 8.676 8.5 21.5 8.5Zm0-111q12.825 0 21.325-8.625T514-378v-164q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T454-542v164q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625ZM480-470Z"
      />
    </svg>
    <button class="button input-button up" @click="stepUp" tabindex="-1">
      <svg viewBox="0 -960 960 960" role="img">
        <title>Increase value</title>
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M262-379q-8-10-8.5-22t8.5-21l197-197q5-5 10-7t11-2q6 0 11 2t10 7l198 198q8 8 8 20.5t-9 21.5q-9 9-21.5 9t-21.5-9L480-554 305-379q-9 9-21 8.5t-22-8.5Z"
        />
      </svg>
    </button>
    <button class="button input-button down" @click="stepDown" tabindex="-1">
      <svg viewBox="0 -960 960 960" role="img">
        <title>Decrease value</title>
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M480-356q-5 0-10.5-2t-10.5-7L262-562q-9-9-9-22t9-22q9-9 21-9t21 9l176 176 176-176q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L501-365q-5 5-10 7t-11 2Z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.input-container {
  --buttons-width: 1.5rem;
  --buttons-margin: 0.2rem;
  --warning-width: 1.2rem;
  position: relative;
}

.input {
  width: 100%;
  appearance: textfield;
  padding: var(--input-padding, 0.5rem);
  padding-right: calc(var(--buttons-width) + 2 * var(--buttons-margin) + 2px);
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

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.input:focus-visible {
  border-color: var(--input-border-color-focus, hsl(210, 70%, 30%));
}

.input[aria-invalid="true"] {
  border-color: var(--input-border-color-wrong, #ff0000);
  padding-right: calc(
    var(--buttons-width) + 2 * var(--buttons-margin) + var(--warning-width) + 4px
  );
}

.input-button {
  --button-border-radius: 0.15rem;
  --button-border-width: 1px;
  --button-color: var(--input-color, #000000);
  --button-background-color: var(--input-border-color, #000000);
  --button-border-color: var(--input-border-color, #000000);
  --button-background-color-hover: var(--input-border-color, #000000);
  --button-border-color-hover: var(--input-color, #ffffff);
  --button-color-active: var(--input-color, #000000);
  --button-background-color-active: var(--input-border-color, #000000);
  position: absolute;
  width: var(--buttons-width);
  right: 0;
  left: auto;
  margin: var(--buttons-margin);
  padding: 0;
  line-height: 0;
}

.input-button.up {
  top: 0;
  bottom: 50%;
  margin-bottom: calc(var(--buttons-margin) / 4);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.input-button.down {
  top: 50%;
  bottom: 0;
  margin-top: calc(var(--buttons-margin) / 4);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.input-button svg {
  height: 100%;
}

.wrong-input-svg {
  position: absolute;
  height: 100%;
  width: var(--warning-width);
  color: var(--input-border-color-wrong, #ff0000);
  top: 0;
  bottom: 0;
  left: auto;
  right: calc(var(--buttons-width) + 2 * var(--buttons-margin) + 2px);
}
</style>
