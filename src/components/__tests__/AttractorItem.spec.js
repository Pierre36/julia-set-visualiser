import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { Attractor } from "../../models/Attractor";
import { Complex } from "../../models/Complex";

import AttractorItem from "../AttractorItem.vue";
import SliderInput from "../SliderInput.vue";
import NumberInput from "../NumberInput.vue";
import ComplexInput from "../ComplexInput.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      isDefault: false,
      isInfinity: false,
      attractor: new Attractor(new Complex(3, 6), 210, 0.1, 0.2, 0.3, 0.4),
    };
  });

  it("renders the AttractorItem correctly for common elements", () => {
    // Mount the AttractorItem
    const attractorItem = mount(AttractorItem, { props: props, shallow: true });

    // Get the DOM elements
    const sliderInput = attractorItem.findComponent(SliderInput);
    const numberInputs = attractorItem.findAllComponents(NumberInput);
    const headings4 = attractorItem.findAll("h4");
    const headings5 = attractorItem.findAll("h5");

    // Check the sliderInput is rendered correctly
    expect(sliderInput.vm.$props.value).toBe(props.attractor.hue);
    expect(sliderInput.vm.$props.min).toBe(0);
    expect(sliderInput.vm.$props.max).toBe(360);
    expect(sliderInput.vm.$props.step).toBe(1);
    expect(sliderInput.vm.$props.integerOnly).toBe(true);
    expect(sliderInput.vm.$props.label).toBe("Hue");
    expect(sliderInput.vm.$props.level).toBe(4);

    // Check the NumberInputs are rendered correctly
    expect(numberInputs[0].vm.$props.value).toBe(props.attractor.saturationStrength);
    expect(numberInputs[0].vm.$props.min).toBe(0);
    expect(numberInputs[0].vm.$props.max).toBeUndefined();
    expect(numberInputs[0].vm.$props.step).toBe(0.1);
    expect(numberInputs[0].vm.$props.integerOnly).toBe(false);
    expect(numberInputs[0].vm.$props.label).toBe("Saturation strength");
    expect(numberInputs[1].vm.$props.value).toBe(props.attractor.saturationOffset);
    expect(numberInputs[1].vm.$props.min).toBe(0);
    expect(numberInputs[1].vm.$props.max).toBeUndefined();
    expect(numberInputs[1].vm.$props.step).toBe(0.1);
    expect(numberInputs[1].vm.$props.integerOnly).toBe(false);
    expect(numberInputs[1].vm.$props.label).toBe("Saturation offset");
    expect(numberInputs[2].vm.$props.value).toBe(props.attractor.valueStrength);
    expect(numberInputs[2].vm.$props.min).toBe(0);
    expect(numberInputs[2].vm.$props.max).toBeUndefined();
    expect(numberInputs[2].vm.$props.step).toBe(0.1);
    expect(numberInputs[2].vm.$props.integerOnly).toBe(false);
    expect(numberInputs[2].vm.$props.label).toBe("Value strength");
    expect(numberInputs[3].vm.$props.value).toBe(props.attractor.valueOffset);
    expect(numberInputs[3].vm.$props.min).toBe(0);
    expect(numberInputs[3].vm.$props.max).toBeUndefined();
    expect(numberInputs[3].vm.$props.step).toBe(0.1);
    expect(numberInputs[3].vm.$props.integerOnly).toBe(false);
    expect(numberInputs[3].vm.$props.label).toBe("Value offset");

    // Check the headings are rendered correctly
    expect(headings4[1].text()).toBe("Saturation");
    expect(headings5[0].text()).toBe("Strength");
    expect(headings5[1].text()).toBe("Offset");
    expect(headings4[2].text()).toBe("Value");
    expect(headings5[2].text()).toBe("Strength");
    expect(headings5[3].text()).toBe("Offset");
  });

  it("renders the AttractorItem correctly for normal attractor", () => {
    // Mount the AttractorItem
    const attractorItem = mount(AttractorItem, { props: props, shallow: true });

    // Get the DOM elements
    const heading4 = attractorItem.find("h4");
    const complexInput = attractorItem.findComponent(ComplexInput);
    const deleteButton = attractorItem.find("button");

    // Check the heading is rendered correctly
    expect(heading4.text()).toBe("Attractor");

    // Check the complex input is rendered correctly
    expect(complexInput.vm.$props.complex).toEqual(props.attractor.complex);
    expect(complexInput.vm.$props.label).toBe("Attractor");

    // Check the delete button is rendered correctly
    expect(deleteButton.text()).toBe("Remove attractor");
  });

  it("renders the AttractorItem correctly for default attractor", () => {
    // Mount the AttractorItem
    props.isDefault = true;
    const attractorItem = mount(AttractorItem, { props: props, shallow: true });

    // Get the DOM elements
    const heading4 = attractorItem.find("h4");

    // Check the heading is rendered correctly
    expect(heading4.text()).toBe("Default (no attractor)");
  });

  it("renders the AttractorItem correctly for infinity attractor", () => {
    // Mount the AttractorItem
    props.isInfinity = true;
    const attractorItem = mount(AttractorItem, { props: props, shallow: true });

    // Get the DOM elements
    const heading4 = attractorItem.find("h4");

    // Check the heading is rendered correctly
    expect(heading4.text()).toBe("Divergence to Infinity");
  });
});

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      isDefault: false,
      isInfinity: false,
      attractor: new Attractor(new Complex(3, 6), 210, 0.1, 0.2, 0.3, 0.4),
    };
  });

  it("changes the attractor complex number correctly", () => {
    // Mount the AttractorItem
    const attractorItem = mount(AttractorItem, { props: props, shallow: true });

    // Get the complex input
    const complexInput = attractorItem.findComponent(ComplexInput);

    // Update ComplexInput and check the value has changed
    const newComplex = new Complex(4, 2);
    complexInput.vm.$emit("update:complex", newComplex);
    expect(props.attractor.complex).toEqual(newComplex);
    expect(attractorItem.emitted().change).toBeDefined();
  });

  it("deletes the attractor when clicking the delete button", () => {
    // Mount the AttractorItem
    const attractorItem = mount(AttractorItem, { props: props, shallow: true });

    // Get the delete button
    const deleteButton = attractorItem.find("button");

    // Click the delete button and check an event is emitted
    deleteButton.trigger("click");
    expect(attractorItem.emitted()["delete:attractor"]).toBeDefined();
  });

  it("changes the hue when updating the hue slider", () => {
    // Mount the AttractorItem
    const attractorItem = mount(AttractorItem, { props: props, shallow: true });

    // Get the delete button
    const sliderInput = attractorItem.findComponent(SliderInput);

    // Update the slider input and check the hue is changed
    const newHue = 36;
    sliderInput.vm.$emit("update:value", newHue);
    expect(props.attractor.hue).toBe(newHue);
    expect(attractorItem.emitted().change).toBeDefined();
  });

  it("changes the saturation strength when updating the saturation strength number input", () => {
    // Mount the AttractorItem
    const attractorItem = mount(AttractorItem, { props: props, shallow: true });

    // Get the delete button
    const numberInput = attractorItem.findAllComponents(NumberInput)[0];

    // Update the number input and check the saturation strength is changed
    const newSaturationStrength = 3.6;
    numberInput.vm.$emit("update:value", newSaturationStrength);
    expect(props.attractor.saturationStrength).toBe(newSaturationStrength);
    expect(attractorItem.emitted().change).toBeDefined();
  });

  it("changes the saturation offset when updating the saturation offset number input", () => {
    // Mount the AttractorItem
    const attractorItem = mount(AttractorItem, { props: props, shallow: true });

    // Get the delete button
    const numberInput = attractorItem.findAllComponents(NumberInput)[1];

    // Update the number input and check the saturation offset is changed
    const newSaturationOffset = 3.6;
    numberInput.vm.$emit("update:value", newSaturationOffset);
    expect(props.attractor.saturationOffset).toBe(newSaturationOffset);
    expect(attractorItem.emitted().change).toBeDefined();
  });

  it("changes the value strength when updating the value strength number input", () => {
    // Mount the AttractorItem
    const attractorItem = mount(AttractorItem, { props: props, shallow: true });

    // Get the delete button
    const numberInput = attractorItem.findAllComponents(NumberInput)[2];

    // Update the number input and check the value strength is changed
    const newValueStrength = 3.6;
    numberInput.vm.$emit("update:value", newValueStrength);
    expect(props.attractor.valueStrength).toBe(newValueStrength);
    expect(attractorItem.emitted().change).toBeDefined();
  });

  it("changes the value offset when updating the value offset number input", () => {
    // Mount the AttractorItem
    const attractorItem = mount(AttractorItem, { props: props, shallow: true });

    // Get the delete button
    const numberInput = attractorItem.findAllComponents(NumberInput)[3];

    // Update the number input and check the value offset is changed
    const newValueOffset = 3.6;
    numberInput.vm.$emit("update:value", newValueOffset);
    expect(props.attractor.valueOffset).toBe(newValueOffset);
    expect(attractorItem.emitted().change).toBeDefined();
  });
});
