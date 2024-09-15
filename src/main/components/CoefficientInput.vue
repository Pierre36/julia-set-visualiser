<script lang="ts">
import { defineComponent } from "vue";
import CoefficientTypes from "@/constants/CoefficientTypes";
import Complex from "@/models/Complex";
import ComplexCircle from "@/models/ComplexCircle";
import ComplexLine from "@/models/ComplexLine";
import ComplexEllipse from "@/models/ComplexEllipse";
import ComboBox from "@/components/ComboBox.vue";
import ComplexInput from "@/components/ComplexInput.vue";
import NumberInput from "@/components/NumberInput.vue";

export default defineComponent({
  name: "CoefficientInput",
  components: { ComboBox, ComplexInput, NumberInput },
  props: {
    coefficient: {
      type: [Complex, ComplexCircle, ComplexLine, ComplexEllipse],
      default: new Complex(0, 0),
    },
    level: { type: Number, default: 4 },
  },
  emits: ["update:coefficient"],
  data() {
    return {
      typeOptions: [
        { id: CoefficientTypes.CONSTANT, text: "Constant" },
        { id: CoefficientTypes.CIRCLE, text: "Circle" },
        { id: CoefficientTypes.LINE, text: "Line" },
        { id: CoefficientTypes.ELLIPSE, text: "Ellipse" },
      ],
      defaultValues: {
        CONSTANT: new Complex(0, 0),
        CIRCLE: new ComplexCircle(new Complex(0, 0), 1, 5000),
        LINE: new ComplexLine(new Complex(-1, 0), new Complex(1, 0), 5000),
        ELLIPSE: new ComplexEllipse(new Complex(0, 0), 1, 1, 0, 5000),
      },
    };
  },
  computed: {
    type() {
      if (this.coefficient instanceof ComplexCircle) {
        return CoefficientTypes.CIRCLE;
      } else if (this.coefficient instanceof ComplexLine) {
        return CoefficientTypes.LINE;
      } else if (this.coefficient instanceof ComplexEllipse) {
        return CoefficientTypes.ELLIPSE;
      } else {
        return CoefficientTypes.CONSTANT;
      }
    },
    isCircle() {
      return this.type == CoefficientTypes.CIRCLE;
    },
    isLine() {
      return this.type == CoefficientTypes.LINE;
    },
    isEllipse() {
      return this.type == CoefficientTypes.ELLIPSE;
    },
    isConstant() {
      return this.type == CoefficientTypes.CONSTANT;
    },
    durationSecond() {
      if (this.coefficient instanceof Complex) {
        return 0;
      }
      return this.coefficient.duration / 1000;
    },
    heading() {
      return `h${this.level}`;
    },
  },
  methods: {
    changeType(newType: CoefficientTypes) {
      this.$emit("update:coefficient", this.defaultValues[newType].copy());
    },
    update(property: string, newValue: any) {
      const newCoefficient = this.coefficient.copy();
      // FIXME when switching to Composition API
      (newCoefficient as any)[property] = newValue;
      this.$emit("update:coefficient", newCoefficient);
    },
  },
});
</script>

<template>
  <div class="container">
    <component :is="heading">Type</component>
    <ComboBox
      id="coefficient-type-combobox"
      :options="typeOptions"
      label="Coefficient type"
      :selected="type"
      @update:selected="changeType"
    />
    <template v-if="isConstant">
      <component :is="heading">Value</component>
      <ComplexInput
        :complex="coefficient as Complex"
        label="Coefficient value"
        @update:complex="(newCoefficient) => $emit('update:coefficient', newCoefficient)"
      />
    </template>
    <template v-else-if="isCircle">
      <component :is="heading">Center</component>
      <ComplexInput
        :complex="(coefficient as ComplexCircle).center"
        label="Circle center"
        @update:complex="(newCenter) => update('center', newCenter)"
      />
      <component :is="heading">Radius</component>
      <NumberInput
        :value="(coefficient as ComplexCircle).radius"
        :min="0"
        :step="0.1"
        label="Circle radius"
        @update:value="(newRadius) => update('radius', newRadius)"
      />
      <component :is="heading">Duration</component>
      <NumberInput
        :value="durationSecond"
        :min="0"
        :step="1"
        @update:value="(newDuration) => update('duration', newDuration * 1000)"
        label="Duration"
      />
    </template>
    <template v-else-if="isLine">
      <component :is="heading">Start</component>
      <ComplexInput
        :complex="(coefficient as ComplexLine).start"
        label="Line start"
        @update:complex="(newStart) => update('start', newStart)"
      />
      <component :is="heading">End</component>
      <ComplexInput
        :complex="(coefficient as ComplexLine).end"
        label="Line end"
        @update:complex="(newEnd) => update('end', newEnd)"
      />
      <component :is="heading">Duration</component>
      <NumberInput
        :value="durationSecond"
        :min="0"
        :step="1"
        @update:value="(newDuration) => update('duration', newDuration * 1000)"
        label="Duration"
      />
    </template>
    <template v-else-if="isEllipse">
      <component :is="heading">Center</component>
      <ComplexInput
        :complex="(coefficient as ComplexEllipse).center"
        label="Ellipse center"
        @update:complex="(newCenter) => update('center', newCenter)"
      />
      <component :is="heading">Half-width</component>
      <NumberInput
        :value="(coefficient as ComplexEllipse).halfWidth"
        :min="0"
        :step="0.1"
        label="Ellipse half-width"
        @update:value="(newHalfWidth) => update('halfWidth', newHalfWidth)"
      />
      <component :is="heading">Half-height</component>
      <NumberInput
        :value="(coefficient as ComplexEllipse).halfHeight"
        :min="0"
        :step="0.1"
        label="Ellipse half-height"
        @update:value="(newHalfHeight) => update('halfHeight', newHalfHeight)"
      />
      <component :is="heading">Rotation angle</component>
      <NumberInput
        :value="(coefficient as ComplexEllipse).rotationAngle"
        :min="0"
        :step="1"
        label="Ellipse rotation angle"
        @update:value="(newRotationAngle) => update('rotationAngle', newRotationAngle)"
      />
      <component :is="heading">Duration</component>
      <NumberInput
        :value="durationSecond"
        :min="0"
        :step="1"
        @update:value="(newDuration) => update('duration', newDuration * 1000)"
        label="Duration"
      />
    </template>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: auto 12rem;
  align-items: center;
  gap: 0.25rem;
}

h5 {
  padding-left: 0.25rem;
}
</style>
