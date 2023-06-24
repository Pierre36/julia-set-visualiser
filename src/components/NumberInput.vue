<script>
export default {
  name: "NumberInput",
  emits: ["change"],
  props: {
    value: { type: String, default: "0" },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    step: { type: Number, default: 1 },
    wrongInput: { type: Boolean, default: false },
  },
  methods: {
    stepUp() {
      this.$refs.input.stepUp();
      this.$refs.input.dispatchEvent(new Event("change"));
    },
    stepDown() {
      this.$refs.input.stepDown();
      this.$refs.input.dispatchEvent(new Event("change"));
    },
  },
};
</script>

<template>
  <div class="inputContainer">
    <input
      ref="input"
      class="input"
      :class="{ wrongInput: wrongInput }"
      type="number"
      :value="value"
      :min="min"
      :max="max"
      :step="step"
      @change="($event) => $emit('change', $event.target.value)"
    />
    <button class="button inputButton up" @click="stepUp">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        role="img"
      >
        <title>Increase value</title>
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M262-379q-8-10-8.5-22t8.5-21l197-197q5-5 10-7t11-2q6 0 11 2t10 7l198 198q8 8 8 20.5t-9 21.5q-9 9-21.5 9t-21.5-9L480-554 305-379q-9 9-21 8.5t-22-8.5Z"
        />
      </svg>
    </button>
    <button class="button inputButton down" @click="stepDown">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        role="img"
      >
        <title>Decrease value</title>
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M480-356q-5 0-10.5-2t-10.5-7L262-562q-9-9-9-22t9-22q9-9 21-9t21 9l176 176 176-176q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L501-365q-5 5-10 7t-11 2Z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.inputContainer {
  --buttons-width: 1.5rem;
  --buttons-margin: 0.2rem;
  position: relative;
}

.input {
  width: 100%;
  appearance: textfield;
  padding-right: calc(var(--buttons-width) + 2 * var(--buttons-margin) + 2px);
}

.inputButton {
  --button-border-radius: 0.15rem;
  --button-border-width: 1px;
  --button-color: var(--gray-100);
  --button-background-color: var(--gray-500);
  --button-border-color: var(--gray-500);
  --button-background-color-hover: var(--gray-500);
  --button-color-active: var(--gray-100);
  --button-background-color-active: var(--gray-500);
  --button-background-color-focus-visible: var(--gray-500);
  position: absolute;
  width: var(--buttons-width);
  right: 0;
  left: auto;
  margin: var(--buttons-margin);
  padding: 0;
  line-height: 0;
}

.inputButton.up {
  top: 0;
  bottom: 50%;
  margin-bottom: calc(var(--buttons-margin) / 4);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.inputButton.down {
  top: 50%;
  bottom: 0;
  margin-top: calc(var(--buttons-margin) / 4);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.inputButton svg {
  height: 100%;
}
</style>
