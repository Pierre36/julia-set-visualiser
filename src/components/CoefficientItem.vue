<script>
import { Complex } from "../models/Complex";
import { ComplexCircle } from "../models/ComplexCircle";
import { ComplexLine } from "../models/ComplexLine";
import { Polynomial } from "../models/Polynomial";
import FormSelect from "./FormSelect.vue";
import ComplexInput from "./ComplexInput.vue";
import FloatInput from "./FloatInput.vue";

export default {
  name: "CoefficientItem",
  components: { FormSelect, ComplexInput, FloatInput },
  props: {
    degree: { type: String, required: true },
    polynomial: { type: Polynomial, required: true },
  },
  emits: ["update:degree"],
  data() {
    return {
      typeOptions: [
        { id: "CONSTANT", text: "Constante" },
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
    degreeOptions() {
      const availablePowers = this.polynomial.getAvailablePowers();
      availablePowers.push(this.degree);
      const options = [];
      availablePowers.forEach((power) => {
        options.push({ id: power, text: power });
      });
      return options;
    },
    coefficient() {
      return this.polynomial.getCoefficient(this.degree);
    },
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
      this.polynomial.setCoefficient(this.degree, this.defaultValues[newType]);
    },
    updateCoefficient(newCoefficient) {
      this.polynomial.setCoefficient(this.degree, newCoefficient);
    },
    updateCenter(newCenter) {
      this.coefficient.center = newCenter;
    },
    updateStart(newStart) {
      this.coefficient.start = newStart;
    },
    updateEnd(newEnd) {
      this.coefficient.end = newEnd;
    },
    updateRadius(newRadius) {
      this.coefficient.radius = newRadius;
    },
    updateDuration(newDuration) {
      this.coefficient.duration = newDuration * 1000;
    },
  },
};
</script>

<template>
  <div class="container">
    <span>Degree</span>
    <FormSelect
      :options="degreeOptions"
      :selected="degree"
      @update:selected="(newDegree) => $emit('update:degree', newDegree)"
    />
    <span>Type</span>
    <FormSelect
      :options="typeOptions"
      :selected="type"
      @update:selected="changeType"
    />
    <template v-if="type == 'CONSTANT'">
      <span>Value</span>
      <ComplexInput
        :complex="coefficient"
        @update:complex="updateCoefficient"
      />
    </template>
    <template v-else-if="type == 'CIRCLE'">
      <span>Center</span>
      <ComplexInput
        :complex="coefficient.center"
        @update:complex="updateCenter"
      />
      <span>Radius</span>
      <FloatInput
        :float="coefficient.radius"
        :min="0"
        @update:float="updateRadius"
      />
      <span>Duration</span>
      <FloatInput
        :float="durationSecond"
        :min="0"
        @update:float="updateDuration"
      />
    </template>
    <template v-else-if="type == 'LINE'">
      <span>Start</span>
      <ComplexInput
        :complex="coefficient.start"
        @update:complex="updateStart"
      />
      <span>End</span>
      <ComplexInput :complex="coefficient.end" @update:complex="updateEnd" />
      <span>Duration</span>
      <FloatInput
        :float="durationSecond"
        :min="0"
        @update:float="updateDuration"
      />
    </template>
  </div>
</template>

<style scoped>
.container {
  border: 1px solid var(--gray-300);
  border-radius: 0.5rem;
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
}
</style>
