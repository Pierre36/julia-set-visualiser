<script>
import Disclosure from "./Disclosure.vue";
import ComplexInput from "./ComplexInput.vue";
import NumberInput from "./NumberInput.vue";

export default {
  name: "AdvancedSettingsPanel",
  components: { Disclosure, ComplexInput, NumberInput },
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
    <Disclosure :headingCentered="true" :headingLevel="2" headingText="Advanced settings">
      <p>This panel allows to change advanced settings.</p>
      <p>
        Be careful when editing those, small changes can greatly affect the results and the
        performances.
      </p>
    </Disclosure>
  </header>

  <div class="panel-content">
    <section>
      <Disclosure class="section-header" :headingLevel="3" headingText="Viewport">
        <p>In this section, you can change the viewport parameters:</p>
        <ul class="info-list">
          <li>
            <span class="info-list-item-title">Resolution</span>: This is the resolution of the
            viewport. A value of 1 means that the resolution of the window is used. In order for any
            change to the resolution to be applied, the configuration has to be saved and the page
            reloaded.
          </li>
          <li>
            <span class="info-list-item-title">Scale</span>: This is the scale of the viewport. A
            scale of 1 corresponds means the smallest axis of the viewport has a length of 2 (from
            -1 to 1 if the center of the viewport is 0).
          </li>
          <li>
            <span class="info-list-item-title">Center</span>: This is the complex number at the
            center of the viewport. By default, it is 0.
          </li>
        </ul>
      </Disclosure>
      <div class="content">
        <h4>Resolution</h4>
        <NumberInput
          :value="configuration.resolutionScale"
          :min="0"
          :step="0.1"
          label="Resolution"
          @update:value="updateResolutionScale"
        />
        <h4>Scale</h4>
        <NumberInput
          :value="configuration.coordinatesScale"
          :min="0"
          :step="0.1"
          label="Coordinates scale"
          @update:value="updateCoordinatesScale"
        />
        <h4>Center</h4>
        <ComplexInput
          :complex="configuration.coordinatesCenter"
          label="Coordinates center"
          @update:complex="updateCoordinatesCenter"
        />
      </div>
    </section>

    <section>
      <Disclosure class="section-header" :headingLevel="3" headingText="Computation">
        <p>In this section, you can change the computation parameters:</p>
        <ul class="info-list">
          <li>
            <span class="info-list-item-title">Iterations</span>: This is the number of iterations
            of the function for each point.
          </li>
          <li>
            <span class="info-list-item-title">Epsilon</span>: This is the small number added to the
            initial complex number to compute the divergence.
          </li>
          <li>
            <span class="info-list-item-title">Julia bound</span>: This is the bound for the Julia
            set. All points with a log-divergence lesser than the julia Bound will be considered in
            the Julia Set.
          </li>
        </ul>
      </Disclosure>
      <div class="content">
        <h4>Iterations</h4>
        <NumberInput
          :value="configuration.nbIterations"
          :min="1"
          :step="1"
          :integerOnly="true"
          wrongInputMessage="Please enter a valid number of iterations"
          label="Number of iterations"
          @update:value="updateNbIterations"
        />
        <h4>Epsilon</h4>
        <NumberInput
          :value="configuration.epsilon"
          :min="0"
          :step="0.000001"
          label="Epsilon"
          @update:value="updateEpsilon"
        />
        <h4>Julia bound</h4>
        <NumberInput
          :value="configuration.juliaBound"
          :step="0.1"
          label="Julia bound"
          @update:value="updateJuliaBound"
        />
      </div>
    </section>
  </div>
</template>

<style scoped></style>
