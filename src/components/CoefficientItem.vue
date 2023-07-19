<script>
import { Complex } from "../models/Complex";
import { ComplexCircle } from "../models/ComplexCircle";
import { ComplexLine } from "../models/ComplexLine";
import ComboBox from "./ComboBox.vue";
import CoefficientInput from "./CoefficientInput.vue";

export default {
  name: "CoefficientItem",
  components: { ComboBox, CoefficientInput },
  props: {
    degree: { type: String, required: true },
    coefficient: {
      type: [Complex, ComplexCircle, ComplexLine],
      required: true,
    },
    availablePowers: { type: Array, required: true },
  },
  emits: ["update:degree", "update:coefficient", "delete:coefficient"],
  computed: {
    degreeOptions() {
      const options = [];
      this.availablePowers.forEach((power) => {
        options.push({ id: power, text: power });
      });
      options.push({ id: this.degree, text: this.degree });
      return options;
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
};
</script>

<template>
  <div class="frame">
    <div class="degreePicker">
      <span>Degree</span>
      <ComboBox
        :options="degreeOptions"
        :selected="degree"
        @update:selected="(newDegree) => $emit('update:degree', newDegree)"
      />
      <button class="icon-button" @click="$emit('delete:coefficient')">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="100 -860 760 760" role="img">
          <title>Remove coefficient</title>
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="m480-438 123 123q9 9 21 9t21-9q9-9 9-21t-9-21L522-480l123-123q9-9 9-21t-9-21q-9-9-21-9t-21 9L480-522 357-645q-9-9-21-9t-21 9q-9 9-9 21t9 21l123 123-123 123q-9 9-9 21t9 21q9 9 21 9t21-9l123-123ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"
          />
        </svg>
      </button>
    </div>
    <CoefficientInput
      :coefficient="coefficient"
      @update:coefficient="(newCoefficient) => $emit('update:coefficient', newCoefficient)"
    />
  </div>
</template>

<style scoped>
.frame {
  border: 1px solid var(--gray-300);
  border-radius: 0.25rem;
  padding: 0.5rem;
}

.degreePicker {
  display: grid;
  grid-template-columns: auto 9.75rem 2rem;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.icon-button {
  padding: 0rem;
}

.icon-button svg {
  width: 1.7rem;
  height: 1.7rem;
}
</style>
