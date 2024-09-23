<script setup lang="ts">
import ComboBox, { type ComboBoxOption } from "@/components/ComboBox.vue";
import CoefficientInput from "@/components/CoefficientInput.vue";
import IconTextButton from "@/components/IconTextButton.vue";
import CoefficientItem from "@/components/CoefficientItem.vue";
import ExpandableDisclosure from "@/components/ExpandableDisclosure.vue";
import Complex from "@/models/Complex";
import FractalFunction from "@/models/FractalFunction";
import FunctionTypes from "@/constants/FunctionTypes";
import { computed, ref, type Ref } from "vue";

const fractalFunction = defineModel<FractalFunction>("fractalFunction", { required: true });

const functionTypeOptions: Ref<ComboBoxOption<FunctionTypes>[]> = ref([
  { id: FunctionTypes.DEFAULT, text: "Default" },
  { id: FunctionTypes.NEWTON, text: "Newton" },
  { id: FunctionTypes.FRACTION, text: "Fraction" },
]);

const numeratorCoefficients = computed(() => fractalFunction.value.getNumeratorCoefficients());
const denominatorCoefficients = computed(() => fractalFunction.value.getDenominatorCoefficients());

const numeratorAvailablePowers = computed(() =>
  fractalFunction.value.getNumeratorAvailablePowers()
);
const denominatorAvailablePowers = computed(() =>
  fractalFunction.value.getDenominatorAvailablePowers()
);

const canAddCoefficientToNumerator = computed(() => numeratorAvailablePowers.value.length != 0);
const canAddCoefficientToDenominator = computed(() => denominatorAvailablePowers.value.length != 0);

const numeratorHeading = computed(() =>
  fractalFunction.value.getFunctionType() == FunctionTypes.FRACTION
    ? "Numerator coefficients"
    : "Coefficients"
);

function updateDegree(previousDegree: number, newDegree: number, inNumerator: boolean) {
  const coefficient = fractalFunction.value.getCoefficient(previousDegree, inNumerator);
  if (previousDegree != newDegree && coefficient !== undefined) {
    fractalFunction.value.setCoefficient(newDegree, coefficient.copy(), inNumerator);
    fractalFunction.value.removeCoefficient(previousDegree, inNumerator);
  }
}

function addCoefficient(power: number, inNumerator: boolean) {
  fractalFunction.value.setCoefficient(power, new Complex(0, 0), inNumerator);
}
</script>

<template>
  <div class="panel-container">
    <header>
      <ExpandableDisclosure :headingCentred="true" :headingLevel="2" headingText="Function">
        <p>This panel allows to choose the function used to draw the Julia and Fatou sets.</p>
        <p>
          By adding, editing and removing coefficients, you can edit a polynomial or fractional
          function (see Coefficients section for more details).
        </p>
        <p>
          By changing the function type, you can change the type of the final function (see Function
          type section info for more details).
        </p>
      </ExpandableDisclosure>
    </header>

    <div class="panel-content">
      <section>
        <div class="equation" v-html="fractalFunction.toMathML()"></div>
      </section>

      <section>
        <ExpandableDisclosure class="section-header" :headingLevel="3" headingText="Function type">
          <p>In this section, you can change the function type. There is 3 function types:</p>
          <ul class="info-list">
            <li>
              <span class="info-list-item-title">Default</span>: The polynomial function is directly
              used as the final function.
            </li>
            <li>
              <span class="info-list-item-title">Newton</span>: The final function is the
              generalized Newton's iteration and the coefficient can be edited (see
              <a
                href="https://en.wikipedia.org/wiki/Newton_fractal#Generalization_of_Newton_fractals"
              >
                Wikipedia page
              </a>
              for more details).
            </li>
            <li>
              <span class="info-list-item-title">Fraction</span>: The function is a fraction of two
              polynomials.
            </li>
          </ul>
        </ExpandableDisclosure>
        <div class="content">
          <h4>Type</h4>
          <ComboBox
            id="function-type-combobox"
            label="Function type"
            :options="functionTypeOptions"
            :selected="fractalFunction.getFunctionType()"
            @update:selected="(newType) => fractalFunction.setFunctionType(newType)"
          />
          <template v-if="fractalFunction.getFunctionType() == 'NEWTON'">
            <h4 class="column-span-2">Newton coefficient</h4>
            <CoefficientInput
              class="column-span-2"
              v-model:coefficient="fractalFunction.newtonCoefficient"
              :level="5"
            />
          </template>
        </div>
      </section>

      <section>
        <ExpandableDisclosure
          class="section-header"
          :headingLevel="3"
          :headingText="numeratorHeading"
        >
          <p>In this section, you can:</p>
          <ul class="info-list">
            <li>
              <span class="info-list-item-title">Add</span> a coefficient by clicking on the "New
              Coefficient" button.
            </li>
            <li>
              <span class="info-list-item-title">Edit</span> a coefficient by picking and typing
              values in the fields of the coefficient frame.
            </li>
            <li>
              <span class="info-list-item-title">Remove</span> a coefficient by clicking on the top
              right button of the coefficient frame.
            </li>
          </ul>
          <p>In the coefficient frame, you can:</p>
          <ul class="info-list">
            <li><span class="info-list-item-title">Choose</span> the degree of the coefficient.</li>
            <li><span class="info-list-item-title">Choose</span> the type of coefficient.</li>
          </ul>
          <p>A coefficient can be of three types:</p>
          <ul class="info-list">
            <li>
              <span class="info-list-item-title">Constant</span>: the coefficient is the constant
              complex number you choose.
            </li>
            <li>
              <span class="info-list-item-title">Circle</span>: the coefficient is a point on a
              circle which you can edit by choosing its centre and radius as well as the duration of
              one turn.
            </li>
            <li>
              <span class="info-list-item-title">Ellipse</span>: the coefficient is a point on an
              ellipse which you can edit by choosing its centre, half-width, half-height and angle
              of rotation as well as the duration of one turn.
            </li>
            <li>
              <span class="info-list-item-title">Line</span>: the coefficient goes back and forth on
              a line. You can edit this line by choosing its starting and ending points as well as
              the duration of the round trip.
            </li>
          </ul>
        </ExpandableDisclosure>
        <div>
          <CoefficientItem
            class="coefficient-item"
            v-for="coef in numeratorCoefficients"
            :key="coef.power"
            :degree="coef.power"
            :coefficient="coef.coefficient"
            :availablePowers="numeratorAvailablePowers"
            @update:degree="(newDegree) => updateDegree(coef.power, newDegree, true)"
            @update:coefficient="
              (newCoef) => fractalFunction.setCoefficient(coef.power, newCoef, true)
            "
            @delete:coefficient="fractalFunction.removeCoefficient(coef.power, true)"
          />
          <IconTextButton
            v-if="canAddCoefficientToNumerator"
            id="addCoefficientToNumeratorButton"
            svgPath="M453-446v136q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625 12.825 0 21.325-8.625T513-310v-136h137q12.75 0 21.375-8.675 8.625-8.676 8.625-21.5 0-12.825-8.625-21.325T650-506H513v-144q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T453-650v144H310q-12.75 0-21.375 8.675-8.625 8.676-8.625 21.5 0 12.825 8.625 21.325T310-446h143Zm27.266 366q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"
            text="New Coefficient"
            @click="addCoefficient(numeratorAvailablePowers[0], true)"
          />
        </div>
      </section>

      <section v-if="fractalFunction.getFunctionType() == 'FRACTION'">
        <ExpandableDisclosure
          class="section-header"
          :headingLevel="3"
          headingText="Denominator coefficients"
        >
          <p>In this section, you can:</p>
          <ul class="info-list">
            <li>
              <span class="info-list-item-title">Add</span> a coefficient by clicking on the "New
              Coefficient" button.
            </li>
            <li>
              <span class="info-list-item-title">Edit</span> a coefficient by picking and typing
              values in the fields of the coefficient frame.
            </li>
            <li>
              <span class="info-list-item-title">Remove</span> a coefficient by clicking on the top
              right button of the coefficient frame.
            </li>
          </ul>
          <p>In the coefficient frame, you can:</p>
          <ul class="info-list">
            <li><span class="info-list-item-title">Choose</span> the degree of the coefficient.</li>
            <li><span class="info-list-item-title">Choose</span> the type of coefficient.</li>
          </ul>
          <p>A coefficient can be of three types:</p>
          <ul class="info-list">
            <li>
              <span class="info-list-item-title">Constant</span>: the coefficient is the constant
              complex number you choose.
            </li>
            <li>
              <span class="info-list-item-title">Circle</span>: the coefficient is a point on a
              circle which you can edit by choosing its centre and radius as well as the duration of
              one turn.
            </li>
            <li>
              <span class="info-list-item-title">Ellipse</span>: the coefficient is a point on an
              ellipse which you can edit by choosing its centre, half-width, half-height and angle
              of rotation as well as the duration of one turn.
            </li>
            <li>
              <span class="info-list-item-title">Line</span>: the coefficient goes back and forth on
              a line. You can edit this line by choosing its starting and ending points as well as
              the duration of the round trip.
            </li>
          </ul>
        </ExpandableDisclosure>
        <div>
          <CoefficientItem
            class="coefficient-item"
            v-for="coef in denominatorCoefficients"
            :key="coef.power"
            :degree="coef.power"
            :coefficient="coef.coefficient"
            :availablePowers="denominatorAvailablePowers"
            @update:degree="(newDegree) => updateDegree(coef.power, newDegree, false)"
            @update:coefficient="
              (newCoef) => fractalFunction.setCoefficient(coef.power, newCoef, false)
            "
            @delete:coefficient="fractalFunction.removeCoefficient(coef.power, false)"
          />
          <IconTextButton
            v-if="canAddCoefficientToDenominator"
            id="addCoefficientToDenominatorButton"
            svgPath="M453-446v136q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625 12.825 0 21.325-8.625T513-310v-136h137q12.75 0 21.375-8.675 8.625-8.676 8.625-21.5 0-12.825-8.625-21.325T650-506H513v-144q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T453-650v144H310q-12.75 0-21.375 8.675-8.625 8.676-8.625 21.5 0 12.825 8.625 21.325T310-446h143Zm27.266 366q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"
            text="New Coefficient"
            @click="addCoefficient(denominatorAvailablePowers[0], false)"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.equation {
  color: var(--gray-700);
  background-color: var(--gray-100);
  padding: 1rem;
  margin-block: 0.25rem;
  border-radius: 0.25rem;
  text-align: center;
}

.column-span-2 {
  grid-column: span 2;
}

.coefficient-item {
  margin-bottom: 0.75rem;
}

#addCoefficientToNumeratorButton,
#addCoefficientToDenominatorButton {
  width: 100%;
}
</style>
