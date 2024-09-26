<script setup lang="ts">
import { computed, type ComputedRef } from "vue";
import NumberInput from "@/components/inputs/NumberInput.vue";

export interface Props {
  min?: number;
  max?: number;
  step?: number;
  isIntegerOnly?: boolean;
  minLabel?: string;
  maxLabel?: string;
  level?: number;
}

const {
  min = undefined,
  max = undefined,
  step = 1,
  isIntegerOnly = false,
  minLabel = "",
  maxLabel = "",
  level = 5,
} = defineProps<Props>();

const minValue = defineModel<number>("minValue", { default: 0 });
const maxValue = defineModel<number>("maxValue", { default: 0 });

const heading: ComputedRef<string> = computed(() => `h${level}`);
</script>

<template>
  <div class="min-max-input">
    <component :is="heading">Min:</component>
    <NumberInput
      v-model:value="minValue"
      :min="min"
      :max="maxValue"
      :step="step"
      :isIntegerOnly="isIntegerOnly"
      :label="minLabel"
    />
    <component :is="heading">Max:</component>
    <NumberInput
      v-model:value="maxValue"
      :min="minValue"
      :max="max"
      :step="step"
      :isIntegerOnly="isIntegerOnly"
      :label="maxLabel"
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
