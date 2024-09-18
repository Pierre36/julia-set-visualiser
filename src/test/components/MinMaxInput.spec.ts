import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import MinMaxInput, { type Props } from "@/components/MinMaxInput.vue";
import NumberInput from "@/components/NumberInput.vue";

interface TestProps extends Props {
  minValue: number;
  maxValue: number;
}

let props: TestProps;

const minValue = 36;
const maxValue = 42;
const min = 10;
const max = 60;
const step = 1;
const isIntegerOnly = true;
const minLabel = "Min label";
const maxLabel = "Max label";
const level = 3;

describe("Render", () => {
  beforeEach(() => {
    props = {
      minValue: minValue,
      maxValue: maxValue,
      min: min,
      max: max,
      step: step,
      isIntegerOnly: isIntegerOnly,
      minLabel: minLabel,
      maxLabel: maxLabel,
      level: level,
    };
  });

  it("renders the titles correctly", () => {
    // Mount the MinMaxInput
    const minMaxInput = mount(MinMaxInput, { props: props });

    // Find the titles
    const titles = minMaxInput.findAll("h" + level);

    // Check the titles are correct
    expect(titles[0].text()).toBe("Min:");
    expect(titles[1].text()).toBe("Max:");
  });

  it("renders the min NumberInput correctly", () => {
    // Mount the MinMaxInput
    const minMaxInput = mount(MinMaxInput, { props: props });

    // Find the min NumberInput
    const minNumberInput = minMaxInput.findAllComponents(NumberInput)[0];

    // Check its props are correct
    expect(minNumberInput.vm.$props.value).toBe(minValue);
    expect(minNumberInput.vm.$props.min).toBe(min);
    expect(minNumberInput.vm.$props.max).toBe(maxValue);
    expect(minNumberInput.vm.$props.step).toBe(step);
    expect(minNumberInput.vm.$props.isIntegerOnly).toBe(isIntegerOnly);
    expect(minNumberInput.vm.$props.label).toBe(minLabel);
  });

  it("renders the max NumberInput correctly", () => {
    // Mount the MinMaxInput
    const minMaxInput = mount(MinMaxInput, { props: props });

    // Find the max NumberInput
    const maxNumberInput = minMaxInput.findAllComponents(NumberInput)[1];

    // Check its props are correct
    expect(maxNumberInput.vm.$props.value).toBe(maxValue);
    expect(maxNumberInput.vm.$props.min).toBe(minValue);
    expect(maxNumberInput.vm.$props.max).toBe(max);
    expect(maxNumberInput.vm.$props.step).toBe(step);
    expect(maxNumberInput.vm.$props.isIntegerOnly).toBe(isIntegerOnly);
    expect(maxNumberInput.vm.$props.label).toBe(maxLabel);
  });
});

describe("Interactions", () => {
  beforeEach(() => {
    props = {
      minValue: minValue,
      maxValue: maxValue,
      min: min,
      max: max,
      step: step,
      isIntegerOnly: isIntegerOnly,
      minLabel: minLabel,
      maxLabel: maxLabel,
      level: level,
    };
  });

  it("emits an event when updating the min NumberInput", () => {
    // Mount the MinMaxInput
    const minMaxInput = mount(MinMaxInput, { props: props });

    // Find the min NumberInput and make it emit an event
    const minNumberInput = minMaxInput.findAllComponents(NumberInput)[0];
    const newMinValue = 12;
    minNumberInput.vm.$emit("update:value", newMinValue);

    // Check the right event has been emitted
    expect(minMaxInput.emitted()["update:minValue"]).toEqual([[newMinValue]]);
  });

  it("emits an event when updating the max NumberInput", () => {
    // Mount the MinMaxInput
    const minMaxInput = mount(MinMaxInput, { props: props });

    // Find the min NumberInput and make it emit an event
    const maxNumberInput = minMaxInput.findAllComponents(NumberInput)[1];
    const newMaxValue = 12;
    maxNumberInput.vm.$emit("update:value", newMaxValue);

    // Check the right event has been emitted
    expect(minMaxInput.emitted()["update:maxValue"]).toEqual([[newMaxValue]]);
  });
});
