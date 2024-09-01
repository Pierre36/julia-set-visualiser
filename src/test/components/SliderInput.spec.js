import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import SliderInput from "@/components/SliderInput.vue";
import NumberInput from "@/components/NumberInput.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      value: 36,
      min: 0,
      max: 100,
      step: 1,
      integerOnly: true,
      label: "label",
      level: 5,
    };
  });

  it("renders the NumberInput correctly", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const numberInput = sliderInput.findComponent(NumberInput);

    // Check the NumberInput renders correctly
    expect(numberInput.vm.$props.value).toBe(props.value);
    expect(numberInput.vm.$props.min).toBe(props.min);
    expect(numberInput.vm.$props.max).toBe(props.max);
    expect(numberInput.vm.$props.step).toBe(props.step);
    expect(numberInput.vm.$props.integerOnly).toBe(props.integerOnly);
    expect(numberInput.vm.$props.label).toBe(props.label);
  });

  it("renders the label correctly", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the slider
    const label = sliderInput.find("h" + props.level);

    // Check the label text is correct
    expect(label.text()).toBe(props.label);
  });

  it("renders the slider correctly", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the slider
    const slider = sliderInput.find("input[type='range']");

    // Check the NumberInput renders correctly
    expect(slider.element.value).toBe(props.value.toString());
    expect(slider.attributes().min).toBe(props.min.toString());
    expect(slider.attributes().max).toBe(props.max.toString());
    expect(slider.attributes().step).toBe(props.step.toString());
    expect(slider.attributes().role).toBe("slider");
    expect(slider.attributes()["aria-valuenow"]).toBe(props.value.toString());
    expect(slider.attributes()["aria-valuemin"]).toBe(props.min.toString());
    expect(slider.attributes()["aria-valuemax"]).toBe(props.max.toString());
    expect(slider.attributes()["aria-label"]).toBe(props.label);
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    props = {
      value: 36,
      min: 0,
      max: 100,
      step: 1,
      integerOnly: true,
      label: "label",
      level: 5,
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
    slider.element.value = newValue;
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
    expect(sliderInput.emitted()["update:value"]).toEqual([[props.value - props.step]]);
  });

  it("decrements when pressing 'left' key on slider", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const slider = sliderInput.find("input[type='range']");

    // Press 'left' and check the SliderInput emits the right event
    slider.trigger("keydown.left");
    expect(sliderInput.emitted()["update:value"]).toEqual([[props.value - props.step]]);
  });

  it("increments when pressing 'up' key on slider", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const slider = sliderInput.find("input[type='range']");

    //  Press 'up' and check the SliderInput emits the right event
    slider.trigger("keydown.up");
    expect(sliderInput.emitted()["update:value"]).toEqual([[props.value + props.step]]);
  });

  it("increments when pressing 'right' key on slider", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const slider = sliderInput.find("input[type='range']");

    //  Press 'right' and check the SliderInput emits the right event
    slider.trigger("keydown.right");
    expect(sliderInput.emitted()["update:value"]).toEqual([[props.value + props.step]]);
  });

  it("goes to min when pressing 'home' key on slider", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const slider = sliderInput.find("input[type='range']");

    //  Press 'home' and check the SliderInput emits the right event
    slider.trigger("keydown.home");
    expect(sliderInput.emitted()["update:value"]).toEqual([[props.min]]);
  });

  it("goes to max when pressing 'end' key on slider", () => {
    // Mount the SliderInput
    const sliderInput = mount(SliderInput, { props: props, shallow: true });

    // Get the NumberInput
    const slider = sliderInput.find("input[type='range']");

    //  Press 'end' and check the SliderInput emits the right event
    slider.trigger("keydown.end");
    expect(sliderInput.emitted()["update:value"]).toEqual([[props.max]]);
  });
});
