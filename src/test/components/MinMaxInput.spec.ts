import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import MinMaxInput from "@/components/MinMaxInput.vue";
import NumberInput from "@/components/NumberInput.vue";

describe("Render", () => {
  let props: {
    minValue?: number;
    maxValue?: number;
    min?: number;
    max?: number;
    step?: number;
    integerOnly?: boolean;
    minLabel?: string;
    maxLabel?: string;
    level?: number;
  };

  beforeEach(() => {
    props = {
      minValue: 36,
      maxValue: 42,
      min: 10,
      max: 60,
      step: 1,
      integerOnly: true,
      minLabel: "Min label",
      maxLabel: "Max label",
      level: 3,
    };
  });

  it("renders the titles correctly", () => {
    // Mount the MinMaxInput
    const minMaxInput = mount(MinMaxInput, { props: props });

    // Find the titles
    const titles = minMaxInput.findAll("h" + props.level);

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
    expect(minNumberInput.vm.$props.value).toBe(props.minValue);
    expect(minNumberInput.vm.$props.min).toBe(props.min);
    expect(minNumberInput.vm.$props.max).toBe(props.maxValue);
    expect(minNumberInput.vm.$props.step).toBe(props.step);
    expect(minNumberInput.vm.$props.isIntegerOnly).toBe(props.integerOnly);
    expect(minNumberInput.vm.$props.label).toBe(props.minLabel);
  });

  it("renders the max NumberInput correctly", () => {
    // Mount the MinMaxInput
    const minMaxInput = mount(MinMaxInput, { props: props });

    // Find the max NumberInput
    const maxNumberInput = minMaxInput.findAllComponents(NumberInput)[1];

    // Check its props are correct
    expect(maxNumberInput.vm.$props.value).toBe(props.maxValue);
    expect(maxNumberInput.vm.$props.min).toBe(props.minValue);
    expect(maxNumberInput.vm.$props.max).toBe(props.max);
    expect(maxNumberInput.vm.$props.step).toBe(props.step);
    expect(maxNumberInput.vm.$props.isIntegerOnly).toBe(props.integerOnly);
    expect(maxNumberInput.vm.$props.label).toBe(props.maxLabel);
  });
});

describe("Interactions", () => {
  let props: {
    minValue?: number;
    maxValue?: number;
    min?: number;
    max?: number;
    step?: number;
    integerOnly?: boolean;
    minLabel?: string;
    maxLabel?: string;
    level?: number;
  };

  beforeEach(() => {
    props = {
      minValue: 36,
      maxValue: 42,
      min: 10,
      max: 60,
      step: 1,
      integerOnly: true,
      minLabel: "Min label",
      maxLabel: "Max label",
      level: 3,
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
