<script lang="ts">
import { defineComponent } from "vue";
import NumberInput from "@/components/NumberInput.vue";

export default defineComponent({
  name: "MinMaxInput",
  components: { NumberInput },
  emits: ["update:minValue", "update:maxValue"],
  props: {
    minValue: { type: Number, default: 0 },
    maxValue: { type: Number, default: 0 },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    step: { type: Number, default: 1 },
    integerOnly: { type: Boolean, default: false },
    minLabel: { type: String, default: "" },
    maxLabel: { type: String, default: "" },
    level: { type: Number, default: 5 },
  },
  computed: {
    heading() {
      return `h${this.level}`;
    },
  },
});
</script>

<template>
  <div class="min-max-input">
    <component :is="heading">Min:</component>
    <NumberInput
      :value="minValue"
      :min="min"
      :max="maxValue"
      :step="step"
      :isIntegerOnly="integerOnly"
      :label="minLabel"
      @update:value="(newMinValue) => $emit('update:minValue', newMinValue)"
    />
    <component :is="heading">Max:</component>
    <NumberInput
      :value="maxValue"
      :min="minValue"
      :max="max"
      :step="step"
      :isIntegerOnly="integerOnly"
      :label="maxLabel"
      @update:value="(newMaxValue) => $emit('update:maxValue', newMaxValue)"
    />
  </div>
</template>

<style scoped>
.min-max-input {
  display: grid;
  grid-template-columns: auto auto auto auto;
  align-items: center;
  gap: 0.5rem;
}
</style>
