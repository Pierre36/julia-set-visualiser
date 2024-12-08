<script setup lang="ts">
import Complex from "@/models/Complex";
import Attractor from "@/models/Attractor";
import SliderInput from "@/components/inputs/SliderInput.vue";
import ComplexInput from "@/components/inputs/ComplexInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";

export interface Props {
  isDefault?: boolean;
  isInfinity?: boolean;
}

const { isDefault = false, isInfinity = false } = defineProps<Props>();

const attractor = defineModel<Attractor>("attractor", {
  default: new Attractor(new Complex(0, 0), 0, 1, 1, 1, 1),
});

const emit = defineEmits<{ (e: "delete:attractor"): void }>();
</script>

<template>
  <div class="attractor-item">
    <h4 v-if="isDefault" class="span-2 text-attractor">Default (no attractor)</h4>
    <h4 v-else-if="isInfinity" class="span-2 text-attractor">Divergence to Infinity</h4>
    <div v-else class="attractor span-2">
      <h4>Attractor</h4>
      <ComplexInput v-model:complex="attractor.complex" label="Attractor" />
      <button class="icon-button" @click="emit('delete:attractor')">
        <svg class="icon" viewBox="100 -860 760 760" role="img">
          <title>Remove attractor</title>
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="m480-438 123 123q9 9 21 9t21-9q9-9 9-21t-9-21L522-480l123-123q9-9 9-21t-9-21q-9-9-21-9t-21 9L480-522 357-645q-9-9-21-9t-21 9q-9 9-9 21t9 21l123 123-123 123q-9 9-9 21t9 21q9 9 21 9t21-9l123-123ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"
          />
        </svg>
      </button>
    </div>
    <SliderInput
      class="span-2"
      v-model:value="attractor.hue"
      :min="0"
      :max="360"
      :step="1"
      :level="4"
      :isIntegerOnly="true"
      label="Hue"
    />
    <h4 class="span-2 subtitle">Saturation</h4>
    <h5>Strength</h5>
    <NumberInput
      v-model:value="attractor.saturationStrength"
      :min="0"
      :step="0.1"
      label="Saturation strength"
    />
    <h5>Offset</h5>
    <NumberInput v-model:value="attractor.saturationOffset" :step="0.1" label="Saturation offset" />
    <h4 class="span-2 subtitle">Value</h4>
    <h5>Strength</h5>
    <NumberInput
      v-model:value="attractor.valueStrength"
      :min="0"
      :step="0.1"
      label="Value strength"
    />
    <h5>Offset</h5>
    <NumberInput v-model:value="attractor.valueOffset" :step="0.1" label="Value offset" />
  </div>
</template>

<style scoped>
.attractor-item {
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.25rem;
  align-items: center;
  border: 1px solid var(--gray-300);
  border-radius: 0.25rem;
  padding: 0.5rem;
}

.span-2 {
  grid-column: span 2;
}

.text-attractor {
  margin-bottom: 0.5rem;
}

.attractor {
  display: grid;
  grid-template-columns: auto 9.75rem 2rem;
  align-items: center;
  gap: 0.25rem;
}

.icon-button {
  padding: 0rem;
}

.icon-button svg {
  width: 1.7rem;
  height: 1.7rem;
}

.subtitle {
  margin-top: 0.5rem;
}

h5 {
  padding-left: 0.25rem;
}
</style>
