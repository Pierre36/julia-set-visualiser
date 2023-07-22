<script>
import InfoHeader from "./InfoHeader.vue";
import ComplexInput from "./ComplexInput.vue";
import FloatInput from "./FloatInput.vue";
import IntInput from "./IntInput.vue";

export default {
  name: "AdvancedSettingsPanel",
  components: { InfoHeader, ComplexInput, FloatInput, IntInput },
  props: {
    configuration: { type: Object, required: true },
  },
  emits: ["change"],
  methods: {
    updateResolutionScale(newResolutionScale) {
      this.configuration.resolutionScale = newResolutionScale;
      this.$emit("change");
    },
    updateCoordinatesScale(newCoordinatesScale) {
      this.configuration.coordinatesScale = newCoordinatesScale;
      this.$emit("change");
    },
    updateCoordinatesCenter(newCoordinatesCenter) {
      this.configuration.coordinatesCenter = newCoordinatesCenter;
      this.$emit("change");
    },
    updateNbIterations(newNbIterations) {
      this.configuration.nbIterations = newNbIterations;
      this.$emit("change");
    },
    updateEpsilon(newEpsilon) {
      this.configuration.epsilon = newEpsilon;
      this.$emit("change");
    },
    updateJuliaBound(newJuliaBound) {
      this.configuration.juliaBound = newJuliaBound;
      this.$emit("change");
    },
  },
};
</script>

<template>
  <header>
    <InfoHeader :centerTitle="true">
      <template #title>
        <h2>Advanced settings</h2>
      </template>
      <template #info>
        <p>This panel allows to change advanced settings.</p>
        <p>
          Be careful when editing those, small changes can greatly affect the results and the
          performances.
        </p>
      </template>
    </InfoHeader>
  </header>

  <div class="panelContent">
    <section>
      <InfoHeader class="sectionHeader">
        <template #title>
          <h3>Viewport</h3>
        </template>
        <template #info>
          <p>In this section, you can change the viewport parameters:</p>
          <ul class="infoList">
            <li>
              <span class="infoListItemTitle">Resolution</span>: This is the resolution of the
              viewport. A value of 1 means that the resolution of the window is used. In order for
              any change to the resolution to be applied, the configuration has to be saved and the
              page reloaded.
            </li>
            <li>
              <span class="infoListItemTitle">Scale</span>: This is the scale of the viewport. A
              scale of 1 corresponds means the smallest axis of the viewport has a length of 2 (from
              -1 to 1 if the center of the viewport is 0).
            </li>
            <li>
              <span class="infoListItemTitle">Center</span>: This is the complex number at the
              center of the viewport. By default, it is 0.
            </li>
          </ul>
        </template>
      </InfoHeader>
      <div class="content">
        <h4>Resolution</h4>
        <FloatInput
          :float="configuration.resolutionScale"
          :min="0"
          :step="0.1"
          @update:float="updateResolutionScale"
        />
        <h4>Scale</h4>
        <FloatInput
          :float="configuration.coordinatesScale"
          :min="0"
          :step="0.1"
          @update:float="updateCoordinatesScale"
        />
        <h4>Center</h4>
        <ComplexInput
          :complex="configuration.coordinatesCenter"
          @update:complex="updateCoordinatesCenter"
        />
      </div>
    </section>

    <section>
      <InfoHeader class="sectionHeader">
        <template #title>
          <h3>Computation</h3>
        </template>
        <template #info>
          <p>In this section, you can change the computation parameters:</p>
          <ul class="infoList">
            <li>
              <span class="infoListItemTitle">Iterations</span>: This is the number of iterations of
              the function for each point.
            </li>
            <li>
              <span class="infoListItemTitle">Epsilon</span>: This is the small number added to the
              initial complex number to compute the divergence.
            </li>
            <li>
              <span class="infoListItemTitle">Julia bound</span>: This is the bound for the Julia
              set. All points with a log-divergance lesser than the julia Bound will be considered
              in the Julia Set.
            </li>
          </ul>
        </template>
      </InfoHeader>
      <div class="content">
        <h4>Iterations</h4>
        <IntInput
          :int="configuration.nbIterations"
          :min="1"
          :step="1"
          @update:int="updateNbIterations"
        />
        <h4>Epsilon</h4>
        <FloatInput
          :float="configuration.epsilon"
          :min="0"
          :step="0.000001"
          @update:float="updateEpsilon"
        />
        <h4>Julia bound</h4>
        <FloatInput
          :float="configuration.juliaBound"
          :step="0.1"
          @update:float="updateJuliaBound"
        />
      </div>
    </section>
  </div>
</template>

<style scoped></style>
