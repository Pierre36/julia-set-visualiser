<script setup lang="ts">
import { computed } from "vue";
import Complex from "@/models/Complex";
import ComplexCircle from "@/models/ComplexCircle";
import ComplexInput from "@/components/ComplexInput.vue";
import NumberInput from "@/components/NumberInput.vue";

export interface Props {
  circle?: ComplexCircle;
  level?: number;
}

const { circle = new ComplexCircle(new Complex(0, 0), 1, 5000), level = 4 } = defineProps<Props>();

const emit = defineEmits<{ (e: "update:circle", value: ComplexCircle): void }>();

const heading = computed(() => `h${level}`);
const durationSecond = computed(() => circle.duration / 1000);

function update(property: keyof ComplexCircle, newValue: any) {
  const newCircle = circle.copy();
  newCircle[property] = newValue;
  emit("update:circle", newCircle);
}
</script>

<template>
  <component :is="heading">Centre</component>
  <ComplexInput
    :complex="circle.centre"
    label="Circle centre"
    @update:complex="(newCentre) => update('centre', newCentre)"
  />
  <component :is="heading">Radius</component>
  <NumberInput
    :value="circle.radius"
    :min="0"
    :step="0.1"
    label="Circle radius"
    @update:value="(newRadius) => update('radius', newRadius)"
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
