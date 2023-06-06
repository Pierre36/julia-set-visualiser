<script>
import { Complex } from "../models/Complex";

export default {
  name: "ComplexInput",
  props: {
    complex: { type: Complex, default: new Complex(0, 0) },
  },
  emits: ["update:complex"],
  data() {
    return {
      isComplexWrong: false,
    };
  },
  computed: {
    value() {
      if (this.isComplexWrong) {
        return this.$refs.input.value;
      } else {
        return this.complex.toString();
      }
    },
  },
  methods: {
    checkAndUpdate(complexString) {
      try {
        this.$emit("update:complex", Complex.fromString(complexString));
        this.isComplexWrong = false;
      } catch (e) {
        this.isComplexWrong = true;
      }
    },
  },
};
</script>

<template>
  <input
    ref="input"
    class="input"
    :class="{ wrongInput: isComplexWrong }"
    :value="value"
    type="text"
    @change="($event) => checkAndUpdate($event.target.value)"
  />
</template>
