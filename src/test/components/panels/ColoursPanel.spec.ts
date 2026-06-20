import NumberInput from "@/components/inputs/NumberInput.vue";
import SliderInput from "@/components/inputs/SliderInput.vue";
import ColoursPanel from "@/components/panels/ColoursPanel.vue";
import ExpandableDisclosure from "@/components/primitives/ExpandableDisclosure.vue";
import { config, mount } from "@vue/test-utils";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

interface TestProps {
  juliaHSV: number[];
  fatouHue: number;
  fatouSaturationStrength: number;
  fatouSaturationOffset: number;
  fatouValueStrength: number;
  fatouValueOffset: number;
}

let props: TestProps;

const juliaHSV = [210, 0, 0];
const fatouHue = 36;
const fatouSaturationStrength = 0.3;
const fatouSaturationOffset = 0.4;
const fatouValueStrength = 0.5;
const fatouValueOffset = 0.6;

beforeAll(() => {
  config.global.renderStubDefaultSlot = true;
});

afterAll(() => {
  config.global.renderStubDefaultSlot = false;
});

describe("Render", () => {
  beforeEach(() => {
    props = {
      juliaHSV,
      fatouHue,
      fatouSaturationStrength,
      fatouSaturationOffset,
      fatouValueStrength,
      fatouValueOffset,
    };
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
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = coloursPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const disclosure = fatouSection.findComponent(ExpandableDisclosure);
    const sectionContent = fatouSection.find(".content");
    const subHeadings = sectionContent.findAll("h4");
    const sliderInput = sectionContent.findComponent(SliderInput);
    const numberInputs = sectionContent.findAllComponents(NumberInput);

    // Check the info header renders correctly
    expect(disclosure.vm.$props.headingCentred).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(3);
    expect(disclosure.vm.$props.headingText).toBe("Fatou");

    // Check the sliderInput is rendered correctly
    expect(sliderInput.vm.$props.value).toBe(props.fatouHue);
    expect(sliderInput.vm.$props.min).toBe(0);
    expect(sliderInput.vm.$props.max).toBe(360);
    expect(sliderInput.vm.$props.step).toBe(1);
    expect(sliderInput.vm.$props.isIntegerOnly).toBe(true);
    expect(sliderInput.vm.$props.label).toBe("Hue");
    expect(sliderInput.vm.$props.level).toBe(4);

    // Check the sub headings are rendered correctly
    expect(subHeadings[0].text()).toBe("Saturation");
    expect(subHeadings[1].text()).toBe("Value");

    // Check the NumberInputs are rendered correctly
    expect(numberInputs[0].vm.$props.value).toBe(props.fatouSaturationStrength);
    expect(numberInputs[0].vm.$props.min).toBe(0);
    expect(numberInputs[0].vm.$props.max).toBeUndefined();
    expect(numberInputs[0].vm.$props.step).toBe(0.1);
    expect(numberInputs[0].vm.$props.isIntegerOnly).toBe(false);
    expect(numberInputs[0].vm.$props.label).toBe("Saturation strength");
    expect(numberInputs[1].vm.$props.value).toBe(props.fatouSaturationOffset);
    expect(numberInputs[1].vm.$props.max).toBeUndefined();
    expect(numberInputs[1].vm.$props.step).toBe(0.1);
    expect(numberInputs[1].vm.$props.isIntegerOnly).toBe(false);
    expect(numberInputs[1].vm.$props.label).toBe("Saturation offset");
    expect(numberInputs[2].vm.$props.value).toBe(props.fatouValueStrength);
    expect(numberInputs[2].vm.$props.min).toBe(0);
    expect(numberInputs[2].vm.$props.max).toBeUndefined();
    expect(numberInputs[2].vm.$props.step).toBe(0.1);
    expect(numberInputs[2].vm.$props.isIntegerOnly).toBe(false);
    expect(numberInputs[2].vm.$props.label).toBe("Value strength");
    expect(numberInputs[3].vm.$props.value).toBe(props.fatouValueOffset);
    expect(numberInputs[3].vm.$props.max).toBeUndefined();
    expect(numberInputs[3].vm.$props.step).toBe(0.1);
    expect(numberInputs[3].vm.$props.isIntegerOnly).toBe(false);
    expect(numberInputs[3].vm.$props.label).toBe("Value offset");
  });
});

describe("Interactions", () => {
  beforeEach(() => {
    props = {
      juliaHSV,
      fatouHue,
      fatouSaturationStrength,
      fatouSaturationOffset,
      fatouValueStrength,
      fatouValueOffset,
    };
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

  it("changes the hue when updating the Fatou hue slider", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the slider input
    const content = coloursPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const sectionContent = fatouSection.find(".content");
    const sliderInput = sectionContent.findComponent(SliderInput);

    // Update the slider input and check the hue is changed
    const newHue = 42;
    sliderInput.vm.$emit("update:value", newHue);
    expect(coloursPanel.emitted()["update:fatouHue"]).toEqual([[newHue]]);
  });

  it("changes the saturation strength when updating the Fatou saturation strength number input", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the number input
    const content = coloursPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const sectionContent = fatouSection.find(".content");
    const numberInput = sectionContent.findAllComponents(NumberInput)[0];

    // Update the number input and check the saturation strength is changed
    const newSaturationStrength = 3.6;
    numberInput.vm.$emit("update:value", newSaturationStrength);
    expect(coloursPanel.emitted()["update:fatouSaturationStrength"]).toEqual([
      [newSaturationStrength],
    ]);
  });

  it("changes the saturation offset when updating the Fatou saturation offset number input", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the number input
    const content = coloursPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const sectionContent = fatouSection.find(".content");
    const numberInput = sectionContent.findAllComponents(NumberInput)[1];

    // Update the number input and check the saturation offset is changed
    const newSaturationOffset = 3.6;
    numberInput.vm.$emit("update:value", newSaturationOffset);
    expect(coloursPanel.emitted()["update:fatouSaturationOffset"]).toEqual([[newSaturationOffset]]);
  });

  it("changes the value strength when updating the Fatou value strength number input", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the number input
    const content = coloursPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const sectionContent = fatouSection.find(".content");
    const numberInput = sectionContent.findAllComponents(NumberInput)[2];

    // Update the number input and check the value strength is changed
    const newValueStrength = 3.6;
    numberInput.vm.$emit("update:value", newValueStrength);
    expect(coloursPanel.emitted()["update:fatouValueStrength"]).toEqual([[newValueStrength]]);
  });

  it("changes the value offset when updating the Fatou value offset number input", () => {
    // Mount the ColoursPanel
    const coloursPanel = mount(ColoursPanel, { props: props, shallow: true });

    // Get the number input
    const content = coloursPanel.find(".panel-content");
    const fatouSection = content.find("section:nth-of-type(2)");
    const sectionContent = fatouSection.find(".content");
    const numberInput = sectionContent.findAllComponents(NumberInput)[3];

    // Update the number input and check the value offset is changed
    const newValueOffset = 3.6;
    numberInput.vm.$emit("update:value", newValueOffset);
    expect(coloursPanel.emitted()["update:fatouValueOffset"]).toEqual([[newValueOffset]]);
  });
});
