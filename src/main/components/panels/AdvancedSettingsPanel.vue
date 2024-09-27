<script setup lang="ts">
import ExpandableDisclosure from "@/components/primitives/ExpandableDisclosure.vue";
import ComplexInput from "@/components/inputs/ComplexInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
import type Configuration from "@/models/Configuration";

const configuration = defineModel<Configuration>("configuration", { required: true });
</script>

<template>
  <div class="panel-container">
    <header>
      <ExpandableDisclosure
        :headingCentred="true"
        :headingLevel="2"
        headingText="Advanced settings"
      >
        <p>This panel allows to change advanced settings.</p>
        <p>
          Be careful when editing those, small changes can greatly affect the results and the
          performances.
        </p>
      </ExpandableDisclosure>
    </header>

    <div class="panel-content">
      <section>
        <ExpandableDisclosure class="section-header" :headingLevel="3" headingText="Viewport">
          <p>In this section, you can change the viewport parameters:</p>
          <ul class="info-list">
            <li>
              <span class="info-list-item-title">Resolution</span>: This is the resolution of the
              viewport. A value of 1 means that the resolution of the window is used. In order for
              any change to the resolution to be applied, the configuration has to be saved and the
              page reloaded.
            </li>
            <li>
              <span class="info-list-item-title">Scale</span>: This is the scale of the viewport. A
              scale of 1 corresponds means the smallest axis of the viewport has a length of 2 (from
              -1 to 1 if the centre of the viewport is 0).
            </li>
            <li>
              <span class="info-list-item-title">Centre</span>: This is the complex number at the
              centre of the viewport. By default, it is 0.
            </li>
          </ul>
        </ExpandableDisclosure>
        <div class="content">
          <h4>Resolution</h4>
          <NumberInput
            v-model:value="configuration.resolutionScale"
            :min="0"
            :step="0.1"
            label="Resolution"
          />
          <h4>Scale</h4>
          <NumberInput
            v-model:value="configuration.coordinatesScale"
            :min="0"
            :step="0.1"
            label="Coordinates scale"
          />
          <h4>Centre</h4>
          <ComplexInput
            v-model:complex="configuration.coordinatesCentre"
            label="Coordinates centre"
          />
        </div>
      </section>

      <section>
        <ExpandableDisclosure class="section-header" :headingLevel="3" headingText="Computation">
          <p>In this section, you can change the computation parameters:</p>
          <ul class="info-list">
            <li>
              <span class="info-list-item-title">Iterations</span>: This is the number of iterations
              of the function for each point.
            </li>
            <li>
              <span class="info-list-item-title">Epsilon</span>: This is the small number added to
              the initial complex number to compute the divergence.
            </li>
            <li>
              <span class="info-list-item-title">Julia bound</span>: This is the bound for the Julia
              set. All points with a log-divergence lesser than the julia Bound will be considered
              in the Julia Set.
            </li>
          </ul>
        </ExpandableDisclosure>
        <div class="content">
          <h4>Iterations</h4>
          <NumberInput
            v-model:value="configuration.iterationsCount"
            :min="1"
            :step="1"
            :isIntegerOnly="true"
            wrongInputMessage="Please enter a valid number of iterations"
            label="Number of iterations"
          />
          <h4>Epsilon</h4>
          <NumberInput
            v-model:value="configuration.epsilon"
            :min="0"
            :step="0.001"
            label="Epsilon"
          />
          <h4>Julia bound</h4>
          <NumberInput v-model:value="configuration.juliaBound" :step="0.1" label="Julia bound" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped></style>
