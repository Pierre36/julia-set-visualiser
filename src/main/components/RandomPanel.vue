<script setup lang="ts">
import CoefficientTypes from "@/constants/CoefficientTypes";
import FunctionTypes from "@/constants/FunctionTypes";
import Configuration from "@/models/Configuration";
import ExpandableDisclosure from "@/components/ExpandableDisclosure.vue";
import IconTextButton from "@/components/IconTextButton.vue";
import MinMaxInput from "@/components/MinMaxInput.vue";
import MultiComboBox from "@/components/MultiComboBox.vue";
import { ref } from "vue";

const configuration = defineModel<Configuration>("configuration", { required: true });

const functionTypeOptions = [
  { id: FunctionTypes.DEFAULT, text: "Default" },
  { id: FunctionTypes.NEWTON, text: "Newton" },
  { id: FunctionTypes.FRACTION, text: "Fraction" },
];
const coefficientTypeOptions = [
  { id: CoefficientTypes.CONSTANT, text: "Constant" },
  { id: CoefficientTypes.CIRCLE, text: "Circle" },
  { id: CoefficientTypes.LINE, text: "Line" },
  { id: CoefficientTypes.ELLIPSE, text: "Ellipse" },
];
const disclosureSvgPath =
  "M480-357q-6 0-11-2t-10-7L261-564q-8-8-7.5-21.5T262-607q10-10 21.5-8.5T304-606l176 176 176-176q8-8 21.5-9t21.5 9q10 8 8.5 21t-9.5 22L501-366q-5 5-10 7t-11 2Z";

const randomParameters = ref({
  functionParameters: {
    functionTypes: new Set([FunctionTypes.DEFAULT, FunctionTypes.NEWTON, FunctionTypes.FRACTION]),
    minCoefficientsCount: 2,
    maxCoefficientsCount: 5,
    coefficientsParameters: {
      coefficientTypes: new Set([
        CoefficientTypes.CONSTANT,
        CoefficientTypes.CIRCLE,
        CoefficientTypes.LINE,
        CoefficientTypes.ELLIPSE,
      ]),
      constantParameters: { minModulus: 0.1, maxModulus: 10 },
      circleParameters: {
        centerParameters: { minModulus: 0.1, maxModulus: 10 },
        minRadius: 0.1,
        maxRadius: 10,
        minDuration: 5,
        maxDuration: 30,
      },
      lineParameters: {
        startEndParameters: { minModulus: 0.1, maxModulus: 10 },
        minDuration: 5,
        maxDuration: 30,
      },
      ellipseParameters: {
        centerParameters: { minModulus: 0.1, maxModulus: 10 },
        minHalfWidth: 0.1,
        maxHalfWidth: 10,
        minHalfHeight: 0.1,
        maxHalfHeight: 10,
        minRotationAngle: 0,
        maxRotationAngle: 360,
        minDuration: 5,
        maxDuration: 30,
      },
    },
  },
  minJuliaHue: 0,
  maxJuliaHue: 0,
  minJuliaSaturation: 0,
  maxJuliaSaturation: 0,
  minJuliaValue: 1,
  maxJuliaValue: 1,
  attractorsParameters: {
    minHue: 0,
    maxHue: 360,
    minSaturationStrength: 0.01,
    maxSaturationStrength: 0.2,
    minSaturationOffset: 0,
    maxSaturationOffset: 1,
    minValueStrength: 0.1,
    maxValueStrength: 0.5,
    minValueOffset: 0,
    maxValueOffset: 3,
  },
  minViewportScale: 1,
  maxViewportScale: 3,
  viewportCentreParameters: { minModulus: 0, maxModulus: 0 },
  minIterationsCount: 10,
  maxIterationsCount: 40,
  minEpsilon: 0.000005,
  maxEpsilon: 0.000015,
  minJuliaBound: -5,
  maxJuliaBound: -3,
});

function randomize() {
  configuration.value.randomize(randomParameters.value);
}
</script>

<template>
  <div class="panel-container">
    <header>
      <ExpandableDisclosure :headingCentred="true" :headingLevel="2" headingText="Randomize">
        <p>This panel allows to randomize the parameters of the fractal.</p>
        <p>You can edit the range of values the parameters can take.</p>
        <p>
          Click the randomize button at the bottom to give random values to all parameters of the
          fractal.
        </p>
      </ExpandableDisclosure>
    </header>

    <div class="panel-content">
      <section>
        <ExpandableDisclosure class="section-header" :headingLevel="3" headingText="Function">
          <p>
            In this section, you can change the range of values the function parameters can take.
          </p>
          <p>
            For complex numbers, you can choose their min and max modulus. This means that the
            distance between the complex number and zero will be between the min and max you set.
          </p>
        </ExpandableDisclosure>
        <div class="content one-column">
          <h4>Function types</h4>
          <MultiComboBox
            id="function-types-multi-combobox"
            :options="functionTypeOptions"
            v-model:selected="randomParameters.functionParameters.functionTypes"
            label="Function types"
            noOptionsSelectedText="No function type"
            allOptionsSelectedText="All function types"
          />
          <h4>Coefficient types</h4>
          <MultiComboBox
            id="coefficient-types-multi-combobox"
            :options="coefficientTypeOptions"
            v-model:selected="
              randomParameters.functionParameters.coefficientsParameters.coefficientTypes
            "
            label="Coefficient types"
            noOptionsSelectedText="No coefficient type"
            allOptionsSelectedText="All coefficient types"
          />
          <h4>Number of coefficients</h4>
          <MinMaxInput
            v-model:minValue="randomParameters.functionParameters.minCoefficientsCount"
            v-model:maxValue="randomParameters.functionParameters.maxCoefficientsCount"
            :min="1"
            :max="32"
            :step="1"
            :isIntegerOnly="true"
            minLabel="Minimum number of coefficients"
            maxLabel="Maximum number of coefficients"
          />
          <ExpandableDisclosure
            headingText="Constant coefficients"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Complex modulus</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="
                randomParameters.functionParameters.coefficientsParameters.constantParameters
                  .minModulus
              "
              v-model:maxValue="
                randomParameters.functionParameters.coefficientsParameters.constantParameters
                  .maxModulus
              "
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum modulus of constant complex coefficients"
              maxLabel="Maximum modulus of constant complex coefficients"
              :level="6"
            />
          </ExpandableDisclosure>
          <ExpandableDisclosure
            headingText="Circle coefficients"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Centre modulus</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="
                randomParameters.functionParameters.coefficientsParameters.circleParameters
                  .centerParameters.minModulus
              "
              v-model:maxValue="
                randomParameters.functionParameters.coefficientsParameters.circleParameters
                  .centerParameters.maxModulus
              "
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum modulus of circle coefficients centres"
              maxLabel="Maximum modulus of circle coefficients centres"
              :level="6"
            />
            <h5>Radius</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="
                randomParameters.functionParameters.coefficientsParameters.circleParameters
                  .minRadius
              "
              v-model:maxValue="
                randomParameters.functionParameters.coefficientsParameters.circleParameters
                  .maxRadius
              "
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum radius of circle coefficients"
              maxLabel="Maximum radius of circle coefficients"
              :level="6"
            />
            <h5>Duration</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="
                randomParameters.functionParameters.coefficientsParameters.circleParameters
                  .minDuration
              "
              v-model:maxValue="
                randomParameters.functionParameters.coefficientsParameters.circleParameters
                  .maxDuration
              "
              :min="1"
              :max="300"
              :step="1"
              :isIntegerOnly="true"
              minLabel="Minimum duration of circle coefficients"
              maxLabel="Maximum duration of circle coefficients"
              :level="6"
            />
          </ExpandableDisclosure>
          <ExpandableDisclosure
            headingText="Line coefficients"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Start and end modulus</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="
                randomParameters.functionParameters.coefficientsParameters.lineParameters
                  .startEndParameters.minModulus
              "
              v-model:maxValue="
                randomParameters.functionParameters.coefficientsParameters.lineParameters
                  .startEndParameters.maxModulus
              "
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum modulus of line coefficients start/end"
              maxLabel="Maximum modulus of line coefficients start/end"
              :level="6"
            />
            <h5>Duration</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="
                randomParameters.functionParameters.coefficientsParameters.lineParameters
                  .minDuration
              "
              v-model:maxValue="
                randomParameters.functionParameters.coefficientsParameters.lineParameters
                  .maxDuration
              "
              :min="1"
              :max="300"
              :step="1"
              :isIntegerOnly="true"
              minLabel="Minimum duration of line coefficients"
              maxLabel="Maximum duration of line coefficients"
              :level="6"
            />
          </ExpandableDisclosure>
          <ExpandableDisclosure
            headingText="Ellipse coefficients"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Centre modulus</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="
                randomParameters.functionParameters.coefficientsParameters.ellipseParameters
                  .centerParameters.minModulus
              "
              v-model:maxValue="
                randomParameters.functionParameters.coefficientsParameters.ellipseParameters
                  .centerParameters.maxModulus
              "
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum modulus of ellipse coefficients centres"
              maxLabel="Maximum modulus of ellipse coefficients centres"
              :level="6"
            />
            <h5>Half-width</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="
                randomParameters.functionParameters.coefficientsParameters.ellipseParameters
                  .minHalfWidth
              "
              v-model:maxValue="
                randomParameters.functionParameters.coefficientsParameters.ellipseParameters
                  .maxHalfWidth
              "
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum half-width of ellipse coefficients"
              maxLabel="Maximum half-width of ellipse coefficients"
              :level="6"
            />
            <h5>Half-height</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="
                randomParameters.functionParameters.coefficientsParameters.ellipseParameters
                  .minHalfHeight
              "
              v-model:maxValue="
                randomParameters.functionParameters.coefficientsParameters.ellipseParameters
                  .maxHalfHeight
              "
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum half-height of ellipse coefficients"
              maxLabel="Maximum half-height of ellipse coefficients"
              :level="6"
            />
            <h5>Rotation angle</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="
                randomParameters.functionParameters.coefficientsParameters.ellipseParameters
                  .minRotationAngle
              "
              v-model:maxValue="
                randomParameters.functionParameters.coefficientsParameters.ellipseParameters
                  .maxRotationAngle
              "
              :min="0"
              :max="360"
              :step="1"
              :isIntegerOnly="false"
              minLabel="Minimum rotation angle of ellipse coefficients"
              maxLabel="Maximum rotation angle of ellipse coefficients"
              :level="6"
            />
            <h5>Duration</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="
                randomParameters.functionParameters.coefficientsParameters.ellipseParameters
                  .minDuration
              "
              v-model:maxValue="
                randomParameters.functionParameters.coefficientsParameters.ellipseParameters
                  .maxDuration
              "
              :min="1"
              :max="300"
              :step="1"
              :isIntegerOnly="true"
              minLabel="Minimum duration of ellipse coefficients"
              maxLabel="Maximum duration of ellipse coefficients"
              :level="6"
            />
          </ExpandableDisclosure>
        </div>
      </section>

      <section>
        <ExpandableDisclosure class="section-header" :headingLevel="3" headingText="Colours">
          <p>
            In this section, you can change the range of values the colours parameters can take.
          </p>
        </ExpandableDisclosure>
        <div class="content one-column">
          <ExpandableDisclosure
            headingText="Julia colour"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Hue</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="randomParameters.minJuliaHue"
              v-model:maxValue="randomParameters.maxJuliaHue"
              :min="0"
              :max="360"
              :step="1"
              :isIntegerOnly="true"
              minLabel="Minimum hue of Julia colour"
              maxLabel="Maximum hue of Julia colour"
              :level="6"
            />
            <h5>Saturation</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="randomParameters.minJuliaSaturation"
              v-model:maxValue="randomParameters.maxJuliaSaturation"
              :min="0"
              :max="1"
              :step="0.01"
              :isIntegerOnly="false"
              minLabel="Minimum saturation of Julia colour"
              maxLabel="Maximum saturation of Julia colour"
              :level="6"
            />
            <h5>Value</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="randomParameters.minJuliaValue"
              v-model:maxValue="randomParameters.maxJuliaValue"
              :min="0"
              :max="1"
              :step="0.01"
              :isIntegerOnly="false"
              minLabel="Minimum value of Julia colour"
              maxLabel="Maximum value of Julia colour"
              :level="6"
            />
          </ExpandableDisclosure>
          <ExpandableDisclosure
            headingText="Attractors"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Hue</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="randomParameters.attractorsParameters.minHue"
              v-model:maxValue="randomParameters.attractorsParameters.maxHue"
              :min="0"
              :max="360"
              :step="1"
              :isIntegerOnly="true"
              minLabel="Minimum hue of attractors colour"
              maxLabel="Maximum hue of attractors colour"
              :level="6"
            />
            <h5>Saturation strength</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="randomParameters.attractorsParameters.minSaturationStrength"
              v-model:maxValue="randomParameters.attractorsParameters.maxSaturationStrength"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum saturation strength of attractors colour"
              maxLabel="Maximum saturation strength of attractors colour"
              :level="6"
            />
            <h5>Saturation offset</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="randomParameters.attractorsParameters.minSaturationOffset"
              v-model:maxValue="randomParameters.attractorsParameters.maxSaturationOffset"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum saturation offset of attractors colour"
              maxLabel="Maximum saturation offset of attractors colour"
              :level="6"
            />
            <h5>Value strength</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="randomParameters.attractorsParameters.minValueStrength"
              v-model:maxValue="randomParameters.attractorsParameters.maxValueStrength"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum value strength of attractors colour"
              maxLabel="Maximum value strength of attractors colour"
              :level="6"
            />
            <h5>Value offset</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="randomParameters.attractorsParameters.minValueOffset"
              v-model:maxValue="randomParameters.attractorsParameters.maxValueOffset"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum value offset of attractors colour"
              maxLabel="Maximum value offset of attractors colour"
              :level="6"
            />
          </ExpandableDisclosure>
        </div>
      </section>

      <section>
        <ExpandableDisclosure
          class="section-header"
          :headingLevel="3"
          headingText="Advanced Settings"
        >
          <p>
            In this section, you can change the range of values the advanced parameters can take.
          </p>
          <p>
            Note that the resolution cannot be randomized. Therefore, the resolution chosen in the
            advanced panel will stay the same.
          </p>
        </ExpandableDisclosure>
        <div class="content one-column">
          <ExpandableDisclosure
            headingText="Viewport"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Scale</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="randomParameters.minViewportScale"
              v-model:maxValue="randomParameters.maxViewportScale"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum scale of viewport"
              maxLabel="Maximum scale of viewport"
              :level="6"
            />
            <h5>Centre modulus</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="randomParameters.viewportCentreParameters.minModulus"
              v-model:maxValue="randomParameters.viewportCentreParameters.maxModulus"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum modulus of viewport centre"
              maxLabel="Maximum modulus of viewport centre"
              :level="6"
            />
          </ExpandableDisclosure>
          <ExpandableDisclosure
            headingText="Computation"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Number of iterations</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="randomParameters.minIterationsCount"
              v-model:maxValue="randomParameters.maxIterationsCount"
              :min="0"
              :max="100"
              :step="1"
              :isIntegerOnly="true"
              minLabel="Minimum number of iterations"
              maxLabel="Maximum number of iterations"
              :level="6"
            />
            <h5>Epsilon</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="randomParameters.minEpsilon"
              v-model:maxValue="randomParameters.maxEpsilon"
              :min="0.0000001"
              :max="0.001"
              :step="0.000001"
              :isIntegerOnly="false"
              minLabel="Minimum value of epsilon"
              maxLabel="Maximum value of epsilon"
              :level="6"
            />
            <h5>Julia bound</h5>
            <MinMaxInput
              class="parameter-input"
              v-model:minValue="randomParameters.minJuliaBound"
              v-model:maxValue="randomParameters.maxJuliaBound"
              :min="-100"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum value of the Julia bound"
              maxLabel="Maximum value of the Julia bound"
              :level="6"
            />
          </ExpandableDisclosure>
        </div>
      </section>

      <section>
        <IconTextButton
          class="full-width"
          text="Randomize"
          svgPath="M648-253q24.583 0 41.792-17.208Q707-287.417 707-312q0-24.583-17.208-41.792Q672.583-371 648-371q-24.583 0-41.792 17.208Q589-336.583 589-312q0 24.583 17.208 41.792Q623.417-253 648-253ZM478-423q24.583 0 41.792-17.208Q537-457.417 537-482q0-24.583-17.208-41.792Q502.583-541 478-541q-24.583 0-41.792 17.208Q419-506.583 419-482q0 24.583 17.208 41.792Q453.417-423 478-423ZM312-589q24.583 0 41.792-17.208Q371-623.417 371-648q0-24.583-17.208-41.792Q336.583-707 312-707q-24.583 0-41.792 17.208Q253-672.583 253-648q0 24.583 17.208 41.792Q287.417-589 312-589ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z"
          @click="randomize()"
        />
      </section>
    </div>
  </div>
</template>

<style scoped>
.parameter-input {
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
  margin-left: 0.25rem;
}

.full-width {
  width: 100%;
}
</style>
