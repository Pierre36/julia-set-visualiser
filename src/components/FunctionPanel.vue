<script>
import { Polynomial } from "../models/Polynomial";
import InfoButton from "./InfoButton.vue";
import FormSelect from "./FormSelect.vue";
import IconTextButton from "./IconTextButton.vue";
import CoefficientItem from "./CoefficientItem.vue";
import { Complex } from "../models/Complex";

export default {
  name: "FunctionPanel",
  components: { InfoButton, FormSelect, IconTextButton, CoefficientItem },
  props: {
    functionType: { type: String, required: true },
    polynomial: { type: Polynomial, required: true },
  },
  emits: ["update:functionType"],
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
      if (this.functionType == "NEWTON") {
        equation +=
          "<mi>z</mi><mo>-</mo><mi>a</mi><mfrac><mrow><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow><mrow><msup><mi>P</mi><mo lspace='0em' rspace='0em' class='tml-prime'>′</mo></msup><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow></mfrac>";
        equation += "</math>";
        equation += "<math>";
        equation +=
          "<mrow><mtext>with</mtext><mspace width='0.5em'/><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
      }
      equation += this.polynomial.toMathML();

      // End and return equation
      equation += "</math>";
      return equation;
    },
    canAddCoefficient() {
      return this.polynomial.getAvailablePowers().length != 0;
    },
  },
  methods: {
    updateDegree(previousDegree, newDegree) {
      if (previousDegree != newDegree) {
        this.polynomial.setCoefficient(
          newDegree,
          this.polynomial.getCoefficient(previousDegree)
        );
        delete this.polynomial.coefficients[previousDegree];
      }
    },
    addCoefficient() {
      this.polynomial.setCoefficient(
        this.polynomial.getAvailablePowers()[0],
        new Complex(0, 0)
      );
    },
  },
};
</script>

<template>
  <header>
    <h2>Function</h2>
    <InfoButton />
  </header>

  <div class="panelContent">
    <section>
      <div class="equation" v-html="equationMathML"></div>
    </section>

    <section>
      <div class="title">
        <h3>Function type</h3>
        <InfoButton />
      </div>
      <div class="content">
        <span>Type</span>
        <FormSelect
          :options="functionTypeOptions"
          :selected="functionType"
          @update:selected="
            (newValue) => $emit('update:functionType', newValue)
          "
        />
      </div>
    </section>

    <section>
      <div class="title">
        <h3>Coefficients</h3>
        <InfoButton />
      </div>
      <div class="list">
        <CoefficientItem
          id="coefficientItem"
          v-for="degree in Object.keys(polynomial.coefficients)"
          :key="degree"
          :degree="degree"
          :polynomial="polynomial"
          @update:degree="(newDegree) => updateDegree(degree, newDegree)"
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

#coefficientItem {
  margin-bottom: 0.75rem;
}

#addCoefficientButton {
  width: 100%;
}
</style>
