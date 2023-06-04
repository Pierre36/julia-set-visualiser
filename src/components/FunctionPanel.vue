<script>
import { Polynomial } from "../models/Polynomial";
import FormSelect from "./FormSelect.vue";

export default {
  name: "FunctionPanel",
  components: { FormSelect },
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
    <div class="title">Function</div>
    <div class="info">
      <button id="" class="icon-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          role="img"
        >
          <title>Info</title>
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M483.175-280q12.825 0 21.325-8.625T513-310v-180q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T453-490v180q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625Zm-3.193-314q14.018 0 23.518-9.2T513-626q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447-626q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"
          />
        </svg>
      </button>
    </div>
  </header>
  <section>
    <div class="equation" v-html="equationMathML"></div>
  </section>
</template>

<style scoped>
.equation {
  color: var(--gray-700);
  background-color: var(--gray-100);
  padding: 1rem;
  border-radius: 0.25rem;
  text-align: center;
}
</style>
