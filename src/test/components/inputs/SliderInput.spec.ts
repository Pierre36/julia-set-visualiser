import { describe, it, expect, beforeEach } from "vitest";
import { DOMWrapper, mount } from "@vue/test-utils";
import SliderInput, { type Props } from "@/components/inputs/SliderInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";

interface TestProps extends Props {
  value: number;
}

let props: TestProps;

const value = 36;
const min = 0;
const max = 100;
const step = 1;
const isIntegerOnly = true;
const label = "label";
const level = 5;

describe("Render", () => {
  beforeEach(() => {
    props = {
      value: value,
      min: min,
      max: max,
      step: step,
      isIntegerOnly: isIntegerOnly,
      label: label,
      level: level,
    };
  });

  it("renders the NumberInput correctly", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const numberInput = sliderInput.findComponent(NumberInput);

    // Check the NumberInput renders correctly
    expect(numberInput.vm.$props.value).toBe(value);
    expect(numberInput.vm.$props.min).toBe(min);
    expect(numberInput.vm.$props.max).toBe(max);
    expect(numberInput.vm.$props.step).toBe(step);
    expect(numberInput.vm.$props.isIntegerOnly).toBe(isIntegerOnly);
    expect(numberInput.vm.$props.label).toBe(label);
  });

  it("renders the label correctly", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the slider
    const sliderLabel = sliderInput.find("h" + level);

    // Check the label text is correct
    expect(sliderLabel.text()).toBe(label);
  });

  it("renders the slider correctly", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the slider
    const slider = sliderInput.find("input[type='range']");

    // Check the NumberInput renders correctly
    expect((slider.element as HTMLInputElement).value).toBe(value.toString());
    expect(slider.attributes().min).toBe(min.toString());
    expect(slider.attributes().max).toBe(max.toString());
    expect(slider.attributes().step).toBe(step.toString());
    expect(slider.attributes().role).toBe("slider");
    expect(slider.attributes()["aria-valuenow"]).toBe(value.toString());
    expect(slider.attributes()["aria-valuemin"]).toBe(min.toString());
    expect(slider.attributes()["aria-valuemax"]).toBe(max.toString());
    expect(slider.attributes()["aria-label"]).toBe(label);
  });
});

describe("Interactions", () => {
  beforeEach(() => {
    props = {
      value: value,
      min: min,
      max: max,
      step: step,
      isIntegerOnly: isIntegerOnly,
      label: label,
      level: level,
    };
  });

  it("emits an event when changing the value of the NumberInput", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const numberInput = sliderInput.findComponent(NumberInput);

    // Make NumberInput event and check the SliderInput emits the right event
    const newValue = 42;
    numberInput.vm.$emit("update:value", newValue);
    expect(sliderInput.emitted()["update:value"]).toEqual([[newValue]]);
  });

  it("emits an event when changing the value of the slider", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const slider: DOMWrapper<HTMLInputElement> = sliderInput.find("input[type='range']");

    // Change value of slider and check an event is emitted
    const newValue = 42;
    slider.element.value = newValue.toString();
    slider.trigger("input");
    expect(sliderInput.emitted()["update:value"]).toEqual([[newValue]]);
  });

  const testCases = [
    { action: "decrements", key: "down", expectedValue: value - step },
    { action: "decrements", key: "left", expectedValue: value - step },
    { action: "increments", key: "up", expectedValue: value + step },
    { action: "increments", key: "right", expectedValue: value + step },
    { action: "goes to min", key: "home", expectedValue: min },
    { action: "goes to max", key: "end", expectedValue: max },
  ];

  testCases.forEach(({ action, key, expectedValue }) => {
    it(`${action} when pressing '${key}' key on slider`, () => {
      const sliderInput = mount(SliderInput, { props: props, shallow: true });

      const slider = sliderInput.find("input[type='range']");

      slider.trigger(`keydown.${key}`);
      expect(sliderInput.emitted()["update:value"]).toEqual([[expectedValue]]);
    });
  });
});
