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
  <div class="inputContainer">
    <input
      ref="input"
      class="input"
      :class="{ wrongInput: isComplexWrong }"
      :value="value"
      type="text"
      @change="($event) => checkAndUpdate($event.target.value)"
    />
    <svg viewBox="0 -960 960 960" role="img" class="wrongInputSVG" v-if="isComplexWrong">
      <title>Please enter a valid complex number</title>
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M92-120q-9 0-15.652-4.125Q69.696-128.25 66-135q-4.167-6.6-4.583-14.3Q61-157 66-165l388-670q5-8 11.5-11.5T480-850q8 0 14.5 3.5T506-835l388 670q5 8 4.583 15.7-.416 7.7-4.583 14.3-3.696 6.75-10.348 10.875Q877-120 868-120H92Zm52-60h672L480-760 144-180Zm340.175-57q12.825 0 21.325-8.675 8.5-8.676 8.5-21.5 0-12.825-8.675-21.325-8.676-8.5-21.5-8.5-12.825 0-21.325 8.675-8.5 8.676-8.5 21.5 0 12.825 8.675 21.325 8.676 8.5 21.5 8.5Zm0-111q12.825 0 21.325-8.625T514-378v-164q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T454-542v164q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625ZM480-470Z"
      />
    </svg>
  </div>
</template>

<style scoped>
.inputContainer {
  --warning-width: 1.2rem;
  --warning-margin: 0.5rem;
  position: relative;
}

.input {
  width: 100%;
  appearance: textfield;
}

.wrongInput {
  padding-right: calc(var(--warning-width) + var(--warning-margin) + 4px);
}

.wrongInputSVG {
  position: absolute;
  height: 100%;
  width: var(--warning-width);
  color: var(--color-error);
  margin-right: var(--warning-margin);
  top: 0;
  bottom: 0;
  left: auto;
  right: 0;
}
</style>
