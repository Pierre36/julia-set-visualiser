<script setup lang="ts">
import Complex from "@/models/Complex";
import { computed, ref, useTemplateRef, type ComputedRef } from "vue";

export interface Props {
  label?: string;
}

const { label = "" } = defineProps<Props>();

const complex = defineModel<Complex>("complex", { default: new Complex(0, 0) });

const isWrong = ref(false);

const input = useTemplateRef<HTMLInputElement>("input");

const inputValue: ComputedRef<string | undefined> = computed(() =>
  isWrong.value ? input.value?.value : complex.value.toString()
);

function checkAndUpdate(): void {
  const newValue = Complex.fromString(input.value?.value?.trim() || "");
  isWrong.value = newValue == undefined;
  if (newValue != undefined) complex.value = newValue;
}
</script>

<template>
  <div class="input-container">
    <input
      ref="input"
      class="input"
      type="text"
      :value="inputValue"
      :aria-label="label"
      :aria-invalid="isWrong"
      role="textbox"
      @change="checkAndUpdate"
    />
    <svg viewBox="0 -960 960 960" role="img" class="wrong-input-svg" v-if="isWrong">
      <title>Please enter a valid complex number</title>
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M92-120q-9 0-15.652-4.125Q69.696-128.25 66-135q-4.167-6.6-4.583-14.3Q61-157 66-165l388-670q5-8 11.5-11.5T480-850q8 0 14.5 3.5T506-835l388 670q5 8 4.583 15.7-.416 7.7-4.583 14.3-3.696 6.75-10.348 10.875Q877-120 868-120H92Zm52-60h672L480-760 144-180Zm340.175-57q12.825 0 21.325-8.675 8.5-8.676 8.5-21.5 0-12.825-8.675-21.325-8.676-8.5-21.5-8.5-12.825 0-21.325 8.675-8.5 8.676-8.5 21.5 0 12.825 8.675 21.325 8.676 8.5 21.5 8.5Zm0-111q12.825 0 21.325-8.625T514-378v-164q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T454-542v164q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625ZM480-470Z"
      />
    </svg>
  </div>
</template>

<style scoped>
.input-container {
  --warning-width: 1.2rem;
  --warning-margin: 0.5rem;
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

.input:focus-visible {
  border-color: var(--input-border-color-focus, hsl(210, 70%, 30%));
}

.input[aria-invalid="true"] {
  border-color: var(--input-border-color-wrong, #ff0000);
  padding-right: calc(var(--warning-width) + var(--warning-margin) + 4px);
}

.wrong-input-svg {
  position: absolute;
  height: 100%;
  width: var(--warning-width);
  color: var(--input-border-color-wrong, #ff0000);
  margin-right: var(--warning-margin);
  top: 0;
  bottom: 0;
  left: auto;
  right: 0;
}
</style>
