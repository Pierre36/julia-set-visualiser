<script>
import { Complex } from "../models/Complex";
import { ComplexCircle } from "../models/ComplexCircle";
import { ComplexLine } from "../models/ComplexLine";
import { Polynomial } from "../models/Polynomial";
import FormSelect from "./FormSelect.vue";
import ComplexInput from "./ComplexInput.vue";
import FloatInput from "./FloatInput.vue";

export default {
  name: "CoefficientInput",
  components: { FormSelect, ComplexInput, FloatInput },
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
        { id: "CONSTANT", text: "Constant" },
        { id: "CIRCLE", text: "Circle" },
        { id: "LINE", text: "Line" },
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
        return "CIRCLE";
      } else if (this.coefficient instanceof ComplexLine) {
        return "LINE";
      } else {
        return "CONSTANT";
      }
    },
    durationSecond() {
      return this.coefficient.duration / 1000;
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
    <h4 v-if="level == 4">Type</h4>
    <h5 v-if="level == 5">Type</h5>
    <FormSelect :options="typeOptions" :selected="type" @update:selected="changeType" />
    <template v-if="type == 'CONSTANT'">
      <h4 v-if="level == 4">Value</h4>
      <h5 v-if="level == 5">Value</h5>
      <ComplexInput
        :complex="coefficient"
        @update:complex="(newCoefficient) => $emit('update:coefficient', newCoefficient)"
      />
    </template>
    <template v-else-if="type == 'CIRCLE'">
      <h4 v-if="level == 4">Center</h4>
      <h5 v-if="level == 5">Center</h5>
      <ComplexInput :complex="coefficient.center" @update:complex="updateCenter" />
      <h4 v-if="level == 4">Radius</h4>
      <h5 v-if="level == 5">Radius</h5>
      <FloatInput :float="coefficient.radius" :min="0" @update:float="updateRadius" />
      <h4 v-if="level == 4">Duration</h4>
      <h5 v-if="level == 5">Duration</h5>
      <FloatInput :float="durationSecond" :min="0" :step="1" @update:float="updateDuration" />
    </template>
    <template v-else-if="type == 'LINE'">
      <h4 v-if="level == 4">Start</h4>
      <h5 v-if="level == 5">Start</h5>
      <ComplexInput :complex="coefficient.start" @update:complex="updateStart" />
      <h4 v-if="level == 4">End</h4>
      <h5 v-if="level == 5">End</h5>
      <ComplexInput :complex="coefficient.end" @update:complex="updateEnd" />
      <h4 v-if="level == 4">Duration</h4>
      <h5 v-if="level == 5">Duration</h5>
      <FloatInput :float="durationSecond" :min="0" :step="1" @update:float="updateDuration" />
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
