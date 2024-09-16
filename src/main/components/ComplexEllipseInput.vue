<script setup lang="ts">
import { computed } from "vue";
import Complex from "@/models/Complex";
import ComplexEllipse from "@/models/ComplexEllipse";
import ComplexInput from "@/components/ComplexInput.vue";
import NumberInput from "@/components/NumberInput.vue";

export interface Props {
  ellipse?: ComplexEllipse;
  level?: number;
}

const { ellipse = new ComplexEllipse(new Complex(0, 0), 1, 1, 0, 5000), level = 4 } =
  defineProps<Props>();

const emit = defineEmits<{ (e: "update:ellipse", value: ComplexEllipse): void }>();

const heading = computed(() => `h${level}`);
const durationSecond = computed(() => ellipse.duration / 1000);

function update(property: keyof ComplexEllipse, newValue: any) {
  const newEllipse = ellipse.copy();
  newEllipse[property] = newValue;
  emit("update:ellipse", newEllipse);
}
</script>

<template>
  <component :is="heading">Centre</component>
  <ComplexInput
    :complex="ellipse.centre"
    label="Ellipse centre"
    @update:complex="(newCentre) => update('centre', newCentre)"
  />
  <component :is="heading">Half-width</component>
  <NumberInput
    :value="ellipse.halfWidth"
    :min="0"
    :step="0.1"
    label="Ellipse half-width"
    @update:value="(newHalfWidth) => update('halfWidth', newHalfWidth)"
  />
  <component :is="heading">Half-height</component>
  <NumberInput
    :value="ellipse.halfHeight"
    :min="0"
    :step="0.1"
    label="Ellipse half-height"
    @update:value="(newHalfHeight) => update('halfHeight', newHalfHeight)"
  />
  <component :is="heading">Rotation angle</component>
  <NumberInput
    :value="ellipse.rotationAngle"
    :min="0"
    :step="1"
    label="Ellipse rotation angle"
    @update:value="(newRotationAngle) => update('rotationAngle', newRotationAngle)"
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
