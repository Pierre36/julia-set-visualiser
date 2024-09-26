<script setup lang="ts">
import { computed } from "vue";
import Complex from "@/models/Complex";
import ComplexEllipse from "@/models/ComplexEllipse";
import ComplexInput from "@/components/inputs/ComplexInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";

export interface Props {
  level?: number;
}

const { level = 4 } = defineProps<Props>();

const ellipse = defineModel<ComplexEllipse>("ellipse", {
  default: new ComplexEllipse(new Complex(0, 0), 1, 1, 0, 5000),
});

const heading = computed(() => `h${level}`);

const durationSecond = computed({
  get: () => ellipse.value.duration / 1000,
  set: (duration) => (ellipse.value.duration = duration * 1000),
});
</script>

<template>
  <component :is="heading">Centre</component>
  <ComplexInput v-model:complex="ellipse.centre" label="Ellipse centre" />
  <component :is="heading">Half-width</component>
  <NumberInput v-model:value="ellipse.halfWidth" :min="0" :step="0.1" label="Ellipse half-width" />
  <component :is="heading">Half-height</component>
  <NumberInput
    v-model:value="ellipse.halfHeight"
    :min="0"
    :step="0.1"
    label="Ellipse half-height"
  />
  <component :is="heading">Rotation angle</component>
  <NumberInput
    v-model:value="ellipse.rotationAngle"
    :min="0"
    :step="1"
    label="Ellipse rotation angle"
  />
  <component :is="heading">Duration</component>
  <NumberInput v-model:value="durationSecond" :min="0" :step="1" label="Duration" />
</template>

<style scoped>
h5 {
  padding-left: 0.25rem;
}
</style>
