<script setup lang="ts">
import NumberInput from "@/components/inputs/NumberInput.vue";
import SliderInput from "@/components/inputs/SliderInput.vue";
import ExpandableDisclosure from "@/components/primitives/ExpandableDisclosure.vue";
import { computed, type ComputedRef } from "vue";

const juliaHSV = defineModel<number[]>("juliaHSV", { required: true });
const fatouHue = defineModel<number>("fatouHue", { required: true });
const fatouSaturationStrength = defineModel<number>("fatouSaturationStrength", { required: true });
const fatouSaturationOffset = defineModel<number>("fatouSaturationOffset", { required: true });
const fatouValueStrength = defineModel<number>("fatouValueStrength", { required: true });
const fatouValueOffset = defineModel<number>("fatouValueOffset", { required: true });

const visualiserColour: ComputedRef<string> = computed(() => {
  const l = juliaHSV.value[2] * (1 - juliaHSV.value[1] / 2);
  const s = l != 0 && l != 1 ? (juliaHSV.value[2] - l) / Math.min(l, 1 - l) : 0;
  return `hsl(${juliaHSV.value[0]}, ${s * 100}%, ${l * 100}%)`;
});
</script>

<template>
  <div class="panel-container">
    <header>
      <ExpandableDisclosure :headingCentred="true" :headingLevel="2" headingText="Colours">
        <p>This panel allows to change the colours used to draw the Julia and Fatou sets.</p>
      </ExpandableDisclosure>
    </header>

    <div class="panel-content">
      <section>
        <ExpandableDisclosure class="section-header" :headingLevel="3" headingText="Julia">
          <p>
            In this section, you can change the colour of the Julia Set. The colour use the HSV
            colour system (see the
            <a href="https://en.wikipedia.org/wiki/HSL_and_HSV"> Wikipedia page </a>
            for more details)
          </p>
        </ExpandableDisclosure>
        <div class="content">
          <h4>Colour</h4>
          <div class="colour-visualiser" :style="'background-color:' + visualiserColour"></div>
          <SliderInput
            class="span-2 julia-slider-input"
            v-model:value="juliaHSV[0]"
            :min="0"
            :max="360"
            :step="1"
            :isIntegerOnly="true"
            :level="5"
            label="Hue"
          />
          <SliderInput
            class="span-2 julia-slider-input"
            v-model:value="juliaHSV[1]"
            :min="0"
            :max="1"
            :step="0.01"
            :level="5"
            label="Saturation"
          />
          <SliderInput
            class="span-2 julia-slider-input"
            v-model:value="juliaHSV[2]"
            :min="0"
            :max="1"
            :step="0.01"
            :level="5"
            label="Value"
          />
        </div>
      </section>
      <section>
        <ExpandableDisclosure class="section-header" :headingLevel="3" headingText="Fatou">
          <p>In this section, you can change the colour of the Fatou Sets.</p>
        </ExpandableDisclosure>
        <div class="content">
          <SliderInput
            class="span-2"
            v-model:value="fatouHue"
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
            v-model:value="fatouSaturationStrength"
            :min="0"
            :step="0.1"
            label="Saturation strength"
          />
          <h5>Offset</h5>
          <NumberInput
            v-model:value="fatouSaturationOffset"
            :step="0.1"
            label="Saturation offset"
          />
          <h4 class="span-2 subtitle">Value</h4>
          <h5>Strength</h5>
          <NumberInput
            v-model:value="fatouValueStrength"
            :min="0"
            :step="0.1"
            label="Value strength"
          />
          <h5>Offset</h5>
          <NumberInput v-model:value="fatouValueOffset" :step="0.1" label="Value offset" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.colour-visualiser {
  width: 2.5rem;
  height: 1.4rem;
  border: 2px solid var(--gray-100);
  border-radius: 0.25rem;
  margin-left: auto;
  margin-right: 0.25rem;
}

.julia-slider-input {
  padding-inline: 0.25rem;
  margin-bottom: 0.5rem;
  margin-top: 0.25rem;
}

.span-2 {
  grid-column: span 2;
}

.subtitle {
  margin-top: 0.5rem;
}
</style>
