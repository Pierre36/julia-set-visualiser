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
    wrongInputMessage: { type: String, default: "" },
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
    <svg viewBox="0 -960 960 960" role="img" class="wrongInputSVG" v-if="wrongInput">
      <title>{{ wrongInputMessage }}</title>
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M92-120q-9 0-15.652-4.125Q69.696-128.25 66-135q-4.167-6.6-4.583-14.3Q61-157 66-165l388-670q5-8 11.5-11.5T480-850q8 0 14.5 3.5T506-835l388 670q5 8 4.583 15.7-.416 7.7-4.583 14.3-3.696 6.75-10.348 10.875Q877-120 868-120H92Zm52-60h672L480-760 144-180Zm340.175-57q12.825 0 21.325-8.675 8.5-8.676 8.5-21.5 0-12.825-8.675-21.325-8.676-8.5-21.5-8.5-12.825 0-21.325 8.675-8.5 8.676-8.5 21.5 0 12.825 8.675 21.325 8.676 8.5 21.5 8.5Zm0-111q12.825 0 21.325-8.625T514-378v-164q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T454-542v164q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625ZM480-470Z"
      />
    </svg>
    <button class="button inputButton up" @click="stepUp">
      <svg viewBox="0 -960 960 960" role="img">
        <title>Increase value</title>
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M262-379q-8-10-8.5-22t8.5-21l197-197q5-5 10-7t11-2q6 0 11 2t10 7l198 198q8 8 8 20.5t-9 21.5q-9 9-21.5 9t-21.5-9L480-554 305-379q-9 9-21 8.5t-22-8.5Z"
        />
      </svg>
    </button>
    <button class="button inputButton down" @click="stepDown">
      <svg viewBox="0 -960 960 960" role="img">
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
  --warning-width: 1.2rem;
  position: relative;
}

.input {
  width: 100%;
  appearance: textfield;
  padding-right: calc(var(--buttons-width) + 2 * var(--buttons-margin) + 2px);
}

.wrongInput {
  padding-right: calc(
    var(--buttons-width) + 2 * var(--buttons-margin) + var(--warning-width) + 4px
  );
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

.wrongInputSVG {
  position: absolute;
  height: 100%;
  width: var(--warning-width);
  color: var(--color-error);
  top: 0;
  bottom: 0;
  left: auto;
  right: calc(var(--buttons-width) + 2 * var(--buttons-margin) + 2px);
}
</style>
