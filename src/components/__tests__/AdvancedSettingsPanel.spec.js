import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { Configuration } from "../../models/Configuration";
import { Complex } from "../../models/Complex";

import AdvancedSettingsPanel from "../AdvancedSettingsPanel.vue";
import Disclosure from "../Disclosure.vue";
import NumberInput from "../NumberInput.vue";
import ComplexInput from "../ComplexInput.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      configuration: Configuration.defaultConfiguration(),
    };
  });

  it("renders the header correctly", () => {
    // Mount the AdvancedSettingsPanel
    const advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const header = advancedPanel.find("header");
    const disclosure = header.findComponent(Disclosure);

    // Check the header renders correctly
    expect(disclosure.vm.$props.headingCentered).toBe(true);
    expect(disclosure.vm.$props.headingLevel).toBe(2);
    expect(disclosure.vm.$props.headingText).toBe("Advanced settings");
  });

  it("renders the viewport section correctly", () => {
    // Mount the AdvancedSettingsPanel
    let advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = advancedPanel.find(".panel-content");
    let viewportSection = content.find("section:nth-of-type(1)");
    let disclosure = viewportSection.findComponent(Disclosure);
    let sectionContent = viewportSection.find(".content");
    let subHeadings = sectionContent.findAll("h4");
    let numberInputs = sectionContent.findAllComponents(NumberInput);
    let complexInput = sectionContent.findComponent(ComplexInput);

    // Check the info header renders correctly
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(3);
    expect(disclosure.vm.$props.headingText).toBe("Viewport");

    // Check the resolution part renders correctly
    expect(subHeadings[0].text()).toBe("Resolution");
    expect(numberInputs[0].vm.$props.value).toBe(props.configuration.resolutionScale);
    expect(numberInputs[0].vm.$props.min).toBe(0);
    expect(numberInputs[0].vm.$props.max).toBeUndefined();
    expect(numberInputs[0].vm.$props.step).toBe(0.1);
    expect(numberInputs[0].vm.$props.integerOnly).toBe(false);
    expect(numberInputs[0].vm.$props.label).toBe("Resolution");

    // Check the coordinates scale part renders correctly
    expect(subHeadings[1].text()).toBe("Scale");
    expect(numberInputs[1].vm.$props.value).toBe(props.configuration.coordinatesScale);
    expect(numberInputs[1].vm.$props.min).toBe(0);
    expect(numberInputs[1].vm.$props.max).toBeUndefined();
    expect(numberInputs[1].vm.$props.step).toBe(0.1);
    expect(numberInputs[1].vm.$props.integerOnly).toBe(false);
    expect(numberInputs[1].vm.$props.label).toBe("Coordinates scale");

    // Check the coordinates center part renders correctly
    expect(subHeadings[2].text()).toBe("Center");
    expect(complexInput.vm.$props.complex).toEqual(props.configuration.coordinatesCenter);
    expect(complexInput.vm.$props.label).toBe("Coordinates center");
  });

  it("renders the computation section correctly", () => {
    // Mount the AdvancedSettingsPanel
    let advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = advancedPanel.find(".panel-content");
    let computationSection = content.find("section:nth-of-type(2)");
    let disclosure = computationSection.findComponent(Disclosure);
    let sectionContent = computationSection.find(".content");
    let subHeadings = sectionContent.findAll("h4");
    let numberInputs = sectionContent.findAllComponents(NumberInput);

    // Check the info header renders correctly
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(3);
    expect(disclosure.vm.$props.headingText).toBe("Computation");

    // Check the iteration part renders correctly
    expect(subHeadings[0].text()).toBe("Iterations");
    expect(numberInputs[0].vm.$props.value).toBe(props.configuration.nbIterations);
    expect(numberInputs[0].vm.$props.min).toBe(1);
    expect(numberInputs[0].vm.$props.max).toBeUndefined();
    expect(numberInputs[0].vm.$props.step).toBe(1);
    expect(numberInputs[0].vm.$props.integerOnly).toBe(true);
    expect(numberInputs[0].vm.$props.wrongInputMessage).toBe(
      "Please enter a valid number of iterations"
    );
    expect(numberInputs[0].vm.$props.label).toBe("Number of iterations");

    // Check the epsilon part renders correctly
    expect(subHeadings[1].text()).toBe("Epsilon");
    expect(numberInputs[1].vm.$props.value).toBe(props.configuration.epsilon);
    expect(numberInputs[1].vm.$props.min).toBe(0);
    expect(numberInputs[1].vm.$props.max).toBeUndefined();
    expect(numberInputs[1].vm.$props.step).toBe(0.000001);
    expect(numberInputs[1].vm.$props.integerOnly).toBe(false);
    expect(numberInputs[1].vm.$props.label).toBe("Epsilon");

    // Check the Julia bound part renders correctly
    expect(subHeadings[2].text()).toBe("Julia bound");
    expect(numberInputs[2].vm.$props.value).toBe(props.configuration.juliaBound);
    expect(numberInputs[2].vm.$props.min).toBeUndefined();
    expect(numberInputs[2].vm.$props.max).toBeUndefined();
    expect(numberInputs[2].vm.$props.step).toBe(0.1);
    expect(numberInputs[2].vm.$props.integerOnly).toBe(false);
    expect(numberInputs[2].vm.$props.label).toBe("Julia bound");
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    props = {
      configuration: Configuration.defaultConfiguration(),
    };
  });

  it("changes the resolution when updating the resolution input", () => {
    // Mount the AdvancedSettingsPanel
    let advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = advancedPanel.find(".panel-content");
    let viewportSection = content.find("section:nth-of-type(1)");
    let sectionContent = viewportSection.find(".content");
    let resolutionInput = sectionContent.findAllComponents(NumberInput)[0];

    // Update the resolution input and check the resolution changes
    const newResolution = 0.36;
    resolutionInput.vm.$emit("update:value", newResolution);
    expect(props.configuration.resolutionScale).toBe(newResolution);
    expect(advancedPanel.emitted().change).toBeDefined();
  });

  it("changes the coordinates scale when updating the scale input", () => {
    // Mount the AdvancedSettingsPanel
    let advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = advancedPanel.find(".panel-content");
    let viewportSection = content.find("section:nth-of-type(1)");
    let sectionContent = viewportSection.find(".content");
    let scaleInput = sectionContent.findAllComponents(NumberInput)[1];

    // Update the scale input and check the coordinates scale changes
    const newScale = 0.36;
    scaleInput.vm.$emit("update:value", newScale);
    expect(props.configuration.coordinatesScale).toBe(newScale);
    expect(advancedPanel.emitted().change).toBeDefined();
  });

  it("changes the coordinates center when updating the center input", () => {
    // Mount the AdvancedSettingsPanel
    let advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = advancedPanel.find(".panel-content");
    let viewportSection = content.find("section:nth-of-type(1)");
    let sectionContent = viewportSection.find(".content");
    let centerInput = sectionContent.findComponent(ComplexInput);

    // Update the center input and check the coordinates center changes
    const newCenter = new Complex(4, 2);
    centerInput.vm.$emit("update:complex", newCenter);
    expect(props.configuration.coordinatesCenter).toBe(newCenter);
    expect(advancedPanel.emitted().change).toBeDefined();
  });

  it("changes the number of iterations when updating the iteration input", () => {
    // Mount the AdvancedSettingsPanel
    let advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = advancedPanel.find(".panel-content");
    let computationSection = content.find("section:nth-of-type(2)");
    let sectionContent = computationSection.find(".content");
    let iterationInput = sectionContent.findAllComponents(NumberInput)[0];

    // Update the number of iterations input and check the number of iterations changes
    const newNbIterations = 36;
    iterationInput.vm.$emit("update:value", newNbIterations);
    expect(props.configuration.nbIterations).toBe(newNbIterations);
    expect(advancedPanel.emitted().change).toBeDefined();
  });

  it("changes epsilon when updating the epsilon input", () => {
    // Mount the AdvancedSettingsPanel
    let advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = advancedPanel.find(".panel-content");
    let computationSection = content.find("section:nth-of-type(2)");
    let sectionContent = computationSection.find(".content");
    let epsilonInput = sectionContent.findAllComponents(NumberInput)[1];

    // Update the epsilon input and check the epsilon changes
    const newEpsilon = 0.000036;
    epsilonInput.vm.$emit("update:value", newEpsilon);
    expect(props.configuration.epsilon).toBe(newEpsilon);
    expect(advancedPanel.emitted().change).toBeDefined();
  });

  it("changes the Julia bound when updating the Julia bound input", () => {
    // Mount the AdvancedSettingsPanel
    let advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = advancedPanel.find(".panel-content");
    let computationSection = content.find("section:nth-of-type(2)");
    let sectionContent = computationSection.find(".content");
    let juliaBoundInput = sectionContent.findAllComponents(NumberInput)[2];

    // Update the Julia bound input and check the Julia bound changes
    const newJuliaBound = -36;
    juliaBoundInput.vm.$emit("update:value", newJuliaBound);
    expect(props.configuration.juliaBound).toBe(newJuliaBound);
    expect(advancedPanel.emitted().change).toBeDefined();
  });
});
