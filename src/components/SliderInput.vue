<script>
import NumberInput from "./NumberInput.vue";

export default {
  name: "SliderInput",
  components: { NumberInput },
  props: {
    value: { type: Number, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, required: true },
  },
  emits: ["update:value"],
  data() {
    return {
      isValueWrong: false,
    };
  },
  computed: {
    isInt() {
      return this.step >= 1;
    },
    verifiedTextValue() {
      if (this.isValueWrong) {
        return this.$refs.textInput.$refs.input.value;
      } else {
        return String(this.value);
      }
    },
  },
  methods: {
    checkAndUpdate(valueString) {
      let newValue;
      if (this.isInt) {
        newValue = parseInt(valueString);
      } else {
        newValue = parseFloat(valueString);
      }
      this.isValueWrong =
        isNaN(newValue) || newValue < this.min || newValue > this.max;
      if (!this.isValueWrong) {
        this.$emit("update:value", newValue);
      }
    },
  },
};
</script>

<template>
  <div class="sliderInput">
    <slot name="name"></slot>
    <NumberInput
      ref="textInput"
      :value="verifiedTextValue"
      :min="min"
      :max="max"
      :step="step"
      :wrongInput="isValueWrong"
      @change="(newValue) => checkAndUpdate(newValue)"
    />
    <input
      ref="rangeInput"
      class="rangeInput"
      type="range"
      :value="value"
      :min="min"
      :max="max"
      :step="step"
      @input="($event) => checkAndUpdate($event.target.value)"
    />
  </div>
</template>

<style scoped>
.sliderInput {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 0.25rem;
}

.rangeInput {
  grid-column: span 2;
}
</style>
