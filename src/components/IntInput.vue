<script>
import NumberInput from "./NumberInput.vue";

export default {
  name: "IntInput",
  components: { NumberInput },
  props: {
    int: { type: Number, default: 0 },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    step: { type: Number, default: 1 },
  },
  emits: ["update:int"],
  data() {
    return {
      isIntWrong: false,
    };
  },
  computed: {
    value() {
      if (this.isIntWrong) {
        return this.$refs.input.$refs.input.value;
      } else {
        return String(this.int);
      }
    },
  },
  methods: {
    checkAndUpdate(intString) {
      let newInt = parseInt(intString, 10);
      this.isIntWrong =
        isNaN(newInt) ||
        Number(intString) % 1 != 0 ||
        (this.min != undefined && newInt < this.min) ||
        (this.max != undefined && newInt > this.max);
      if (!this.isIntWrong) {
        this.$emit("update:int", newInt);
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
    :wrongInput="isIntWrong"
    @change="(newValue) => checkAndUpdate(newValue)"
  />
</template>
