<script lang="ts">
import { defineComponent } from "vue";
import Attractor from "@/models/Attractor";
import Complex from "@/models/Complex";
import AttractorItem from "@/components/AttractorItem.vue";
import Disclosure from "@/components/Disclosure.vue";
import SliderInput from "@/components/SliderInput.vue";
import IconTextButton from "@/components/IconTextButton.vue";

export default defineComponent({
  name: "ColorsPanel",
  components: {
    Disclosure,
    SliderInput,
    AttractorItem,
    IconTextButton,
  },
  props: {
    juliaHSV: { type: Array<number>, required: true },
    defaultAttractor: { type: Attractor, required: true },
    infinityAttractor: { type: Attractor, required: true },
    attractors: { type: Array<Attractor>, required: true },
  },
  emits: ["change"],
  computed: {
    visualizerColor() {
      const l = this.juliaHSV[2] * (1 - this.juliaHSV[1] / 2);
      let s = 0;
      if (l != 0 && l != 1) {
        s = (this.juliaHSV[2] - l) / Math.min(l, 1 - l);
      }
      return `hsl(${this.juliaHSV[0]}, ${s * 100}%, ${l * 100}%)`;
    },
  },
  methods: {
    updateJuliaHue(newHue: number) {
      this.juliaHSV[0] = newHue;
      this.$emit("change");
    },
    updateJuliaSaturation(newSaturation: number) {
      this.juliaHSV[1] = newSaturation;
      this.$emit("change");
    },
    updateJuliaValue(newValue: number) {
      this.juliaHSV[2] = newValue;
      this.$emit("change");
    },
    addAttractor() {
      this.attractors.push(new Attractor(new Complex(0, 0), 0, 1, 0, 1, 0));
      this.$emit("change");
    },
    deleteAttractor(index: number) {
      this.attractors.splice(index, 1);
      this.$emit("change");
    },
  },
});
</script>

<template>
  <div class="panel-container">
    <header>
      <Disclosure :headingCentered="true" :headingLevel="2" headingText="Colors">
        <p>This panel allows to change the colors used to draw the Julia and Fatou sets.</p>
      </Disclosure>
    </header>

    <div class="panel-content">
      <section>
        <Disclosure class="section-header" :headingLevel="3" headingText="Julia">
          <p>
            In this section, you can change the color of the Julia Set. The color use the HSV color
            system (see the
            <a href="https://en.wikipedia.org/wiki/HSL_and_HSV"> Wikipedia page </a>
            for more details)
          </p>
        </Disclosure>
        <div class="content">
          <h4>Color</h4>
          <div class="color-visualizer" :style="'background-color:' + visualizerColor"></div>
          <SliderInput
            class="span-2 julia-slider-input"
            :value="juliaHSV[0]"
            :min="0"
            :max="360"
            :step="1"
            :integerOnly="true"
            :level="5"
            label="Hue"
            @update:value="(newHue) => updateJuliaHue(newHue)"
          />
          <SliderInput
            class="span-2 julia-slider-input"
            :value="juliaHSV[1]"
            :min="0"
            :max="1"
            :step="0.01"
            :level="5"
            label="Saturation"
            @update:value="(newSaturation) => updateJuliaSaturation(newSaturation)"
          />
          <SliderInput
            class="span-2 julia-slider-input"
            :value="juliaHSV[2]"
            :min="0"
            :max="1"
            :step="0.01"
            :level="5"
            label="Value"
            @update:value="(newValue) => updateJuliaValue(newValue)"
          />
        </div>
      </section>
      <section>
        <Disclosure class="section-header" :headingLevel="3" headingText="Fatou">
          <p>In this section, you can change the color of the Fatou Sets.</p>
          <p>
            You can choose the color parameters for the each attractor (including infinity). When
            computing the color, if no attractor is close enough, the default attractor is used.
          </p>
        </Disclosure>
        <div>
          <AttractorItem
            class="attractor-item"
            :isDefault="true"
            :isInfinity="false"
            :attractor="defaultAttractor"
            @change="$emit('change')"
          />
          <AttractorItem
            class="attractor-item"
            :isDefault="false"
            :isInfinity="true"
            :attractor="infinityAttractor"
            @change="$emit('change')"
          />
          <AttractorItem
            v-for="(attractor, index) in attractors"
            class="attractor-item"
            :key="index"
            :isDefault="false"
            :isInfinity="false"
            :attractor="attractor"
            @delete:attractor="deleteAttractor(index)"
            @change="$emit('change')"
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
.color-visualizer {
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
