<script>
import { Attractor } from "../models/Attractor";
import AttractorItem from "./AttractorItem.vue";
import InfoHeader from "./InfoHeader.vue";
import SliderInput from "./SliderInput.vue";
import IconTextButton from "./IconTextButton.vue";
import { Complex } from "../models/Complex";

export default {
  name: "ColorsPanel",
  components: {
    InfoHeader,
    SliderInput,
    AttractorItem,
    IconTextButton,
  },
  props: {
    juliaHSV: { type: Array, required: true },
    defaultAttractor: { type: Attractor, required: true },
    infinityAttractor: { type: Attractor, required: true },
    attractors: { type: Array, required: true },
  },
  computed: {
    visualizerColor() {
      return `hsl(${this.juliaHSV[0]}, ${this.juliaHSV[1] * 100}%, ${
        this.juliaHSV[2] * 100
      }%)`;
    },
  },
  methods: {
    updateJuliaHue(newHue) {
      this.juliaHSV[0] = newHue;
    },
    updateJuliaSaturation(newSaturation) {
      this.juliaHSV[1] = newSaturation;
    },
    updateJuliaValue(newValue) {
      this.juliaHSV[2] = newValue;
    },
    addAttractor() {
      this.attractors.push(new Attractor(new Complex(0, 0), 0, 1, 1, 1, 1));
    },
  },
};
</script>

<template>
  <header>
    <InfoHeader :centerTitle="true">
      <template #title>
        <h2>Colors</h2>
      </template>
      <template #info> </template>
    </InfoHeader>
  </header>

  <div class="panelContent">
    <section>
      <InfoHeader class="sectionHeader">
        <template #title>
          <h3>Julia</h3>
        </template>
        <template #info> </template>
      </InfoHeader>
      <div class="content">
        <h4>Color</h4>
        <div class="colorVisualizer"></div>
        <SliderInput
          class="span-2 juliaSliderInput"
          :value="juliaHSV[0]"
          :min="0"
          :max="360"
          :step="1"
          @update:value="(newHue) => updateJuliaHue(newHue)"
          ><template #name><h5>Hue</h5></template></SliderInput
        >
        <SliderInput
          class="span-2 juliaSliderInput"
          :value="juliaHSV[1]"
          :min="0"
          :max="1"
          :step="0.01"
          @update:value="
            (newSaturation) => updateJuliaSaturation(newSaturation)
          "
          ><template #name><h5>Saturation</h5></template></SliderInput
        >
        <SliderInput
          class="span-2 juliaSliderInput"
          :value="juliaHSV[2]"
          :min="0"
          :max="1"
          :step="0.01"
          @update:value="(newValue) => updateJuliaValue(newValue)"
          ><template #name><h5>Value</h5></template></SliderInput
        >
      </div>
    </section>

    <section>
      <InfoHeader class="sectionHeader">
        <template #title>
          <h3>Fatou</h3>
        </template>
        <template #info> </template>
      </InfoHeader>
      <div>
        <AttractorItem
          class="attractorItem"
          :isDefault="true"
          :isInfinity="false"
          :attractor="defaultAttractor"
        />
        <AttractorItem
          class="attractorItem"
          :isDefault="false"
          :isInfinity="true"
          :attractor="infinityAttractor"
        />
        <AttractorItem
          v-for="(attractor, index) in attractors"
          class="attractorItem"
          :key="index"
          :isDefault="false"
          :isInfinity="false"
          :attractor="attractor"
        />
        <IconTextButton
          v-if="attractors.length <= 16"
          id="addAttractorButton"
          svgPath="M453-446v136q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625 12.825 0 21.325-8.625T513-310v-136h137q12.75 0 21.375-8.675 8.625-8.676 8.625-21.5 0-12.825-8.625-21.325T650-506H513v-144q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T453-650v144H310q-12.75 0-21.375 8.675-8.625 8.676-8.625 21.5 0 12.825 8.625 21.325T310-446h143Zm27.266 366q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"
          text="New Attractor"
          @click="addAttractor"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.colorVisualizer {
  background-color: v-bind(visualizerColor);
  width: 2.5rem;
  height: 1.4rem;
  border: 2px solid var(--gray-100);
  border-radius: 0.25rem;
  margin-left: auto;
  margin-right: 0.25rem;
}

.juliaSliderInput {
  padding-inline: 0.25rem;
  margin-bottom: 0.5rem;
  margin-top: 0.25rem;
}

.attractorItem {
  margin-bottom: 0.75rem;
}

.span-2 {
  grid-column: span 2;
}

#addAttractorButton {
  width: 100%;
}
</style>
