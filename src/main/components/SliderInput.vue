<script setup lang="ts">
import { computed, type ComputedRef } from "vue";
import NumberInput from "@/components/NumberInput.vue";

export interface Props {
  value: number;
  min: number;
  max: number;
  step: number;
  isIntegerOnly?: boolean;
  label?: string;
  level?: number;
}

const {
  value,
  min,
  max,
  step,
  isIntegerOnly = false,
  label = "",
  level = 5,
} = defineProps<Props>();

defineEmits<{
  (e: "update:value", value: number): void;
}>();

const heading: ComputedRef<string> = computed(() => `h${level}`);
</script>

<template>
  <div class="slider-input">
    <component :is="heading">{{ label }}</component>
    <NumberInput
      :value="value"
      :min="min"
      :max="max"
      :step="step"
      :isIntegerOnly="isIntegerOnly"
      :label="label"
      @update:value="(newValue) => $emit('update:value', newValue)"
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
