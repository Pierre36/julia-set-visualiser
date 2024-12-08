<script setup lang="ts">
import Attractor from "@/models/Attractor";
import Complex from "@/models/Complex";
import AttractorItem from "@/components/items/AttractorItem.vue";
import ExpandableDisclosure from "@/components/primitives/ExpandableDisclosure.vue";
import SliderInput from "@/components/inputs/SliderInput.vue";
import IconTextButton from "@/components/primitives/IconTextButton.vue";
import { computed, type ComputedRef } from "vue";

const juliaHSV = defineModel<number[]>("juliaHSV", { required: true });
const defaultAttractor = defineModel<Attractor>("defaultAttractor", { required: true });
const infinityAttractor = defineModel<Attractor>("infinityAttractor", { required: true });
const attractors = defineModel<Attractor[]>("attractors", { required: true });

const visualiserColour: ComputedRef<string> = computed(() => {
  const l = juliaHSV.value[2] * (1 - juliaHSV.value[1] / 2);
  const s = l != 0 && l != 1 ? (juliaHSV.value[2] - l) / Math.min(l, 1 - l) : 0;
  return `hsl(${juliaHSV.value[0]}, ${s * 100}%, ${l * 100}%)`;
});

function addAttractor(): void {
  attractors.value.push(new Attractor(new Complex(0, 0), 0, 1, 0, 1, 0));
}

function deleteAttractor(index: number): void {
  attractors.value.splice(index, 1);
}
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
          <p>
            You can choose the colour parameters for the each attractor (including infinity). When
            computing the colour, if no attractor is close enough, the default attractor is used.
          </p>
        </ExpandableDisclosure>
        <div>
          <AttractorItem
            class="attractor-item"
            :isDefault="true"
            :isInfinity="false"
            v-model:attractor="defaultAttractor"
          />
          <AttractorItem
            class="attractor-item"
            :isDefault="false"
            :isInfinity="true"
            v-model:attractor="infinityAttractor"
          />
          <AttractorItem
            v-for="(_, index) in attractors"
            class="attractor-item"
            :key="index"
            :isDefault="false"
            :isInfinity="false"
            v-model:attractor="attractors[index]"
            @delete:attractor="deleteAttractor(index)"
          />
          <IconTextButton
            v-if="attractors.length <= 15"
            id="addAttractorButton"
            svgPath="M453-446v136q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625 12.825 0 21.325-8.625T513-310v-136h137q12.75 0 21.375-8.675 8.625-8.676 8.625-21.5 0-12.825-8.625-21.325T650-506H513v-144q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T453-650v144H310q-12.75 0-21.375 8.675-8.625 8.676-8.625 21.5 0 12.825 8.625 21.325T310-446h143Zm27.266 366q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"
            text="New Attractor"
            @click="addAttractor"
          />
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

.attractor-item {
  margin-bottom: 0.75rem;
}

.span-2 {
  grid-column: span 2;
}

#addAttractorButton {
  width: 100%;
}
</style>
