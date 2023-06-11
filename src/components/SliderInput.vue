<script>
export default {
  name: "SliderInput",
  emits: ["update:value"],
  props: {
    name: { type: String, default: "" },
    value: { type: Number, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, required: true },
  },
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
        return this.$refs.textInput.value;
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
    <h5>{{ name }}</h5>
    <input
      ref="textInput"
      class="input"
      :class="{ wrongInput: isValueWrong }"
      type="number"
      :value="verifiedTextValue"
      :min="min"
      :max="max"
      :step="step"
      @change="($event) => checkAndUpdate($event.target.value)"
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
  padding-inline: 0.25rem;
  margin-bottom: 0.5rem;
  margin-top: 0.25rem;
}

.rangeInput {
  grid-column: span 2;
}
</style>
