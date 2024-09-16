<script setup lang="ts">
import { computed } from "vue";
import Complex from "@/models/Complex";
import ComplexLine from "@/models/ComplexLine";
import ComplexInput from "@/components/ComplexInput.vue";
import NumberInput from "@/components/NumberInput.vue";

export interface Props {
  line?: ComplexLine;
  level?: number;
}

const { line = new ComplexLine(new Complex(-1, 0), new Complex(1, 0), 5000), level = 4 } =
  defineProps<Props>();

const emit = defineEmits<{ (e: "update:line", value: ComplexLine): void }>();

const heading = computed(() => `h${level}`);
const durationSecond = computed(() => line.duration / 1000);

function update(property: keyof ComplexLine, newValue: any) {
  const newLine = line.copy();
  newLine[property] = newValue;
  emit("update:line", newLine);
}
</script>

<template>
  <component :is="heading">Start</component>
  <ComplexInput
    :complex="line.start"
    label="Line start"
    @update:complex="(newStart) => update('start', newStart)"
  />
  <component :is="heading">End</component>
  <ComplexInput
    :complex="line.end"
    label="Line end"
    @update:complex="(newEnd) => update('end', newEnd)"
  />
  <component :is="heading">Duration</component>
  <NumberInput
    :value="durationSecond"
    :min="0"
    :step="1"
    @update:value="(newDuration) => update('duration', newDuration * 1000)"
    label="Duration"
  />
</template>

<style scoped>
h5 {
  padding-left: 0.25rem;
}
</style>
