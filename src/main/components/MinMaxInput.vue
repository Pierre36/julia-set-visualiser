<script setup lang="ts">
import { computed, type ComputedRef } from "vue";
import NumberInput from "@/components/NumberInput.vue";

export interface Props {
  minValue?: number;
  maxValue?: number;
  min?: number;
  max?: number;
  step?: number;
  isIntegerOnly?: boolean;
  minLabel?: string;
  maxLabel?: string;
  level?: number;
}

const {
  minValue = 0,
  maxValue = 0,
  min = undefined,
  max = undefined,
  step = 1,
  isIntegerOnly = false,
  minLabel = "",
  maxLabel = "",
  level = 5,
} = defineProps<Props>();

defineEmits<{
  (e: "update:minValue", value: number): void;
  (e: "update:maxValue", value: number): void;
}>();

const heading: ComputedRef<string> = computed(() => `h${level}`);
</script>

<template>
  <div class="min-max-input">
    <component :is="heading">Min:</component>
    <NumberInput
      :value="minValue"
      :min="min"
      :max="maxValue"
      :step="step"
      :isIntegerOnly="isIntegerOnly"
      :label="minLabel"
      @update:value="(newMinValue) => $emit('update:minValue', newMinValue)"
    />
    <component :is="heading">Max:</component>
    <NumberInput
      :value="maxValue"
      :min="minValue"
      :max="max"
      :step="step"
      :isIntegerOnly="isIntegerOnly"
      :label="maxLabel"
      @update:value="(newMaxValue) => $emit('update:maxValue', newMaxValue)"
    />
  </div>
</template>

<style scoped>
.min-max-input {
  display: grid;
  grid-template-columns: auto auto auto auto;
  align-items: center;
  gap: 0.5rem;
}
</style>
