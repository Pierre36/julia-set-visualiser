<script>
import InfoHeader from "./InfoHeader.vue";
import SliderInput from "./SliderInput.vue";

export default {
  name: "ColorsPanel",
  components: {
    InfoHeader,
    SliderInput,
  },
  props: {
    juliaHSV: { type: Array, required: true },
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
          class="span-2"
          name="Hue"
          :value="juliaHSV[0]"
          :min="0"
          :max="360"
          :step="1"
          @update:value="(newHue) => updateJuliaHue(newHue)"
        />
        <SliderInput
          class="span-2"
          name="Saturation"
          :value="juliaHSV[1]"
          :min="0"
          :max="1"
          :step="0.01"
          @update:value="
            (newSaturation) => updateJuliaSaturation(newSaturation)
          "
        />
        <SliderInput
          class="span-2"
          name="Value"
          :value="juliaHSV[2]"
          :min="0"
          :max="1"
          :step="0.01"
          @update:value="(newValue) => updateJuliaValue(newValue)"
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

.span-2 {
  grid-column: span 2;
}
</style>
