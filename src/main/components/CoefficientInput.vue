<script setup lang="ts">
import { computed } from "vue";
import CoefficientTypes from "@/constants/CoefficientTypes";
import Complex from "@/models/Complex";
import ComplexCircle from "@/models/ComplexCircle";
import ComplexLine from "@/models/ComplexLine";
import ComplexEllipse from "@/models/ComplexEllipse";
import ComboBox from "@/components/ComboBox.vue";
import ComplexInput from "@/components/ComplexInput.vue";
import ComplexCircleInput from "@/components/ComplexCircleInput.vue";
import ComplexLineInput from "@/components/ComplexLineInput.vue";
import ComplexEllipseInput from "@/components/ComplexEllipseInput.vue";

export interface Props {
  level?: number;
}

const { level = 4 } = defineProps<Props>();

const coefficient = defineModel<Complex | ComplexCircle | ComplexLine | ComplexEllipse>(
  "coefficient",
  { default: new Complex(0, 0) }
);

const typeOptions = [
  { id: CoefficientTypes.CONSTANT, text: "Constant" },
  { id: CoefficientTypes.CIRCLE, text: "Circle" },
  { id: CoefficientTypes.LINE, text: "Line" },
  { id: CoefficientTypes.ELLIPSE, text: "Ellipse" },
];
const defaultValues = {
  CONSTANT: new Complex(0, 0),
  CIRCLE: new ComplexCircle(new Complex(0, 0), 1, 5000),
  LINE: new ComplexLine(new Complex(-1, 0), new Complex(1, 0), 5000),
  ELLIPSE: new ComplexEllipse(new Complex(0, 0), 1, 1, 0, 5000),
};

const currentType = computed(() => {
  if (coefficient.value instanceof ComplexCircle) {
    return CoefficientTypes.CIRCLE;
  } else if (coefficient.value instanceof ComplexLine) {
    return CoefficientTypes.LINE;
  } else if (coefficient.value instanceof ComplexEllipse) {
    return CoefficientTypes.ELLIPSE;
  } else {
    return CoefficientTypes.CONSTANT;
  }
});

const heading = computed(() => `h${level}`);

function changeType(newType: CoefficientTypes): void {
  coefficient.value = defaultValues[newType].copy();
}
</script>

<template>
  <div class="container">
    <component :is="heading">Type</component>
    <ComboBox
      id="coefficient-type-combobox"
      :options="typeOptions"
      label="Coefficient type"
      :selected="currentType"
      @update:selected="changeType"
    />
    <template v-if="coefficient instanceof Complex">
      <component :is="heading">Value</component>
      <ComplexInput v-model:complex="coefficient" label="Coefficient value" />
    </template>
    <template v-else-if="coefficient instanceof ComplexCircle">
      <ComplexCircleInput v-model:circle="coefficient" :level="level" />
    </template>
    <template v-else-if="coefficient instanceof ComplexLine">
      <ComplexLineInput v-model:line="coefficient" :level="level" />
    </template>
    <template v-else>
      <ComplexEllipseInput v-model:ellipse="coefficient" :level="level" />
    </template>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: auto 12rem;
  align-items: center;
  gap: 0.25rem;
}

h5 {
  padding-left: 0.25rem;
}
</style>
