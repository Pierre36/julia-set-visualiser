<script setup lang="ts">
import { computed } from "vue";
import Complex from "@/models/Complex";
import ComplexLine from "@/models/ComplexLine";
import ComplexInput from "@/components/ComplexInput.vue";
import NumberInput from "@/components/NumberInput.vue";

export interface Props {
  level?: number;
}

const { level = 4 } = defineProps<Props>();

const line = defineModel<ComplexLine>("line", {
  default: new ComplexLine(new Complex(-1, 0), new Complex(1, 0), 5000),
});

const heading = computed(() => `h${level}`);

const durationSecond = computed({
  get: () => line.value.duration / 1000,
  set: (duration) => (line.value.duration = duration * 1000),
});
</script>

<template>
  <component :is="heading">Start</component>
  <ComplexInput v-model:complex="line.start" label="Line start" />
  <component :is="heading">End</component>
  <ComplexInput v-model:complex="line.end" label="Line end" />
  <component :is="heading">Duration</component>
  <NumberInput v-model:value="durationSecond" :min="0" :step="1" label="Duration" />
</template>

<style scoped>
h5 {
  padding-left: 0.25rem;
}
</style>
