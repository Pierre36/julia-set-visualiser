<script lang="ts">
import { defineComponent } from "vue";
import NumberInput from "@/components/NumberInput.vue";

export default defineComponent({
  name: "SliderInput",
  components: { NumberInput },
  props: {
    value: { type: Number, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, required: true },
    integerOnly: { type: Boolean, default: false },
    label: { type: String, default: "" },
    level: { type: Number, default: 4 },
  },
  emits: ["update:value"],
  computed: {
    heading() {
      return `h${this.level}`;
    },
  },
  methods: {},
});
</script>

<template>
  <div class="slider-input">
    <component :is="heading">{{ label }}</component>
    <NumberInput
      :value="value"
      :min="min"
      :max="max"
      :step="step"
      :isIntegerOnly="integerOnly"
      :label="label"
      @update:value="(newValue) => $emit('update:value', newValue)"
    />
    <input
      type="range"
      role="slider"
      :value="value"
      :aria-valuenow="value"
      :min="min"
      :aria-valuemin="min"
      :max="max"
      :aria-valuemax="max"
      :step="step"
      :aria-label="label"
      @keydown.down.prevent="$emit('update:value', value - step)"
      @keydown.left.prevent="$emit('update:value', value - step)"
      @keydown.up.prevent="$emit('update:value', value + step)"
      @keydown.right.prevent="$emit('update:value', value + step)"
      @keydown.home.prevent="$emit('update:value', min)"
      @keydown.end.prevent="$emit('update:value', max)"
      @input="($event) => $emit('update:value', Number(($event.target as HTMLInputElement).value))"
    />
  </div>
</template>

<style scoped>
.slider-input {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 0.25rem;
}

input[type="range"] {
  grid-column: span 2;
}
</style>
