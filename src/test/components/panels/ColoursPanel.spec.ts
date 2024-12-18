import { describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import { config, mount } from "@vue/test-utils";
import Attractor from "@/models/Attractor";
import Complex from "@/models/Complex";
import ColoursPanel from "@/components/panels/ColoursPanel.vue";
import ExpandableDisclosure from "@/components/primitives/ExpandableDisclosure.vue";
import SliderInput from "@/components/inputs/SliderInput.vue";
import AttractorItem from "@/components/items/AttractorItem.vue";
import IconTextButton from "@/components/primitives/IconTextButton.vue";

interface TestProps {
  juliaHSV: number[];
  defaultAttractor: Attractor;
  infinityAttractor: Attractor;
  attractors: Attractor[];
}

let props: TestProps;

const juliaHSV = [210, 0, 0];
const defaultAttractor = new Attractor(undefined, 36, 0.3, 0.4, 0.5, 0.6);
const infinityAttractor = new Attractor(undefined, 42, 0.7, 0.8, 0.9, 1.0);
const attractor = new Attractor(new Complex(3, 6), 78, 1.1, 1.2, 1.3, 1.4);

beforeAll(() => {
  config.global.renderStubDefaultSlot = true;
});

afterAll(() => {
  config.global.renderStubDefaultSlot = false;
});

describe("Render", () => {
  beforeEach(() => {
    props = { juliaHSV, defaultAttractor, infinityAttractor, attractors: [attractor] };
  });

  it("renders the header correctly", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the DOM elements
    const header = coloursPanel.find("header");
    const disclosure = header.findComponent(ExpandableDisclosure);

    // Check the header renders correctly
    expect(disclosure.vm.$props.headingCentred).toBe(true);
    expect(disclosure.vm.$props.headingLevel).toBe(2);
    expect(disclosure.vm.$props.headingText).toBe("Colours");
  });

  it("renders the Julia section correctly", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = coloursPanel.find(".panel-content");
    const juliaSection = content.find("section:nth-of-type(1)");
    const disclosure = juliaSection.findComponent(ExpandableDisclosure);
    const sectionContent = juliaSection.find(".content");
    const subHeading = sectionContent.find("h4");
    const colourVisualiser = sectionContent.find(".colour-visualiser");
    const sliderInputs = sectionContent.findAllComponents(SliderInput);

    // Check the info header renders correctly
    expect(disclosure.vm.$props.headingCentred).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(3);
    expect(disclosure.vm.$props.headingText).toBe("Julia");

    // Check the sub heading is rendered correctly
    expect(subHeading.text()).toBe("Colour");

    // Check the colourVisualiser has the right colour
    expect(colourVisualiser.attributes().style).toBe("background-color: rgb(0, 0, 0);");

    // Check the SliderInputs are rendered correctly
    expect(sliderInputs[0].vm.$props.value).toBe(props.juliaHSV[0]);
    expect(sliderInputs[0].vm.$props.min).toBe(0);
    expect(sliderInputs[0].vm.$props.max).toBe(360);
    expect(sliderInputs[0].vm.$props.step).toBe(1);
    expect(sliderInputs[0].vm.$props.isIntegerOnly).toBe(true);
    expect(sliderInputs[0].vm.$props.label).toBe("Hue");
    expect(sliderInputs[0].vm.$props.level).toBe(5);
    expect(sliderInputs[1].vm.$props.value).toBe(props.juliaHSV[1]);
    expect(sliderInputs[1].vm.$props.min).toBe(0);
    expect(sliderInputs[1].vm.$props.max).toBe(1);
    expect(sliderInputs[1].vm.$props.step).toBe(0.01);
    expect(sliderInputs[1].vm.$props.isIntegerOnly).toBe(false);
    expect(sliderInputs[1].vm.$props.label).toBe("Saturation");
    expect(sliderInputs[1].vm.$props.level).toBe(5);
    expect(sliderInputs[2].vm.$props.value).toBe(props.juliaHSV[2]);
    expect(sliderInputs[2].vm.$props.min).toBe(0);
    expect(sliderInputs[2].vm.$props.max).toBe(1);
    expect(sliderInputs[2].vm.$props.step).toBe(0.01);
    expect(sliderInputs[2].vm.$props.isIntegerOnly).toBe(false);
    expect(sliderInputs[2].vm.$props.label).toBe("Value");
    expect(sliderInputs[2].vm.$props.level).toBe(5);
  });

  it("renders the Fatou section correctly", () => {
    // Mount the ColoursPanel
    let coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = coloursPanel.find(".panel-content");
    let fatouSection = content.find("section:nth-of-type(2)");
    const disclosure = fatouSection.findComponent(ExpandableDisclosure);
    const attractorItems = fatouSection.findAllComponents(AttractorItem);
    let addButton = fatouSection.findComponent(IconTextButton);

    // Check the info header renders correctly
    expect(disclosure.vm.$props.headingCentred).toBe(false);
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

    // Mount the ColoursPanel with 16 attractors
    for (let k = 0; k < 15; k++) {
      props.attractors.push(new Attractor(new Complex(0, 0), 0, 0, 0, 0, 0));
    }
    coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Check the addButton is not displayed
    content = coloursPanel.find(".panel-content");
    fatouSection = content.find("section:nth-of-type(2)");
    addButton = fatouSection.findComponent(IconTextButton);
    expect(addButton.exists()).toBe(false);
  });
});

describe("Interactions", () => {
  beforeEach(() => {
    props = { juliaHSV, defaultAttractor, infinityAttractor, attractors: [attractor] };
  });

  it("changes the Julia hue when updating the Julia hue slider", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = coloursPanel.find(".panel-content");
    const juliaSection = content.find("section:nth-of-type(1)");
    const sectionContent = juliaSection.find(".content");
    const hueSlider = sectionContent.findAllComponents(SliderInput)[0];

    // Update the Julia hue slider and check the Julia hue changes
    const newHue = 42;
    hueSlider.vm.$emit("update:value", newHue);
    expect(props.juliaHSV[0]).toBe(newHue);
  });

  it("changes the Julia saturation when updating the Julia saturation slider", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = coloursPanel.find(".panel-content");
    const juliaSection = content.find("section:nth-of-type(1)");
    const sectionContent = juliaSection.find(".content");
    const saturationSlider = sectionContent.findAllComponents(SliderInput)[1];

    // Update the Julia saturation slider and check the Julia saturation changes
    const newSaturation = 0.36;
    saturationSlider.vm.$emit("update:value", newSaturation);
    expect(props.juliaHSV[1]).toBe(newSaturation);
  });

  it("changes the Julia value when updating the Julia value slider", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = coloursPanel.find(".panel-content");
    const juliaSection = content.find("section:nth-of-type(1)");
    const sectionContent = juliaSection.find(".content");
    const valueSlider = sectionContent.findAllComponents(SliderInput)[2];

    // Update the Julia value slider and check the Julia value changes
    const newValue = 0.36;
    valueSlider.vm.$emit("update:value", newValue);
    expect(props.juliaHSV[2]).toBe(newValue);
  });

  it("emits change when the default attractor changes", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = coloursPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const defaultAttractorItem = fatouSection.findAllComponents(AttractorItem)[0];

    // Change the default attractor and check change is emitted
    const newAttractor = new Attractor(undefined, 1, 2, 3, 4, 5);
    defaultAttractorItem.vm.$emit("update:attractor", newAttractor);
    expect(coloursPanel.emitted()["update:defaultAttractor"]).toEqual([[newAttractor]]);
  });

  it("emits change when the infinity attractor changes", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = coloursPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const infinityAttractorItem = fatouSection.findAllComponents(AttractorItem)[1];

    // Change the infinity attractor and check change is emitted
    const newAttractor = new Attractor(undefined, 1, 2, 3, 4, 5);
    infinityAttractorItem.vm.$emit("update:attractor", newAttractor);
    expect(coloursPanel.emitted()["update:infinityAttractor"]).toEqual([[newAttractor]]);
  });

  it("emits change when a normal attractor changes", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = coloursPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const normalAttractorItem = fatouSection.findAllComponents(AttractorItem)[2];

    // Change the normal attractor and check change is emitted
    const newAttractor = new Attractor(undefined, 1, 2, 3, 4, 5);
    normalAttractorItem.vm.$emit("update:attractor", newAttractor);
    expect(props.attractors[0]).toEqual(newAttractor);
  });

  it("deletes the attractor when attractorItem emits deletion event", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = coloursPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const normalAttractorItem = fatouSection.findAllComponents(AttractorItem)[2];

    // Change the normal attractor and check change is emitted
    normalAttractorItem.vm.$emit("delete:attractor");
    expect(props.attractors.length).toBe(0);
  });

  it("adds an attractor when clicking the add button", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = coloursPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const addButton = fatouSection.findComponent(IconTextButton);

    // Change the normal attractor and check change is emitted
    addButton.trigger("click");
    expect(props.attractors.length).toBe(2);
    expect(props.attractors[1]).toEqual(new Attractor(new Complex(0, 0), 0, 1, 0, 1, 0));
  });
});
