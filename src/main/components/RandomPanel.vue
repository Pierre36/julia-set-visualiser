<script lang="ts">
import { defineComponent } from "vue";
import CoefficientTypes from "@/constants/CoefficientTypes";
import FunctionTypes from "@/constants/FunctionTypes";
import Configuration from "@/models/Configuration";
import Disclosure from "@/components/Disclosure.vue";
import IconTextButton from "@/components/IconTextButton.vue";
import MinMaxInput from "@/components/MinMaxInput.vue";
import MultiComboBox from "@/components/MultiComboBox.vue";

export default defineComponent({
  name: "RandomPanel",
  components: { IconTextButton, Disclosure, MinMaxInput, MultiComboBox },
  props: {
    configuration: { type: Configuration, required: true },
  },
  emits: ["change"],
  data() {
    return {
      functionTypeOptions: [
        { id: FunctionTypes.DEFAULT, text: "Default" },
        { id: FunctionTypes.NEWTON, text: "Newton" },
        { id: FunctionTypes.FRACTION, text: "Fraction" },
      ],
      selectedFunctionTypes: new Set([
        FunctionTypes.DEFAULT,
        FunctionTypes.NEWTON,
        FunctionTypes.FRACTION,
      ]),
      coefficientTypeOptions: [
        { id: CoefficientTypes.CONSTANT, text: "Constant" },
        { id: CoefficientTypes.CIRCLE, text: "Circle" },
        { id: CoefficientTypes.LINE, text: "Line" },
        { id: CoefficientTypes.ELLIPSE, text: "Ellipse" },
      ],
      selectedCoefficientTypes: new Set([
        CoefficientTypes.CONSTANT,
        CoefficientTypes.CIRCLE,
        CoefficientTypes.LINE,
        CoefficientTypes.ELLIPSE,
      ]),
      coefficientsCount: { min: 2, max: 5 },
      complexModulus: { min: 0.1, max: 10 },
      circleCentreModulus: { min: 0.1, max: 10 },
      radius: { min: 0.1, max: 10 },
      circleDuration: { min: 5, max: 30 },
      startEndModulus: { min: 0.1, max: 10 },
      lineDuration: { min: 5, max: 30 },
      ellipseCentreModulus: { min: 0.1, max: 10 },
      halfWidth: { min: 0.1, max: 10 },
      halfHeight: { min: 0.1, max: 10 },
      rotationAngle: { min: 0, max: 360 },
      ellipseDuration: { min: 5, max: 30 },
      juliaHue: { min: 0, max: 0 },
      juliaSaturation: { min: 0, max: 0 },
      juliaValue: { min: 1, max: 1 },
      attractorsHue: { min: 0, max: 360 },
      attractorsSaturationStrength: { min: 0.01, max: 0.2 },
      attractorsSaturationOffset: { min: 0, max: 1 },
      attractorsValueStrength: { min: 0.1, max: 0.5 },
      attractorsValueOffset: { min: 0, max: 3 },
      viewportScale: { min: 1, max: 3 },
      viewportCentreModulus: { min: 0, max: 0 },
      iterationsCount: { min: 10, max: 40 },
      epsilon: { min: 0.000005, max: 0.000015 },
      juliaBound: { min: -5, max: -3 },
      disclosureSvgPath:
        "M480-357q-6 0-11-2t-10-7L261-564q-8-8-7.5-21.5T262-607q10-10 21.5-8.5T304-606l176 176 176-176q8-8 21.5-9t21.5 9q10 8 8.5 21t-9.5 22L501-366q-5 5-10 7t-11 2Z",
    };
  },
  methods: {
    randomize() {
      this.configuration.randomize(
        this.selectedFunctionTypes,
        this.selectedCoefficientTypes,
        this.coefficientsCount,
        this.complexModulus,
        this.circleCentreModulus,
        this.radius,
        this.circleDuration,
        this.startEndModulus,
        this.lineDuration,
        this.ellipseCentreModulus,
        this.halfWidth,
        this.halfHeight,
        this.rotationAngle,
        this.ellipseDuration,
        this.juliaHue,
        this.juliaSaturation,
        this.juliaValue,
        this.attractorsHue,
        this.attractorsSaturationStrength,
        this.attractorsSaturationOffset,
        this.attractorsValueStrength,
        this.attractorsValueOffset,
        this.viewportScale,
        this.viewportCentreModulus,
        this.iterationsCount,
        this.epsilon,
        this.juliaBound
      );
      this.$emit("change");
    },
  },
});
</script>

<template>
  <div class="panel-container">
    <header>
      <Disclosure :headingCentred="true" :headingLevel="2" headingText="Randomize">
        <p>This panel allows to randomize the parameters of the fractal.</p>
        <p>You can edit the range of values the parameters can take.</p>
        <p>
          Click the randomize button at the bottom to give random values to all parameters of the
          fractal.
        </p>
      </Disclosure>
    </header>

    <div class="panel-content">
      <section>
        <Disclosure class="section-header" :headingLevel="3" headingText="Function">
          <p>
            In this section, you can change the range of values the function parameters can take.
          </p>
          <p>
            For complex numbers, you can choose their min and max modulus. This means that the
            distance between the complex number and zero will be between the min and max you set.
          </p>
        </Disclosure>
        <div class="content one-column">
          <h4>Function types</h4>
          <MultiComboBox
            id="function-types-multi-combobox"
            :options="functionTypeOptions"
            v-model:selected="selectedFunctionTypes"
            label="Function types"
            noOptionsSelectedText="No function type"
            allOptionsSelectedText="All function types"
          />
          <h4>Coefficient types</h4>
          <MultiComboBox
            id="coefficient-types-multi-combobox"
            :options="coefficientTypeOptions"
            v-model:selected="selectedCoefficientTypes"
            label="Coefficient types"
            noOptionsSelectedText="No coefficient type"
            allOptionsSelectedText="All coefficient types"
          />
          <h4>Number of coefficients</h4>
          <MinMaxInput
            :minValue="coefficientsCount.min"
            :maxValue="coefficientsCount.max"
            :min="1"
            :max="32"
            :step="1"
            :isIntegerOnly="true"
            minLabel="Minimum number of coefficients"
            maxLabel="Maximum number of coefficients"
            @update:minValue="(newMin) => (coefficientsCount.min = newMin)"
            @update:maxValue="(newMax) => (coefficientsCount.max = newMax)"
          />
          <Disclosure
            headingText="Constant coefficients"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Complex modulus</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="complexModulus.min"
              :maxValue="complexModulus.max"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum modulus of constant complex coefficients"
              maxLabel="Maximum modulus of constant complex coefficients"
              @update:minValue="(newMin) => (complexModulus.min = newMin)"
              @update:maxValue="(newMax) => (complexModulus.max = newMax)"
              :level="6"
            />
          </Disclosure>
          <Disclosure
            headingText="Circle coefficients"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Centre modulus</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="circleCentreModulus.min"
              :maxValue="circleCentreModulus.max"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum modulus of circle coefficients centres"
              maxLabel="Maximum modulus of circle coefficients centres"
              @update:minValue="(newMin) => (circleCentreModulus.min = newMin)"
              @update:maxValue="(newMax) => (circleCentreModulus.max = newMax)"
              :level="6"
            />
            <h5>Radius</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="radius.min"
              :maxValue="radius.max"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum radius of circle coefficients"
              maxLabel="Maximum radius of circle coefficients"
              @update:minValue="(newMin) => (radius.min = newMin)"
              @update:maxValue="(newMax) => (radius.max = newMax)"
              :level="6"
            />
            <h5>Duration</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="circleDuration.min"
              :maxValue="circleDuration.max"
              :min="1"
              :max="300"
              :step="1"
              :isIntegerOnly="true"
              minLabel="Minimum duration of circle coefficients"
              maxLabel="Maximum duration of circle coefficients"
              @update:minValue="(newMin) => (circleDuration.min = newMin)"
              @update:maxValue="(newMax) => (circleDuration.max = newMax)"
              :level="6"
            />
          </Disclosure>
          <Disclosure
            headingText="Line coefficients"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Start and end modulus</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="startEndModulus.min"
              :maxValue="startEndModulus.max"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum modulus of line coefficients start/end"
              maxLabel="Maximum modulus of line coefficients start/end"
              @update:minValue="(newMin) => (startEndModulus.min = newMin)"
              @update:maxValue="(newMax) => (startEndModulus.max = newMax)"
              :level="6"
            />
            <h5>Duration</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="lineDuration.min"
              :maxValue="lineDuration.max"
              :min="1"
              :max="300"
              :step="1"
              :isIntegerOnly="true"
              minLabel="Minimum duration of line coefficients"
              maxLabel="Maximum duration of line coefficients"
              @update:minValue="(newMin) => (lineDuration.min = newMin)"
              @update:maxValue="(newMax) => (lineDuration.max = newMax)"
              :level="6"
            />
          </Disclosure>
          <Disclosure
            headingText="Ellipse coefficients"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Centre modulus</h5>
            <MinMaxInput
              class="parameter-input"
              :maxValue="ellipseCentreModulus.max"
              :minValue="ellipseCentreModulus.min"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum modulus of ellipse coefficients centres"
              maxLabel="Maximum modulus of ellipse coefficients centres"
              @update:minValue="(newMin) => (ellipseCentreModulus.min = newMin)"
              @update:maxValue="(newMax) => (ellipseCentreModulus.max = newMax)"
              :level="6"
            />
            <h5>Half-width</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="halfWidth.min"
              :maxValue="halfWidth.max"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum half-width of ellipse coefficients"
              maxLabel="Maximum half-width of ellipse coefficients"
              @update:minValue="(newMin) => (halfWidth.min = newMin)"
              @update:maxValue="(newMax) => (halfWidth.max = newMax)"
              :level="6"
            />
            <h5>Half-height</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="halfHeight.min"
              :maxValue="halfHeight.max"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum half-height of ellipse coefficients"
              maxLabel="Maximum half-height of ellipse coefficients"
              @update:minValue="(newMin) => (halfHeight.min = newMin)"
              @update:maxValue="(newMax) => (halfHeight.max = newMax)"
              :level="6"
            />
            <h5>Rotation angle</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="rotationAngle.min"
              :maxValue="rotationAngle.max"
              :min="0"
              :max="360"
              :step="1"
              :isIntegerOnly="false"
              minLabel="Minimum rotation angle of ellipse coefficients"
              maxLabel="Maximum rotation angle of ellipse coefficients"
              @update:minValue="(newMin) => (rotationAngle.min = newMin)"
              @update:maxValue="(newMax) => (rotationAngle.max = newMax)"
              :level="6"
            />
            <h5>Duration</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="ellipseDuration.min"
              :maxValue="ellipseDuration.max"
              :min="1"
              :max="300"
              :step="1"
              :isIntegerOnly="true"
              minLabel="Minimum duration of ellipse coefficients"
              maxLabel="Maximum duration of ellipse coefficients"
              @update:minValue="(newMin) => (ellipseDuration.min = newMin)"
              @update:maxValue="(newMax) => (ellipseDuration.max = newMax)"
              :level="6"
            />
          </Disclosure>
        </div>
      </section>

      <section>
        <Disclosure class="section-header" :headingLevel="3" headingText="Colours">
          <p>
            In this section, you can change the range of values the colours parameters can take.
          </p>
        </Disclosure>
        <div class="content one-column">
          <Disclosure
            headingText="Julia colour"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Hue</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="juliaHue.min"
              :maxValue="juliaHue.max"
              :min="0"
              :max="360"
              :step="1"
              :isIntegerOnly="true"
              minLabel="Minimum hue of Julia colour"
              maxLabel="Maximum hue of Julia colour"
              @update:minValue="(newMin) => (juliaHue.min = newMin)"
              @update:maxValue="(newMax) => (juliaHue.max = newMax)"
              :level="6"
            />
            <h5>Saturation</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="juliaSaturation.min"
              :maxValue="juliaSaturation.max"
              :min="0"
              :max="1"
              :step="0.01"
              :isIntegerOnly="false"
              minLabel="Minimum saturation of Julia colour"
              maxLabel="Maximum saturation of Julia colour"
              @update:minValue="(newMin) => (juliaSaturation.min = newMin)"
              @update:maxValue="(newMax) => (juliaSaturation.max = newMax)"
              :level="6"
            />
            <h5>Value</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="juliaValue.min"
              :maxValue="juliaValue.max"
              :min="0"
              :max="1"
              :step="0.01"
              :isIntegerOnly="false"
              minLabel="Minimum value of Julia colour"
              maxLabel="Maximum value of Julia colour"
              @update:minValue="(newMin) => (juliaValue.min = newMin)"
              @update:maxValue="(newMax) => (juliaValue.max = newMax)"
              :level="6"
            />
          </Disclosure>
          <Disclosure
            headingText="Attractors"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Hue</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="attractorsHue.min"
              :maxValue="attractorsHue.max"
              :min="0"
              :max="360"
              :step="1"
              :isIntegerOnly="true"
              minLabel="Minimum hue of attractors colour"
              maxLabel="Maximum hue of attractors colour"
              @update:minValue="(newMin) => (attractorsHue.min = newMin)"
              @update:maxValue="(newMax) => (attractorsHue.max = newMax)"
              :level="6"
            />
            <h5>Saturation strength</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="attractorsSaturationStrength.min"
              :maxValue="attractorsSaturationStrength.max"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum saturation strength of attractors colour"
              maxLabel="Maximum saturation strength of attractors colour"
              @update:minValue="(newMin) => (attractorsSaturationStrength.min = newMin)"
              @update:maxValue="(newMax) => (attractorsSaturationStrength.max = newMax)"
              :level="6"
            />
            <h5>Saturation offset</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="attractorsSaturationOffset.min"
              :maxValue="attractorsSaturationOffset.max"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum saturation offset of attractors colour"
              maxLabel="Maximum saturation offset of attractors colour"
              @update:minValue="(newMin) => (attractorsSaturationOffset.min = newMin)"
              @update:maxValue="(newMax) => (attractorsSaturationOffset.max = newMax)"
              :level="6"
            />
            <h5>Value strength</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="attractorsValueStrength.min"
              :maxValue="attractorsValueStrength.max"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum value strength of attractors colour"
              maxLabel="Maximum value strength of attractors colour"
              @update:minValue="(newMin) => (attractorsValueStrength.min = newMin)"
              @update:maxValue="(newMax) => (attractorsValueStrength.max = newMax)"
              :level="6"
            />
            <h5>Value offset</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="attractorsValueOffset.min"
              :maxValue="attractorsValueOffset.max"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum value offset of attractors colour"
              maxLabel="Maximum value offset of attractors colour"
              @update:minValue="(newMin) => (attractorsValueOffset.min = newMin)"
              @update:maxValue="(newMax) => (attractorsValueOffset.max = newMax)"
              :level="6"
            />
          </Disclosure>
        </div>
      </section>

      <section>
        <Disclosure class="section-header" :headingLevel="3" headingText="Advanced Settings">
          <p>
            In this section, you can change the range of values the advanced parameters can take.
          </p>
          <p>
            Note that the resolution cannot be randomized. Therefore, the resolution chosen in the
            advanced panel will stay the same.
          </p>
        </Disclosure>
        <div class="content one-column">
          <Disclosure
            headingText="Viewport"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Scale</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="viewportScale.min"
              :maxValue="viewportScale.max"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum scale of viewport"
              maxLabel="Maximum scale of viewport"
              @update:minValue="(newMin) => (viewportScale.min = newMin)"
              @update:maxValue="(newMax) => (viewportScale.max = newMax)"
              :level="6"
            />
            <h5>Centre modulus</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="viewportCentreModulus.min"
              :maxValue="viewportCentreModulus.max"
              :min="0"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum modulus of viewport centre"
              maxLabel="Maximum modulus of viewport centre"
              @update:minValue="(newMin) => (viewportCentreModulus.min = newMin)"
              @update:maxValue="(newMax) => (viewportCentreModulus.max = newMax)"
              :level="6"
            />
          </Disclosure>
          <Disclosure
            headingText="Computation"
            :headingLevel="4"
            :rotateWhenExpand="true"
            buttonTitle="Show"
            :buttonSvgPath="disclosureSvgPath"
          >
            <h5>Number of iterations</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="iterationsCount.min"
              :maxValue="iterationsCount.max"
              :min="0"
              :max="100"
              :step="1"
              :isIntegerOnly="true"
              minLabel="Minimum number of iterations"
              maxLabel="Maximum number of iterations"
              @update:minValue="(newMin) => (iterationsCount.min = newMin)"
              @update:maxValue="(newMax) => (iterationsCount.max = newMax)"
              :level="6"
            />
            <h5>Epsilon</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="epsilon.min"
              :maxValue="epsilon.max"
              :min="0.0000001"
              :max="0.001"
              :step="0.000001"
              :isIntegerOnly="false"
              minLabel="Minimum value of epsilon"
              maxLabel="Maximum value of epsilon"
              @update:minValue="(newMin) => (epsilon.min = newMin)"
              @update:maxValue="(newMax) => (epsilon.max = newMax)"
              :level="6"
            />
            <h5>Julia bound</h5>
            <MinMaxInput
              class="parameter-input"
              :minValue="juliaBound.min"
              :maxValue="juliaBound.max"
              :min="-100"
              :max="100"
              :step="0.1"
              :isIntegerOnly="false"
              minLabel="Minimum value of the Julia bound"
              maxLabel="Maximum value of the Julia bound"
              @update:minValue="(newMin) => (juliaBound.min = newMin)"
              @update:maxValue="(newMax) => (juliaBound.max = newMax)"
              :level="6"
            />
          </Disclosure>
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
