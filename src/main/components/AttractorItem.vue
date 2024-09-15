<script lang="ts">
import { defineComponent } from "vue";
import Complex from "@/models/Complex";
import Attractor from "@/models/Attractor";
import SliderInput from "@/components/SliderInput.vue";
import ComplexInput from "@/components/ComplexInput.vue";
import NumberInput from "@/components/NumberInput.vue";

export default defineComponent({
  name: "AttractorItem",
  components: { ComplexInput, SliderInput, NumberInput },
  props: {
    isDefault: { type: Boolean, default: false },
    isInfinity: { type: Boolean, default: false },
    attractor: {
      type: Attractor,
      default: new Attractor(new Complex(0, 0), 0, 1, 1, 1, 1),
    },
  },
  emits: ["delete:attractor", "change"],
  methods: {
    updateComplex(newComplex: Complex) {
      this.attractor.complex = newComplex;
      this.$emit("change");
    },
    updateHue(newHue: number) {
      this.attractor.hue = newHue;
      this.$emit("change");
    },
    updateSaturationStrength(newSaturationStrength: number) {
      this.attractor.saturationStrength = newSaturationStrength;
      this.$emit("change");
    },
    updateSaturationOffset(newSaturationOffset: number) {
      this.attractor.saturationOffset = newSaturationOffset;
      this.$emit("change");
    },
    updateValueStrength(newValueStrength: number) {
      this.attractor.valueStrength = newValueStrength;
      this.$emit("change");
    },
    updateValueOffset(newValueOffset: number) {
      this.attractor.valueOffset = newValueOffset;
      this.$emit("change");
    },
  },
});
</script>

<template>
  <div class="attractor-item">
    <h4 v-if="isDefault" class="span-2 text-attractor">Default (no attractor)</h4>
    <h4 v-else-if="isInfinity" class="span-2 text-attractor">Divergence to Infinity</h4>
    <div v-else class="attractor span-2">
      <h4>Attractor</h4>
      <ComplexInput
        :complex="attractor.complex"
        label="Attractor"
        @update:complex="updateComplex"
      />
      <button class="icon-button" @click="$emit('delete:attractor')">
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
      :value="attractor.hue"
      :min="0"
      :max="360"
      :step="1"
      :level="4"
      :integerOnly="true"
      label="Hue"
      @update:value="updateHue"
    />
    <h4 class="span-2 subtitle">Saturation</h4>
    <h5>Strength</h5>
    <NumberInput
      :value="attractor.saturationStrength"
      :min="0"
      :step="0.1"
      label="Saturation strength"
      @update:value="updateSaturationStrength"
    />
    <h5>Offset</h5>
    <NumberInput
      :value="attractor.saturationOffset"
      :min="0"
      :step="0.1"
      label="Saturation offset"
      @update:value="updateSaturationOffset"
    />
    <h4 class="span-2 subtitle">Value</h4>
    <h5>Strength</h5>
    <NumberInput
      :value="attractor.valueStrength"
      :min="0"
      :step="0.1"
      label="Value strength"
      @update:value="updateValueStrength"
    />
    <h5>Offset</h5>
    <NumberInput
      :value="attractor.valueOffset"
      :min="0"
      :step="0.1"
      label="Value offset"
      @update:value="updateValueOffset"
    />
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
