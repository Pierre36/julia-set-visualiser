<script>
import { CoefficientTypes } from "../enumerations/CoefficientTypes";
import { Complex } from "../models/Complex";
import { ComplexCircle } from "../models/ComplexCircle";
import { ComplexLine } from "../models/ComplexLine";
import ComboBox from "./ComboBox.vue";
import ComplexInput from "./ComplexInput.vue";
import NumberInput from "./NumberInput.vue";

export default {
  name: "CoefficientInput",
  components: { ComboBox, ComplexInput, NumberInput },
  props: {
    coefficient: {
      type: [Complex, ComplexCircle, ComplexLine],
      default: new Complex(0, 0),
    },
    level: { type: Number, default: 4 },
  },
  emits: ["update:coefficient"],
  data() {
    return {
      typeOptions: [
        { id: CoefficientTypes.CONSTANT, text: "Constant" },
        { id: CoefficientTypes.CIRCLE, text: "Circle" },
        { id: CoefficientTypes.LINE, text: "Line" },
      ],
      defaultValues: {
        CONSTANT: new Complex(0, 0),
        CIRCLE: new ComplexCircle(new Complex(0, 0), 1, 5000),
        LINE: new ComplexLine(new Complex(-1, 0), new Complex(1, 0), 5000),
      },
    };
  },
  computed: {
    type() {
      if (this.coefficient instanceof ComplexCircle) {
        return CoefficientTypes.CIRCLE;
      } else if (this.coefficient instanceof ComplexLine) {
        return CoefficientTypes.LINE;
      } else {
        return CoefficientTypes.CONSTANT;
      }
    },
    isCircle() {
      return this.type == CoefficientTypes.CIRCLE;
    },
    isLine() {
      return this.type == CoefficientTypes.LINE;
    },
    isConstant() {
      return this.type == CoefficientTypes.CONSTANT;
    },
    durationSecond() {
      return this.coefficient.duration / 1000;
    },
    heading() {
      return `h${this.level}`;
    },
  },
  methods: {
    changeType(newType) {
      this.$emit("update:coefficient", this.defaultValues[newType].copy());
    },
    updateCenter(newCenter) {
      const newCoefficient = this.coefficient.copy();
      newCoefficient.center = newCenter;
      this.$emit("update:coefficient", newCoefficient);
    },
    updateStart(newStart) {
      const newCoefficient = this.coefficient.copy();
      newCoefficient.start = newStart;
      this.$emit("update:coefficient", newCoefficient);
    },
    updateEnd(newEnd) {
      const newCoefficient = this.coefficient.copy();
      newCoefficient.end = newEnd;
      this.$emit("update:coefficient", newCoefficient);
    },
    updateRadius(newRadius) {
      const newCoefficient = this.coefficient.copy();
      newCoefficient.radius = newRadius;
      this.$emit("update:coefficient", newCoefficient);
    },
    updateDuration(newDuration) {
      const newCoefficient = this.coefficient.copy();
      newCoefficient.duration = newDuration * 1000;
      this.$emit("update:coefficient", newCoefficient);
    },
  },
};
</script>

<template>
  <div class="container">
    <component :is="heading">Type</component>
    <ComboBox
      :options="typeOptions"
      label="Coefficient type"
      :selected="type"
      @update:selected="changeType"
    />
    <template v-if="isConstant">
      <component :is="heading">Value</component>
      <ComplexInput
        :complex="coefficient"
        label="Coefficient value"
        @update:complex="(newCoefficient) => $emit('update:coefficient', newCoefficient)"
      />
    </template>
    <template v-else-if="isCircle">
      <component :is="heading">Center</component>
      <ComplexInput
        :complex="coefficient.center"
        label="Circle center"
        @update:complex="updateCenter"
      />
      <component :is="heading">Radius</component>
      <NumberInput
        :value="coefficient.radius"
        :min="0"
        :step="0.1"
        label="Circle radius"
        @update:value="updateRadius"
      />
      <component :is="heading">Duration</component>
      <NumberInput
        :value="durationSecond"
        :min="0"
        :step="1"
        @update:value="updateDuration"
        label="Duration"
      />
    </template>
    <template v-else-if="isLine">
      <component :is="heading">Start</component>
      <ComplexInput :complex="coefficient.start" label="Line start" @update:complex="updateStart" />
      <component :is="heading">End</component>
      <ComplexInput :complex="coefficient.end" label="Line end" @update:complex="updateEnd" />
      <component :is="heading">Duration</component>
      <NumberInput
        :value="durationSecond"
        :min="0"
        :step="1"
        @update:value="updateDuration"
        label="Duration"
      />
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
