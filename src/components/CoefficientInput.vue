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
        @update:complex="
          (newCoefficient) => $emit('update:coefficient', newCoefficient)
        "
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
        :step="1"
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
        :step="1"
        @update:float="updateDuration"
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
</style>
