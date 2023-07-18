<script>
import ComboBox from "./ComboBox.vue";
import CoefficientInput from "./CoefficientInput.vue";
import IconTextButton from "./IconTextButton.vue";
import CoefficientItem from "./CoefficientItem.vue";
import InfoHeader from "./InfoHeader.vue";
import { Complex } from "../models/Complex";
import { FractalFunction } from "../models/FractalFunction";

export default {
  name: "FunctionPanel",
  components: {
    ComboBox,
    IconTextButton,
    CoefficientItem,
    CoefficientInput,
    InfoHeader,
  },
  props: {
    fractalFunction: { type: FractalFunction, required: true },
  },
  emits: ["change"],
  data() {
    return {
      functionTypeOptions: [
        { id: "DEFAULT", text: "Default" },
        { id: "NEWTON", text: "Newton" },
      ],
    };
  },
  computed: {
    equationMathML() {
      // Initialize equation
      var equation = "<math display='block'>";

      // Add quantifier
      equation +=
        "<mrow><mn>∀</mn><mo>z</mo><mo>∈</mo><mi>ℂ</mi><mo separator='true'>,</mo><mspace width='1em'/></mrow>";

      // Add function
      equation +=
        "<mrow><mi>f</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
      if (this.fractalFunction.functionType == "NEWTON") {
        equation +=
          "<mi>z</mi><mo>-</mo><mi>a</mi><mfrac><mrow><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow><mrow><msup><mi>P</mi><mo lspace='0em' rspace='0em' class='tml-prime'>′</mo></msup><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow></mfrac>";
        equation += "</math>";
        equation += "<math>";
        equation +=
          "<mrow><mtext>with</mtext><mspace width='0.5em'/><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
      }
      equation += this.fractalFunction.numerator.toMathML();

      // End and return equation
      equation += "</math>";
      return equation;
    },
    coefficientsList() {
      let coefficientsList = [];
      this.fractalFunction.numerator.getCoefficientPowers().forEach((degree) => {
        coefficientsList.push({
          degree: degree,
          coefficient: this.fractalFunction.numerator.getCoefficient(degree),
        });
      });
      return coefficientsList;
    },
    availablePowers() {
      return this.fractalFunction.numerator.getAvailablePowers();
    },
    canAddCoefficient() {
      return this.availablePowers.length != 0;
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
    updateDegree(previousDegree, newDegree) {
      if (previousDegree != newDegree) {
        this.fractalFunction.setCoefficient(
          newDegree,
          true,
          this.fractalFunction.getCoefficient(previousDegree, true).copy()
        );
        this.fractalFunction.removeCoefficient(previousDegree, true);
        this.$emit("change");
      }
    },
    updateCoefficient(power, newCoefficient) {
      this.fractalFunction.setCoefficient(power, true, newCoefficient);
      this.$emit("change");
    },
    deleteCoefficient(power) {
      this.fractalFunction.removeCoefficient(power, true);
      this.$emit("change");
    },
    addCoefficient() {
      this.fractalFunction.setCoefficient(this.availablePowers[0], true, new Complex(0, 0));
      this.$emit("change");
    },
  },
};
</script>

<template>
  <header>
    <InfoHeader :centerTitle="true">
      <template #title>
        <h2>Function</h2>
      </template>
      <template #info>
        <p>This panel allows to choose the function used to draw the Julia and Fatou sets.</p>
        <p>
          By adding, editing and removing coefficients, you can edit a polynomial function (see
          Coefficients section for more details).
        </p>
        <p>
          By changing the function type, you can change how this polynomial is used in the final
          function (see Function type section info for more details).
        </p>
      </template>
    </InfoHeader>
  </header>

  <div class="panelContent">
    <section>
      <div class="equation" v-html="equationMathML"></div>
    </section>

    <section>
      <InfoHeader class="sectionHeader">
        <template #title>
          <h3>Function type</h3>
        </template>
        <template #info>
          <p>In this section, you can change the function type. There is two function types:</p>
          <ul class="infoList">
            <li>
              <span class="infoListItemTitle">Default</span>: The polynomial function is directly
              used as the final function.
            </li>
            <li>
              <span class="infoListItemTitle">Newton</span>: The final function is the generalized
              Newton's iteration and the coefficient can be edited (see
              <a
                href="https://en.wikipedia.org/wiki/Newton_fractal#Generalization_of_Newton_fractals"
              >
                Wikipedia page
              </a>
              for more details).
            </li>
          </ul>
        </template>
      </InfoHeader>
      <div class="content">
        <h4>Type</h4>
        <ComboBox
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
      <InfoHeader class="sectionHeader">
        <template #title>
          <h3>Coefficients</h3>
        </template>
        <template #info>
          <p>In this section, you can:</p>
          <ul class="infoList">
            <li>
              <span class="infoListItemTitle">Add</span> a coefficient by clicking on the "New
              Coefficient" button.
            </li>
            <li>
              <span class="infoListItemTitle">Edit</span> a coefficient by picking and typing values
              in the fields of the coefficient frame.
            </li>
            <li>
              <span class="infoListItemTitle">Remove</span> a coefficient by clicking on the top
              right button of the coefficient frame.
            </li>
          </ul>
          <p>In the coefficient frame, you can:</p>
          <ul class="infoList">
            <li><span class="infoListItemTitle">Choose</span> the degree of the coefficient.</li>
            <li><span class="infoListItemTitle">Choose</span> the type of coefficient.</li>
          </ul>
          <p>A coefficient can be of three types:</p>
          <ul class="infoList">
            <li>
              <span class="infoListItemTitle">Constant</span>: the coefficient is the constant
              complex number you choose.
            </li>
            <li>
              <span class="infoListItemTitle">Circle</span>: the coefficient is a point on a circle
              which you can edit by choosing its center and radius as well as the duration of one
              turn.
            </li>
            <li>
              <span class="infoListItemTitle">Line</span>: the coefficient goes back and forth on a
              line. You can edit this line by choosing its starting and ending points as well as the
              duration of the round trip.
            </li>
          </ul>
        </template>
      </InfoHeader>
      <div>
        <CoefficientItem
          class="coefficientItem"
          v-for="coef in coefficientsList"
          :key="coef.degree"
          :degree="coef.degree"
          :coefficient="coef.coefficient"
          :availablePowers="availablePowers"
          @update:degree="(newDegree) => updateDegree(coef.degree, newDegree)"
          @update:coefficient="(newCoefficient) => updateCoefficient(coef.degree, newCoefficient)"
          @delete:coefficient="deleteCoefficient(coef.degree)"
        />
        <IconTextButton
          v-if="canAddCoefficient"
          id="addCoefficientButton"
          svgPath="M453-446v136q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625 12.825 0 21.325-8.625T513-310v-136h137q12.75 0 21.375-8.675 8.625-8.676 8.625-21.5 0-12.825-8.625-21.325T650-506H513v-144q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T453-650v144H310q-12.75 0-21.375 8.675-8.625 8.676-8.625 21.5 0 12.825 8.625 21.325T310-446h143Zm27.266 366q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"
          text="New Coefficient"
          @click="addCoefficient"
        />
      </div>
    </section>
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

.coefficientItem {
  margin-bottom: 0.75rem;
}

#addCoefficientButton {
  width: 100%;
}
</style>
