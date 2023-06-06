<script>
export default {
  name: "FloatInput",
  emits: ["update:float"],
  props: {
    float: { type: Number, default: 0 },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
  },
  data() {
    return {
      isFLoatWrong: false,
    };
  },
  computed: {
    value() {
      if (this.isFLoatWrong) {
        return this.$refs.input.value;
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
  <input
    ref="input"
    class="input"
    :class="{ wrongInput: isFLoatWrong }"
    type="number"
    :value="value"
    :min="min"
    :max="max"
    @change="($event) => checkAndUpdate($event.target.value)"
  />
</template>
