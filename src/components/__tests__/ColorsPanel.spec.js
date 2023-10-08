import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { Attractor } from "../../models/Attractor";
import { Complex } from "../../models/Complex";

import ColorsPanel from "../ColorsPanel.vue";
import Disclosure from "../Disclosure.vue";
import SliderInput from "../SliderInput.vue";
import AttractorItem from "../AttractorItem.vue";
import IconTextButton from "../IconTextButton.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      juliaHSV: [210, 0, 0],
      defaultAttractor: new Attractor(null, 36, 0.3, 0.4, 0.5, 0.6),
      infinityAttractor: new Attractor(null, 42, 0.7, 0.8, 0.9, 1.0),
      attractors: [new Attractor(new Complex(3, 6), 78, 1.1, 1.2, 1.3, 1.4)],
    };
  });

  it("renders the header correctly", () => {
    // Mount the ColorsPanel
    const colorsPanel = mount(ColorsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const header = colorsPanel.find("header");
    const disclosure = header.findComponent(Disclosure);

    // Check the header renders correctly
    expect(disclosure.vm.$props.headingCentered).toBe(true);
    expect(disclosure.vm.$props.headingLevel).toBe(2);
    expect(disclosure.vm.$props.headingText).toBe("Colors");
  });

  it("renders the Julia section correctly", () => {
    // Mount the ColorsPanel
    const colorsPanel = mount(ColorsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = colorsPanel.find(".panel-content");
    const juliaSection = content.find("section:nth-of-type(1)");
    const disclosure = juliaSection.findComponent(Disclosure);
    const sectionContent = juliaSection.find(".content");
    const subHeading = sectionContent.find("h4");
    const colorVisualizer = sectionContent.find(".color-visualizer");
    const sliderInputs = sectionContent.findAllComponents(SliderInput);

    // Check the info header renders correctly
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(3);
    expect(disclosure.vm.$props.headingText).toBe("Julia");

    // Check the sub heading is rendered correctly
    expect(subHeading.text()).toBe("Color");

    // Check the colorVisualizer has the right color
    expect(colorVisualizer.attributes().style).toBe("background-color: rgb(0, 0, 0);");

    // Check the SliderInputs are rendered correctly
    expect(sliderInputs[0].vm.$props.value).toBe(props.juliaHSV[0]);
    expect(sliderInputs[0].vm.$props.min).toBe(0);
    expect(sliderInputs[0].vm.$props.max).toBe(360);
    expect(sliderInputs[0].vm.$props.step).toBe(1);
    expect(sliderInputs[0].vm.$props.integerOnly).toBe(true);
    expect(sliderInputs[0].vm.$props.label).toBe("Hue");
    expect(sliderInputs[0].vm.$props.level).toBe(5);
    expect(sliderInputs[1].vm.$props.value).toBe(props.juliaHSV[1]);
    expect(sliderInputs[1].vm.$props.min).toBe(0);
    expect(sliderInputs[1].vm.$props.max).toBe(1);
    expect(sliderInputs[1].vm.$props.step).toBe(0.01);
    expect(sliderInputs[1].vm.$props.integerOnly).toBe(false);
    expect(sliderInputs[1].vm.$props.label).toBe("Saturation");
    expect(sliderInputs[1].vm.$props.level).toBe(5);
    expect(sliderInputs[2].vm.$props.value).toBe(props.juliaHSV[2]);
    expect(sliderInputs[2].vm.$props.min).toBe(0);
    expect(sliderInputs[2].vm.$props.max).toBe(1);
    expect(sliderInputs[2].vm.$props.step).toBe(0.01);
    expect(sliderInputs[2].vm.$props.integerOnly).toBe(false);
    expect(sliderInputs[2].vm.$props.label).toBe("Value");
    expect(sliderInputs[2].vm.$props.level).toBe(5);
  });

  it("renders the Fatou section correctly", () => {
    // Mount the ColorsPanel
    let colorsPanel = mount(ColorsPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = colorsPanel.find(".panel-content");
    let fatouSection = content.find("section:nth-of-type(2)");
    const disclosure = fatouSection.findComponent(Disclosure);
    const attractorItems = fatouSection.findAllComponents(AttractorItem);
    let addButton = fatouSection.findComponent(IconTextButton);

    // Check the info header renders correctly
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(3);
    expect(disclosure.vm.$props.headingText).toBe("Fatou");

    // Check the attractorItems are rendered correctly
    expect(attractorItems[0].vm.$props.isDefault).toBe(true);
    expect(attractorItems[0].vm.$props.isInfinity).toBe(false);
    expect(attractorItems[0].vm.$props.attractor).toEqual(props.defaultAttractor);
    expect(attractorItems[1].vm.$props.isDefault).toBe(false);
    expect(attractorItems[1].vm.$props.isInfinity).toBe(true);
    expect(attractorItems[1].vm.$props.attractor).toEqual(props.infinityAttractor);
    expect(attractorItems[2].vm.$props.isDefault).toBe(false);
    expect(attractorItems[2].vm.$props.isInfinity).toBe(false);
    expect(attractorItems[2].vm.$props.attractor).toEqual(props.attractors[0]);

    // Check the addButton is rendered correctly
    expect(addButton.exists()).toBe(true);
    expect(addButton.vm.$props.text).toBe("New Attractor");

    // Mount the ColorsPanel with 16 attractors
    for (let k = 0; k < 15; k++) {
      props.attractors.push(new Attractor(new Complex(0, 0), 0, 0, 0, 0, 0));
    }
    colorsPanel = mount(ColorsPanel, { props: props, shallow: true });

    // Check the addButton is not displayed
    content = colorsPanel.find(".panel-content");
    fatouSection = content.find("section:nth-of-type(2)");
    addButton = fatouSection.findComponent(IconTextButton);
    expect(addButton.exists()).toBe(false);
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    props = {
      juliaHSV: [210, 0, 0],
      defaultAttractor: new Attractor(null, 36, 0.3, 0.4, 0.5, 0.6),
      infinityAttractor: new Attractor(null, 42, 0.7, 0.8, 0.9, 1.0),
      attractors: [new Attractor(new Complex(3, 6), 78, 1.1, 1.2, 1.3, 1.4)],
    };
  });

  it("changes the Julia hue when updating the Julia hue slider", () => {
    // Mount the ColorsPanel
    const colorsPanel = mount(ColorsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = colorsPanel.find(".panel-content");
    const juliaSection = content.find("section:nth-of-type(1)");
    const sectionContent = juliaSection.find(".content");
    const hueSlider = sectionContent.findAllComponents(SliderInput)[0];

    // Update the Julia hue slider and check the Julia hue changes
    const newHue = 42;
    hueSlider.vm.$emit("update:value", newHue);
    expect(props.juliaHSV[0]).toBe(newHue);
    expect(colorsPanel.emitted().change).toBeDefined();
  });

  it("changes the Julia saturation when updating the Julia saturation slider", () => {
    // Mount the ColorsPanel
    const colorsPanel = mount(ColorsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = colorsPanel.find(".panel-content");
    const juliaSection = content.find("section:nth-of-type(1)");
    const sectionContent = juliaSection.find(".content");
    const saturationSlider = sectionContent.findAllComponents(SliderInput)[1];

    // Update the Julia saturation slider and check the Julia saturation changes
    const newSaturation = 0.36;
    saturationSlider.vm.$emit("update:value", newSaturation);
    expect(props.juliaHSV[1]).toBe(newSaturation);
    expect(colorsPanel.emitted().change).toBeDefined();
  });

  it("changes the Julia value when updating the Julia value slider", () => {
    // Mount the ColorsPanel
    const colorsPanel = mount(ColorsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = colorsPanel.find(".panel-content");
    const juliaSection = content.find("section:nth-of-type(1)");
    const sectionContent = juliaSection.find(".content");
    const valueSlider = sectionContent.findAllComponents(SliderInput)[2];

    // Update the Julia value slider and check the Julia value changes
    const newValue = 0.36;
    valueSlider.vm.$emit("update:value", newValue);
    expect(props.juliaHSV[2]).toBe(newValue);
    expect(colorsPanel.emitted().change).toBeDefined();
  });

  it("emits change when the default attractor changes", () => {
    // Mount the ColorsPanel
    const colorsPanel = mount(ColorsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = colorsPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const defaultAttractorItem = fatouSection.findAllComponents(AttractorItem)[0];

    // Change the default attractor and check change is emitted
    defaultAttractorItem.vm.$emit("change");
    expect(colorsPanel.emitted().change).toBeDefined();
  });

  it("emits change when the infinity attractor changes", () => {
    // Mount the ColorsPanel
    const colorsPanel = mount(ColorsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = colorsPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const infinityAttractorItem = fatouSection.findAllComponents(AttractorItem)[1];

    // Change the infinity attractor and check change is emitted
    infinityAttractorItem.vm.$emit("change");
    expect(colorsPanel.emitted().change).toBeDefined();
  });

  it("emits change when a normal attractor changes", () => {
    // Mount the ColorsPanel
    const colorsPanel = mount(ColorsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = colorsPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const normalAttractorItem = fatouSection.findAllComponents(AttractorItem)[2];

    // Change the normal attractor and check change is emitted
    normalAttractorItem.vm.$emit("change");
    expect(colorsPanel.emitted().change).toBeDefined();
  });

  it("deletes the attractor when attractorItem emits deletion event", () => {
    // Mount the ColorsPanel
    const colorsPanel = mount(ColorsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = colorsPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const normalAttractorItem = fatouSection.findAllComponents(AttractorItem)[2];

    // Change the normal attractor and check change is emitted
    normalAttractorItem.vm.$emit("delete:attractor");
    expect(props.attractors.length).toBe(0);
    expect(colorsPanel.emitted().change).toBeDefined();
  });

  it("adds an attractor when clicking the add button", () => {
    // Mount the ColorsPanel
    const colorsPanel = mount(ColorsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = colorsPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const addButton = fatouSection.findComponent(IconTextButton);

    // Change the normal attractor and check change is emitted
    addButton.trigger("click");
    expect(props.attractors.length).toBe(2);
    expect(props.attractors[1]).toEqual(new Attractor(new Complex(0, 0), 0, 1, 0, 1, 0));
    expect(colorsPanel.emitted().change).toBeDefined();
  });
});
