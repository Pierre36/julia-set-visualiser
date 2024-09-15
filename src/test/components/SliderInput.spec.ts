import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import SliderInput, { type Props } from "@/components/SliderInput.vue";
import NumberInput from "@/components/NumberInput.vue";

let props: Props;

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
    const slider = sliderInput.find("input[type='range']");

    // Change value of slider and check an event is emitted
    const newValue = 42;
    (slider.element as HTMLInputElement).value = newValue.toString();
    slider.trigger("input");
    expect(sliderInput.emitted()["update:value"]).toEqual([[newValue]]);
  });

  it("decrements when pressing 'down' key on slider", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const slider = sliderInput.find("input[type='range']");

    // Press 'down' and check the SliderInput emits the right event
    slider.trigger("keydown.down");
    expect(sliderInput.emitted()["update:value"]).toEqual([[value - step]]);
  });

  it("decrements when pressing 'left' key on slider", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const slider = sliderInput.find("input[type='range']");

    // Press 'left' and check the SliderInput emits the right event
    slider.trigger("keydown.left");
    expect(sliderInput.emitted()["update:value"]).toEqual([[value - step]]);
  });

  it("increments when pressing 'up' key on slider", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const slider = sliderInput.find("input[type='range']");

    //  Press 'up' and check the SliderInput emits the right event
    slider.trigger("keydown.up");
    expect(sliderInput.emitted()["update:value"]).toEqual([[value + step]]);
  });

  it("increments when pressing 'right' key on slider", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const slider = sliderInput.find("input[type='range']");

    //  Press 'right' and check the SliderInput emits the right event
    slider.trigger("keydown.right");
    expect(sliderInput.emitted()["update:value"]).toEqual([[value + step]]);
  });

  it("goes to min when pressing 'home' key on slider", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const slider = sliderInput.find("input[type='range']");

    //  Press 'home' and check the SliderInput emits the right event
    slider.trigger("keydown.home");
    expect(sliderInput.emitted()["update:value"]).toEqual([[min]]);
  });

  it("goes to max when pressing 'end' key on slider", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const slider = sliderInput.find("input[type='range']");

    //  Press 'end' and check the SliderInput emits the right event
    slider.trigger("keydown.end");
    expect(sliderInput.emitted()["update:value"]).toEqual([[max]]);
  });
});
