<script setup lang="ts">
import { computed, type ComputedRef } from "vue";
import NumberInput from "@/components/inputs/NumberInput.vue";

export interface Props {
  min: number;
  max: number;
  step: number;
  isIntegerOnly?: boolean;
  label?: string;
  level?: number;
}

const { min, max, step, isIntegerOnly = false, label = "", level = 5 } = defineProps<Props>();

const value = defineModel<number>("value", { required: true });

const heading: ComputedRef<string> = computed(() => `h${level}`);
</script>

<template>
  <div class="slider-input">
    <component :is="heading">{{ label }}</component>
    <NumberInput
      v-model:value="value"
      :min="min"
      :max="max"
      :step="step"
      :isIntegerOnly="isIntegerOnly"
      :label="label"
    />
    <input
      type="range"
      role="slider"
      :value="value"
      :aria-valuenow="value"
      :min="min"
      :aria-valuemin="min"
      :max="max"
      :aria-valuemax="max"
      :step="step"
      :aria-label="label"
      @keydown.down.prevent="$emit('update:value', value - step)"
      @keydown.left.prevent="$emit('update:value', value - step)"
      @keydown.up.prevent="$emit('update:value', value + step)"
      @keydown.right.prevent="$emit('update:value', value + step)"
      @keydown.home.prevent="$emit('update:value', min)"
      @keydown.end.prevent="$emit('update:value', max)"
      @input="($event) => $emit('update:value', Number(($event.target as HTMLInputElement).value))"
    />
  </div>
</template>

<style scoped>
.slider-input {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 0.25rem;
}

input[type="range"] {
  grid-column: span 2;
}
</style>
