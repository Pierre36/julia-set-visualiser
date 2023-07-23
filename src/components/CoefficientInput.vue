<script>
import { Complex } from "../models/Complex";
import { ComplexCircle } from "../models/ComplexCircle";
import { ComplexLine } from "../models/ComplexLine";
import ComboBox from "./ComboBox.vue";
import ComplexInput from "./ComplexInput.vue";
import FloatInput from "./FloatInput.vue";

export default {
  name: "CoefficientInput",
  components: { ComboBox, ComplexInput, FloatInput },
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
    <template v-if="type == 'CONSTANT'">
      <component :is="heading">Value</component>
      <ComplexInput
        :complex="coefficient"
        @update:complex="(newCoefficient) => $emit('update:coefficient', newCoefficient)"
      />
    </template>
    <template v-else-if="type == 'CIRCLE'">
      <component :is="heading">Center</component>
      <ComplexInput :complex="coefficient.center" @update:complex="updateCenter" />
      <component :is="heading">Radius</component>
      <FloatInput :float="coefficient.radius" :min="0" @update:float="updateRadius" />
      <component :is="heading">Duration</component>
      <FloatInput :float="durationSecond" :min="0" :step="1" @update:float="updateDuration" />
    </template>
    <template v-else-if="type == 'LINE'">
      <component :is="heading">Start</component>
      <ComplexInput :complex="coefficient.start" @update:complex="updateStart" />
      <component :is="heading">End</component>
      <ComplexInput :complex="coefficient.end" @update:complex="updateEnd" />
      <component :is="heading">Duration</component>
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
