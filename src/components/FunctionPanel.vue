<script>
import ComboBox from "./ComboBox.vue";
import CoefficientInput from "./CoefficientInput.vue";
import IconTextButton from "./IconTextButton.vue";
import CoefficientItem from "./CoefficientItem.vue";
import Disclosure from "./Disclosure.vue";
import { Complex } from "../models/Complex";
import { FractalFunction } from "../models/FractalFunction";
import { FunctionTypes } from "../enumerations/FunctionTypes";

export default {
  name: "FunctionPanel",
  components: {
    ComboBox,
    IconTextButton,
    CoefficientItem,
    CoefficientInput,
    Disclosure,
  },
  props: {
    fractalFunction: { type: FractalFunction, required: true },
  },
  emits: ["change"],
  data() {
    return {
      functionTypeOptions: [
        { id: FunctionTypes.DEFAULT, text: "Default" },
        { id: FunctionTypes.NEWTON, text: "Newton" },
        { id: FunctionTypes.FRACTION, text: "Fraction" },
      ],
    };
  },
  computed: {
    numeratorCoefficientsList() {
      return this.fractalFunction.numerator.getCoefficientPowers().map((degree) => ({
        degree: degree,
        coefficient: this.fractalFunction.getCoefficient(degree, true),
      }));
    },
    denominatorCoefficientsList() {
      return this.fractalFunction.denominator.getCoefficientPowers().map((degree) => ({
        degree: degree,
        coefficient: this.fractalFunction.getCoefficient(degree, false),
      }));
    },
    numeratorAvailablePowers() {
      return this.fractalFunction.numerator.getAvailablePowers();
    },
    denominatorAvailablePowers() {
      return this.fractalFunction.denominator.getAvailablePowers();
    },
    canAddCoefficientToNumerator() {
      return this.numeratorAvailablePowers.length != 0;
    },
    canAddCoefficientToDenominator() {
      return this.denominatorAvailablePowers.length != 0;
    },
    numeratorHeading() {
      if (this.fractalFunction.functionType == FunctionTypes.FRACTION) {
        return "Numerator coefficients";
      } else {
        return "Coefficients";
      }
    },
  },
  methods: {
    updateFunctionType(newFunctionType) {
      this.fractalFunction.setFunctionType(newFunctionType);
      this.$emit("change");
    },
    updateNewtonCoefficient(newNewtonCoefficient) {
      this.fractalFunction.setNewtonCoefficient(newNewtonCoefficient);
      this.$emit("change");
    },
    updateDegree(previousDegree, newDegree, inNumerator) {
      if (previousDegree != newDegree) {
        this.fractalFunction.setCoefficient(
          newDegree,
          inNumerator,
          this.fractalFunction.getCoefficient(previousDegree, inNumerator).copy()
        );
        this.fractalFunction.removeCoefficient(previousDegree, inNumerator);
        this.$emit("change");
      }
    },
    updateCoefficient(power, newCoefficient, inNumerator) {
      this.fractalFunction.setCoefficient(power, inNumerator, newCoefficient);
      this.$emit("change");
    },
    deleteCoefficient(power, inNumerator) {
      this.fractalFunction.removeCoefficient(power, inNumerator);
      this.$emit("change");
    },
    addCoefficient(power, inNumerator) {
      this.fractalFunction.setCoefficient(power, inNumerator, new Complex(0, 0));
      this.$emit("change");
    },
  },
};
</script>

<template>
  <div class="panel-container">
    <header>
      <Disclosure :headingCentered="true" :headingLevel="2" headingText="Function">
        <p>This panel allows to choose the function used to draw the Julia and Fatou sets.</p>
        <p>
          By adding, editing and removing coefficients, you can edit a polynomial or fractional
          function (see Coefficients section for more details).
        </p>
        <p>
          By changing the function type, you can change the type of the final function (see Function
          type section info for more details).
        </p>
      </Disclosure>
    </header>

    <div class="panel-content">
      <section>
        <div class="equation" v-html="fractalFunction.toMathML()"></div>
      </section>

      <section>
        <Disclosure class="section-header" :headingLevel="3" headingText="Function type">
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
        </Disclosure>
        <div class="content">
          <h4>Type</h4>
          <ComboBox
            id="function-type-combobox"
            label="Function type"
            :options="functionTypeOptions"
            :selected="fractalFunction.functionType"
            @update:selected="updateFunctionType"
          />
          <template v-if="fractalFunction.functionType == 'NEWTON'">
            <h4 class="column-span-2">Newton coefficient</h4>
            <CoefficientInput
              class="column-span-2"
              :coefficient="fractalFunction.newtonCoefficient"
              :level="5"
              @update:coefficient="updateNewtonCoefficient"
            />
          </template>
        </div>
      </section>

      <section>
        <Disclosure class="section-header" :headingLevel="3" :headingText="numeratorHeading">
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
              circle which you can edit by choosing its center and radius as well as the duration of
              one turn.
            </li>
            <li>
              <span class="info-list-item-title">Line</span>: the coefficient goes back and forth on
              a line. You can edit this line by choosing its starting and ending points as well as
              the duration of the round trip.
            </li>
          </ul>
        </Disclosure>
        <div>
          <CoefficientItem
            class="coefficient-item"
            v-for="coef in numeratorCoefficientsList"
            :key="coef.degree"
            :degree="Number(coef.degree)"
            :coefficient="coef.coefficient"
            :availablePowers="numeratorAvailablePowers"
            @update:degree="(newDegree) => updateDegree(coef.degree, newDegree, true)"
            @update:coefficient="(newCoef) => updateCoefficient(coef.degree, newCoef, true)"
            @delete:coefficient="deleteCoefficient(coef.degree, true)"
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

      <section v-if="fractalFunction.functionType == 'FRACTION'">
        <Disclosure class="section-header" :headingLevel="3" headingText="Denominator coefficients">
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
              circle which you can edit by choosing its center and radius as well as the duration of
              one turn.
            </li>
            <li>
              <span class="info-list-item-title">Line</span>: the coefficient goes back and forth on
              a line. You can edit this line by choosing its starting and ending points as well as
              the duration of the round trip.
            </li>
          </ul>
        </Disclosure>
        <div>
          <CoefficientItem
            class="coefficient-item"
            v-for="coef in denominatorCoefficientsList"
            :key="coef.degree"
            :degree="Number(coef.degree)"
            :coefficient="coef.coefficient"
            :availablePowers="denominatorAvailablePowers"
            @update:degree="(newDegree) => updateDegree(coef.degree, newDegree, false)"
            @update:coefficient="(newCoef) => updateCoefficient(coef.degree, newCoef, false)"
            @delete:coefficient="deleteCoefficient(coef.degree, false)"
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
