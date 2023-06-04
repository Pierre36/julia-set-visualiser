<script>
import { Polynomial } from "../models/Polynomial";
import InfoButton from "./InfoButton.vue";
import FormSelect from "./FormSelect.vue";

export default {
  name: "FunctionPanel",
  components: { InfoButton, FormSelect },
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
  },
};
</script>

<template>
  <header class="panelHeader">
    <h2>Function</h2>
    <InfoButton />
  </header>

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
        @update:selected="(newValue) => $emit('update:functionType', newValue)"
      />
    </div>
  </section>

  <section>
    <div class="title">
      <h3>Coefficients</h3>
      <InfoButton />
    </div>
  </section>
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

section .title {
  display: grid;
  grid-template-columns: auto max-content;
  align-items: center;
  gap: 0.25rem;
  padding-left: 0.25rem;
  margin-bottom: 0.25rem;
}

section .content {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 0.25rem;
  padding-left: 0.25rem;
}
</style>
