<script>
import NumberInput from "./NumberInput.vue";

export default {
  name: "FloatInput",
  components: { NumberInput },
  props: {
    float: { type: Number, default: 0 },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    step: { type: Number, default: 0.1 },
  },
  emits: ["update:float"],
  data() {
    return {
      isFLoatWrong: false,
    };
  },
  computed: {
    value() {
      if (this.isFLoatWrong) {
        return this.$refs.input.$refs.input.value;
      } else {
        return String(this.float);
      }
    },
  },
  methods: {
    checkAndUpdate(floatString) {
      let newFloat = parseFloat(floatString);
      this.isFLoatWrong =
        isNaN(newFloat) ||
        (this.min != undefined && newFloat < this.min) ||
        (this.max != undefined && newFloat > this.max);
      if (!this.isFLoatWrong) {
        this.$emit("update:float", newFloat);
      }
    },
  },
};
</script>

<template>
  <NumberInput
    ref="input"
    :value="value"
    :min="min"
    :max="max"
    :step="step"
    :wrongInput="isFLoatWrong"
    @change="(newValue) => checkAndUpdate(newValue)"
  />
</template>
