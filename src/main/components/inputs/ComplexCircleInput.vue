<script setup lang="ts">
import { computed } from "vue";
import Complex from "@/models/Complex";
import ComplexCircle from "@/models/ComplexCircle";
import ComplexInput from "@/components/inputs/ComplexInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";

export interface Props {
  level?: number;
}

const { level = 4 } = defineProps<Props>();

const circle = defineModel<ComplexCircle>("circle", {
  default: new ComplexCircle(new Complex(0, 0), 1, 5000),
});

const heading = computed(() => `h${level}`);

const durationSecond = computed({
  get: () => circle.value.duration / 1000,
  set: (duration) => (circle.value.duration = duration * 1000),
});
</script>

<template>
  <component :is="heading">Centre</component>
  <ComplexInput v-model:complex="circle.centre" label="Circle centre" />
  <component :is="heading">Radius</component>
  <NumberInput v-model:value="circle.radius" :min="0" :step="0.1" label="Circle radius" />
  <component :is="heading">Duration</component>
  <NumberInput v-model:value="durationSecond" :min="0" :step="1" label="Duration" />
</template>

<style scoped>
h5 {
  padding-left: 0.25rem;
}
</style>
