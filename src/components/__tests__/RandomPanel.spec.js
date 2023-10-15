import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FunctionTypes } from "../../enumerations/FunctionTypes";
import { Configuration } from "../../models/Configuration";
import { CoefficientTypes } from "../../enumerations/CoefficientTypes";
import { Polynomial } from "../../models/Polynomial";

import RandomPanel from "../RandomPanel.vue";
import Disclosure from "../Disclosure.vue";
import IconTextButton from "../IconTextButton.vue";
import MinMaxInput from "../MinMaxInput.vue";
import MultiComboBox from "../MultiComboBox.vue";

const nbCoefficientsMinDefault = 2;
const nbCoefficientsMinMin = 1;
const nbCoefficientsMaxDefault = 5;
const nbCoefficientsMaxMax = 2 * (Polynomial.MAX_DEGREE + 1);

const complexModulusMinDefault = 0.1;
const complexModulusMinMin = 0;
const complexModulusMaxDefault = 10;
const complexModulusMaxMax = 100;
const viewportCenterModulusMinDefault = 0;
const viewportCenterModulusMaxDefault = 0;

const rotationAngleMinDefault = 0;
const rotationAngleMinMin = 0;
const rotationAngleMaxDefault = 360;
const rotationAngleMaxMax = 360;

const durationMinDefault = 5;
const durationMinMin = 1;
const durationMaxDefault = 30;
const durationMaxMax = 300;

const juliaHueMinDefault = 0;
const attractorHueMinDefault = 0;
const hueMinMin = 0;
const juliaHueMaxDefault = 0;
const attractorHueMaxDefault = 360;
const hueMaxMax = 360;

const juliaSaturationMinDefault = 0;
const juliaSaturationMinMin = 0;
const juliaSaturationMaxDefault = 0;
const juliaSaturationMaxMax = 1;

const juliaValueMinDefault = 1;
const juliaValueMinMin = 0;
const juliaValueMaxDefault = 1;
const juliaValueMaxMax = 1;

const attractorSaturationStrengthMinDefault = 0.01;
const attractorSaturationStrengthMaxDefault = 0.2;
const attractorSaturationOffsetMinDefault = 0;
const attractorSaturationOffsetMaxDefault = 1;
const attractorValueStrengthMinDefault = 0.1;
const attractorValueStrengthMaxDefault = 0.5;
const attractorValueOffsetMinDefault = 0;
const attractorValueOffsetMaxDefault = 3;
const strengthOffsetMinMin = 0;
const strengthOffsetMaxMax = 100;

const scaleMinDefault = 1;
const scaleMinMin = 0;
const scaleMaxDefault = 3;
const scaleMaxMax = 100;

const nbIterationsMinDefault = 10;
const nbIterationsMinMin = 0;
const nbIterationsMaxDefault = 40;
const nbIterationsMaxMax = 100;

const epsilonMinDefault = 0.000005;
const epsilonMinMin = 0.0000001;
const epsilonMaxDefault = 0.000015;
const epsilonMaxMax = 0.001;

const juliaBoundMinDefault = -5;
const juliaBoundMinMin = -100;
const juliaBoundMaxDefault = -3;
const juliaBoundMaxMax = 100;

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      configuration: Configuration.defaultConfiguration(),
    };
  });

  it("renders the header correctly", () => {
    // Mount the RandomPanel
    const randomPanel = mount(RandomPanel, { props: props, shallow: true });

    // Get the DOM elements
    const header = randomPanel.find("header");
    const disclosure = header.findComponent(Disclosure);

    // Check the header renders correctly
    expect(disclosure.vm.$props.headingCentered).toBe(true);
    expect(disclosure.vm.$props.headingLevel).toBe(2);
    expect(disclosure.vm.$props.headingText).toBe("Randomize");
  });

  it("renders the function section correctly", async () => {
    // Mount the RandomPanel
    const randomPanel = mount(RandomPanel, { props: props, shallow: false });

    // Get the DOM elements
    const content = randomPanel.find(".panel-content");
    const functionSection = content.find("section:nth-of-type(1)");
    const headerDisclosure = functionSection.findComponent(Disclosure);
    const sectionContent = functionSection.find(".content");
    const headings4 = sectionContent.findAll("h4");
    const multiComboBoxes = sectionContent.findAllComponents(MultiComboBox);
    const nbCoefficientsMinMaxInput = sectionContent.findComponent(MinMaxInput);
    const disclosures = sectionContent.findAllComponents(Disclosure);

    // Open all disclosures
    for (let disclosure of disclosures) {
      await disclosure.find("button").trigger("click");
    }

    // Check the section header renders correctly
    expect(headerDisclosure.vm.$props.headingCentered).toBe(false);
    expect(headerDisclosure.vm.$props.headingLevel).toBe(3);
    expect(headerDisclosure.vm.$props.headingText).toBe("Function");

    // Check the function types part renders correctly
    expect(headings4[0].text()).toBe("Function types");
    expect(multiComboBoxes[0].vm.$props.options).toEqual([
      { id: FunctionTypes.DEFAULT, text: "Default" },
      { id: FunctionTypes.NEWTON, text: "Newton" },
      { id: FunctionTypes.FRACTION, text: "Fraction" },
    ]);
    expect(multiComboBoxes[0].vm.$props.selected).toEqual(
      new Set([FunctionTypes.DEFAULT, FunctionTypes.NEWTON, FunctionTypes.FRACTION])
    );
    expect(multiComboBoxes[0].vm.$props.label).toBe("Function types");
    expect(multiComboBoxes[0].vm.$props.noOptionsSelectedText).toBe("No function type");
    expect(multiComboBoxes[0].vm.$props.allOptionsSelectedText).toBe("All function types");

    // Check the coefficient types part renders correctly
    expect(headings4[1].text()).toBe("Coefficient types");
    expect(multiComboBoxes[1].vm.$props.options).toEqual([
      { id: CoefficientTypes.CONSTANT, text: "Constant" },
      { id: CoefficientTypes.CIRCLE, text: "Circle" },
      { id: CoefficientTypes.LINE, text: "Line" },
      { id: CoefficientTypes.ELLIPSE, text: "Ellipse" },
    ]);
    expect(multiComboBoxes[1].vm.$props.selected).toEqual(
      new Set([
        CoefficientTypes.CONSTANT,
        CoefficientTypes.CIRCLE,
        CoefficientTypes.LINE,
        CoefficientTypes.ELLIPSE,
      ])
    );
    expect(multiComboBoxes[1].vm.$props.label).toBe("Coefficient types");
    expect(multiComboBoxes[1].vm.$props.noOptionsSelectedText).toBe("No coefficient type");
    expect(multiComboBoxes[1].vm.$props.allOptionsSelectedText).toBe("All coefficient types");

    // Check the number of coefficients part renders correctly
    expect(headings4[2].text()).toBe("Number of coefficients");
    expect(nbCoefficientsMinMaxInput.vm.$props.minValue).toBe(nbCoefficientsMinDefault);
    expect(nbCoefficientsMinMaxInput.vm.$props.maxValue).toBe(nbCoefficientsMaxDefault);
    expect(nbCoefficientsMinMaxInput.vm.$props.min).toBe(nbCoefficientsMinMin);
    expect(nbCoefficientsMinMaxInput.vm.$props.max).toBe(nbCoefficientsMaxMax);
    expect(nbCoefficientsMinMaxInput.vm.$props.step).toBe(1);
    expect(nbCoefficientsMinMaxInput.vm.$props.integerOnly).toBe(true);
    expect(nbCoefficientsMinMaxInput.vm.$props.minLabel).toBe("Minimum number of coefficients");
    expect(nbCoefficientsMinMaxInput.vm.$props.maxLabel).toBe("Maximum number of coefficients");
    expect(nbCoefficientsMinMaxInput.vm.$props.level).toBe(5);

    // Check the constant coefficients part renders correctly
    let disclosure = disclosures[0];
    let headings5 = disclosure.findAll("h5");
    let minMaxInputs = disclosure.findAllComponents(MinMaxInput);
    expect(disclosure.vm.$props.headingText).toBe("Constant coefficients");
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(4);
    expect(disclosure.vm.$props.rotateWhenExpand).toBe(true);
    expect(disclosure.vm.$props.buttonTitle).toBe("Show");
    expect(headings5[0].text()).toBe("Complex modulus");
    expect(minMaxInputs[0].vm.$props.minValue).toBe(complexModulusMinDefault);
    expect(minMaxInputs[0].vm.$props.maxValue).toBe(complexModulusMaxDefault);
    expect(minMaxInputs[0].vm.$props.min).toBe(complexModulusMinMin);
    expect(minMaxInputs[0].vm.$props.max).toBe(complexModulusMaxMax);
    expect(minMaxInputs[0].vm.$props.step).toBe(0.1);
    expect(minMaxInputs[0].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[0].vm.$props.minLabel).toBe(
      "Minimum modulus of constant complex coefficients"
    );
    expect(minMaxInputs[0].vm.$props.maxLabel).toBe(
      "Maximum modulus of constant complex coefficients"
    );
    expect(minMaxInputs[0].vm.$props.level).toBe(6);

    // Check the circle coefficients part renders correctly
    disclosure = disclosures[1];
    headings5 = disclosure.findAll("h5");
    minMaxInputs = disclosure.findAllComponents(MinMaxInput);
    expect(disclosure.vm.$props.headingText).toBe("Circle coefficients");
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(4);
    expect(disclosure.vm.$props.rotateWhenExpand).toBe(true);
    expect(disclosure.vm.$props.buttonTitle).toBe("Show");
    expect(headings5[0].text()).toBe("Center modulus");
    expect(minMaxInputs[0].vm.$props.minValue).toBe(complexModulusMinDefault);
    expect(minMaxInputs[0].vm.$props.maxValue).toBe(complexModulusMaxDefault);
    expect(minMaxInputs[0].vm.$props.min).toBe(complexModulusMinMin);
    expect(minMaxInputs[0].vm.$props.max).toBe(complexModulusMaxMax);
    expect(minMaxInputs[0].vm.$props.step).toBe(0.1);
    expect(minMaxInputs[0].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[0].vm.$props.minLabel).toBe(
      "Minimum modulus of circle coefficients centers"
    );
    expect(minMaxInputs[0].vm.$props.maxLabel).toBe(
      "Maximum modulus of circle coefficients centers"
    );
    expect(minMaxInputs[0].vm.$props.level).toBe(6);
    expect(headings5[1].text()).toBe("Radius");
    expect(minMaxInputs[1].vm.$props.minValue).toBe(complexModulusMinDefault);
    expect(minMaxInputs[1].vm.$props.maxValue).toBe(complexModulusMaxDefault);
    expect(minMaxInputs[1].vm.$props.min).toBe(complexModulusMinMin);
    expect(minMaxInputs[1].vm.$props.max).toBe(complexModulusMaxMax);
    expect(minMaxInputs[1].vm.$props.step).toBe(0.1);
    expect(minMaxInputs[1].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[1].vm.$props.minLabel).toBe("Minimum radius of circle coefficients");
    expect(minMaxInputs[1].vm.$props.maxLabel).toBe("Maximum radius of circle coefficients");
    expect(minMaxInputs[1].vm.$props.level).toBe(6);
    expect(headings5[2].text()).toBe("Duration");
    expect(minMaxInputs[2].vm.$props.minValue).toBe(durationMinDefault);
    expect(minMaxInputs[2].vm.$props.maxValue).toBe(durationMaxDefault);
    expect(minMaxInputs[2].vm.$props.min).toBe(durationMinMin);
    expect(minMaxInputs[2].vm.$props.max).toBe(durationMaxMax);
    expect(minMaxInputs[2].vm.$props.step).toBe(1);
    expect(minMaxInputs[2].vm.$props.integerOnly).toBe(true);
    expect(minMaxInputs[2].vm.$props.minLabel).toBe("Minimum duration of circle coefficients");
    expect(minMaxInputs[2].vm.$props.maxLabel).toBe("Maximum duration of circle coefficients");
    expect(minMaxInputs[2].vm.$props.level).toBe(6);

    // Check the line coefficients part renders correctly
    disclosure = disclosures[2];
    headings5 = disclosure.findAll("h5");
    minMaxInputs = disclosure.findAllComponents(MinMaxInput);
    expect(disclosure.vm.$props.headingText).toBe("Line coefficients");
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(4);
    expect(disclosure.vm.$props.rotateWhenExpand).toBe(true);
    expect(disclosure.vm.$props.buttonTitle).toBe("Show");
    expect(headings5[0].text()).toBe("Start and end modulus");
    expect(minMaxInputs[0].vm.$props.minValue).toBe(complexModulusMinDefault);
    expect(minMaxInputs[0].vm.$props.maxValue).toBe(complexModulusMaxDefault);
    expect(minMaxInputs[0].vm.$props.min).toBe(complexModulusMinMin);
    expect(minMaxInputs[0].vm.$props.max).toBe(complexModulusMaxMax);
    expect(minMaxInputs[0].vm.$props.step).toBe(0.1);
    expect(minMaxInputs[0].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[0].vm.$props.minLabel).toBe(
      "Minimum modulus of line coefficients start/end"
    );
    expect(minMaxInputs[0].vm.$props.maxLabel).toBe(
      "Maximum modulus of line coefficients start/end"
    );
    expect(minMaxInputs[0].vm.$props.level).toBe(6);
    expect(headings5[1].text()).toBe("Duration");
    expect(minMaxInputs[1].vm.$props.minValue).toBe(durationMinDefault);
    expect(minMaxInputs[1].vm.$props.maxValue).toBe(durationMaxDefault);
    expect(minMaxInputs[1].vm.$props.min).toBe(durationMinMin);
    expect(minMaxInputs[1].vm.$props.max).toBe(durationMaxMax);
    expect(minMaxInputs[1].vm.$props.step).toBe(1);
    expect(minMaxInputs[1].vm.$props.integerOnly).toBe(true);
    expect(minMaxInputs[1].vm.$props.minLabel).toBe("Minimum duration of line coefficients");
    expect(minMaxInputs[1].vm.$props.maxLabel).toBe("Maximum duration of line coefficients");
    expect(minMaxInputs[1].vm.$props.level).toBe(6);

    // Check the circle coefficients part renders correctly
    disclosure = disclosures[3];
    headings5 = disclosure.findAll("h5");
    minMaxInputs = disclosure.findAllComponents(MinMaxInput);
    expect(disclosure.vm.$props.headingText).toBe("Ellipse coefficients");
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(4);
    expect(disclosure.vm.$props.rotateWhenExpand).toBe(true);
    expect(disclosure.vm.$props.buttonTitle).toBe("Show");
    expect(headings5[0].text()).toBe("Center modulus");
    expect(minMaxInputs[0].vm.$props.minValue).toBe(complexModulusMinDefault);
    expect(minMaxInputs[0].vm.$props.maxValue).toBe(complexModulusMaxDefault);
    expect(minMaxInputs[0].vm.$props.min).toBe(complexModulusMinMin);
    expect(minMaxInputs[0].vm.$props.max).toBe(complexModulusMaxMax);
    expect(minMaxInputs[0].vm.$props.step).toBe(0.1);
    expect(minMaxInputs[0].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[0].vm.$props.minLabel).toBe(
      "Minimum modulus of ellipse coefficients centers"
    );
    expect(minMaxInputs[0].vm.$props.maxLabel).toBe(
      "Maximum modulus of ellipse coefficients centers"
    );
    expect(minMaxInputs[0].vm.$props.level).toBe(6);
    expect(headings5[1].text()).toBe("Half-width");
    expect(minMaxInputs[1].vm.$props.minValue).toBe(complexModulusMinDefault);
    expect(minMaxInputs[1].vm.$props.maxValue).toBe(complexModulusMaxDefault);
    expect(minMaxInputs[1].vm.$props.min).toBe(complexModulusMinMin);
    expect(minMaxInputs[1].vm.$props.max).toBe(complexModulusMaxMax);
    expect(minMaxInputs[1].vm.$props.step).toBe(0.1);
    expect(minMaxInputs[1].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[1].vm.$props.minLabel).toBe("Minimum half-width of ellipse coefficients");
    expect(minMaxInputs[1].vm.$props.maxLabel).toBe("Maximum half-width of ellipse coefficients");
    expect(minMaxInputs[1].vm.$props.level).toBe(6);
    expect(headings5[2].text()).toBe("Half-height");
    expect(minMaxInputs[2].vm.$props.minValue).toBe(complexModulusMinDefault);
    expect(minMaxInputs[2].vm.$props.maxValue).toBe(complexModulusMaxDefault);
    expect(minMaxInputs[2].vm.$props.min).toBe(complexModulusMinMin);
    expect(minMaxInputs[2].vm.$props.max).toBe(complexModulusMaxMax);
    expect(minMaxInputs[2].vm.$props.step).toBe(0.1);
    expect(minMaxInputs[2].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[2].vm.$props.minLabel).toBe("Minimum half-height of ellipse coefficients");
    expect(minMaxInputs[2].vm.$props.maxLabel).toBe("Maximum half-height of ellipse coefficients");
    expect(minMaxInputs[2].vm.$props.level).toBe(6);
    expect(headings5[3].text()).toBe("Rotation angle");
    expect(minMaxInputs[3].vm.$props.minValue).toBe(rotationAngleMinDefault);
    expect(minMaxInputs[3].vm.$props.maxValue).toBe(rotationAngleMaxDefault);
    expect(minMaxInputs[3].vm.$props.min).toBe(rotationAngleMinMin);
    expect(minMaxInputs[3].vm.$props.max).toBe(rotationAngleMaxMax);
    expect(minMaxInputs[3].vm.$props.step).toBe(1);
    expect(minMaxInputs[3].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[3].vm.$props.minLabel).toBe(
      "Minimum rotation angle of ellipse coefficients"
    );
    expect(minMaxInputs[3].vm.$props.maxLabel).toBe(
      "Maximum rotation angle of ellipse coefficients"
    );
    expect(minMaxInputs[3].vm.$props.level).toBe(6);
    expect(headings5[4].text()).toBe("Duration");
    expect(minMaxInputs[4].vm.$props.minValue).toBe(durationMinDefault);
    expect(minMaxInputs[4].vm.$props.maxValue).toBe(durationMaxDefault);
    expect(minMaxInputs[4].vm.$props.min).toBe(durationMinMin);
    expect(minMaxInputs[4].vm.$props.max).toBe(durationMaxMax);
    expect(minMaxInputs[4].vm.$props.step).toBe(1);
    expect(minMaxInputs[4].vm.$props.integerOnly).toBe(true);
    expect(minMaxInputs[4].vm.$props.minLabel).toBe("Minimum duration of ellipse coefficients");
    expect(minMaxInputs[4].vm.$props.maxLabel).toBe("Maximum duration of ellipse coefficients");
    expect(minMaxInputs[4].vm.$props.level).toBe(6);
  });

  it("renders the colors section correctly", async () => {
    // Mount the RandomPanel
    const randomPanel = mount(RandomPanel, { props: props, shallow: false });

    // Get the DOM elements
    const content = randomPanel.find(".panel-content");
    const colorsSection = content.find("section:nth-of-type(2)");
    const headerDisclosure = colorsSection.findComponent(Disclosure);
    const sectionContent = colorsSection.find(".content");
    const disclosures = sectionContent.findAllComponents(Disclosure);

    // Open all disclosures
    for (let disclosure of disclosures) {
      await disclosure.find("button").trigger("click");
    }

    // Check the section header renders correctly
    expect(headerDisclosure.vm.$props.headingCentered).toBe(false);
    expect(headerDisclosure.vm.$props.headingLevel).toBe(3);
    expect(headerDisclosure.vm.$props.headingText).toBe("Colors");

    // Check the Julia color part renders correctly
    let disclosure = disclosures[0];
    let headings5 = disclosure.findAll("h5");
    let minMaxInputs = disclosure.findAllComponents(MinMaxInput);
    expect(disclosure.vm.$props.headingText).toBe("Julia color");
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(4);
    expect(disclosure.vm.$props.rotateWhenExpand).toBe(true);
    expect(disclosure.vm.$props.buttonTitle).toBe("Show");
    expect(headings5[0].text()).toBe("Hue");
    expect(minMaxInputs[0].vm.$props.minValue).toBe(juliaHueMinDefault);
    expect(minMaxInputs[0].vm.$props.maxValue).toBe(juliaHueMaxDefault);
    expect(minMaxInputs[0].vm.$props.min).toBe(hueMinMin);
    expect(minMaxInputs[0].vm.$props.max).toBe(hueMaxMax);
    expect(minMaxInputs[0].vm.$props.step).toBe(1);
    expect(minMaxInputs[0].vm.$props.integerOnly).toBe(true);
    expect(minMaxInputs[0].vm.$props.minLabel).toBe("Minimum hue of Julia color");
    expect(minMaxInputs[0].vm.$props.maxLabel).toBe("Maximum hue of Julia color");
    expect(minMaxInputs[0].vm.$props.level).toBe(6);
    expect(headings5[1].text()).toBe("Saturation");
    expect(minMaxInputs[1].vm.$props.minValue).toBe(juliaSaturationMinDefault);
    expect(minMaxInputs[1].vm.$props.maxValue).toBe(juliaSaturationMaxDefault);
    expect(minMaxInputs[1].vm.$props.min).toBe(juliaSaturationMinMin);
    expect(minMaxInputs[1].vm.$props.max).toBe(juliaSaturationMaxMax);
    expect(minMaxInputs[1].vm.$props.step).toBe(0.01);
    expect(minMaxInputs[1].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[1].vm.$props.minLabel).toBe("Minimum saturation of Julia color");
    expect(minMaxInputs[1].vm.$props.maxLabel).toBe("Maximum saturation of Julia color");
    expect(minMaxInputs[1].vm.$props.level).toBe(6);
    expect(headings5[2].text()).toBe("Value");
    expect(minMaxInputs[2].vm.$props.minValue).toBe(juliaValueMinDefault);
    expect(minMaxInputs[2].vm.$props.maxValue).toBe(juliaValueMaxDefault);
    expect(minMaxInputs[2].vm.$props.min).toBe(juliaValueMinMin);
    expect(minMaxInputs[2].vm.$props.max).toBe(juliaValueMaxMax);
    expect(minMaxInputs[2].vm.$props.step).toBe(0.01);
    expect(minMaxInputs[2].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[2].vm.$props.minLabel).toBe("Minimum value of Julia color");
    expect(minMaxInputs[2].vm.$props.maxLabel).toBe("Maximum value of Julia color");
    expect(minMaxInputs[2].vm.$props.level).toBe(6);

    // Check the attractors part renders correctly
    disclosure = disclosures[1];
    headings5 = disclosure.findAll("h5");
    minMaxInputs = disclosure.findAllComponents(MinMaxInput);
    expect(disclosure.vm.$props.headingText).toBe("Attractors");
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(4);
    expect(disclosure.vm.$props.rotateWhenExpand).toBe(true);
    expect(disclosure.vm.$props.buttonTitle).toBe("Show");
    expect(headings5[0].text()).toBe("Hue");
    expect(minMaxInputs[0].vm.$props.minValue).toBe(attractorHueMinDefault);
    expect(minMaxInputs[0].vm.$props.maxValue).toBe(attractorHueMaxDefault);
    expect(minMaxInputs[0].vm.$props.min).toBe(hueMinMin);
    expect(minMaxInputs[0].vm.$props.max).toBe(hueMaxMax);
    expect(minMaxInputs[0].vm.$props.step).toBe(1);
    expect(minMaxInputs[0].vm.$props.integerOnly).toBe(true);
    expect(minMaxInputs[0].vm.$props.minLabel).toBe("Minimum hue of attractors color");
    expect(minMaxInputs[0].vm.$props.maxLabel).toBe("Maximum hue of attractors color");
    expect(minMaxInputs[0].vm.$props.level).toBe(6);
    expect(headings5[1].text()).toBe("Saturation strength");
    expect(minMaxInputs[1].vm.$props.minValue).toBe(attractorSaturationStrengthMinDefault);
    expect(minMaxInputs[1].vm.$props.maxValue).toBe(attractorSaturationStrengthMaxDefault);
    expect(minMaxInputs[1].vm.$props.min).toBe(strengthOffsetMinMin);
    expect(minMaxInputs[1].vm.$props.max).toBe(strengthOffsetMaxMax);
    expect(minMaxInputs[1].vm.$props.step).toBe(0.1);
    expect(minMaxInputs[1].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[1].vm.$props.minLabel).toBe(
      "Minimum saturation strength of attractors color"
    );
    expect(minMaxInputs[1].vm.$props.maxLabel).toBe(
      "Maximum saturation strength of attractors color"
    );
    expect(minMaxInputs[1].vm.$props.level).toBe(6);
    expect(headings5[2].text()).toBe("Saturation offset");
    expect(minMaxInputs[2].vm.$props.minValue).toBe(attractorSaturationOffsetMinDefault);
    expect(minMaxInputs[2].vm.$props.maxValue).toBe(attractorSaturationOffsetMaxDefault);
    expect(minMaxInputs[2].vm.$props.min).toBe(strengthOffsetMinMin);
    expect(minMaxInputs[2].vm.$props.max).toBe(strengthOffsetMaxMax);
    expect(minMaxInputs[2].vm.$props.step).toBe(0.1);
    expect(minMaxInputs[2].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[2].vm.$props.minLabel).toBe(
      "Minimum saturation offset of attractors color"
    );
    expect(minMaxInputs[2].vm.$props.maxLabel).toBe(
      "Maximum saturation offset of attractors color"
    );
    expect(minMaxInputs[2].vm.$props.level).toBe(6);
    expect(headings5[3].text()).toBe("Value strength");
    expect(minMaxInputs[3].vm.$props.minValue).toBe(attractorValueStrengthMinDefault);
    expect(minMaxInputs[3].vm.$props.maxValue).toBe(attractorValueStrengthMaxDefault);
    expect(minMaxInputs[3].vm.$props.min).toBe(strengthOffsetMinMin);
    expect(minMaxInputs[3].vm.$props.max).toBe(strengthOffsetMaxMax);
    expect(minMaxInputs[3].vm.$props.step).toBe(0.1);
    expect(minMaxInputs[3].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[3].vm.$props.minLabel).toBe("Minimum value strength of attractors color");
    expect(minMaxInputs[3].vm.$props.maxLabel).toBe("Maximum value strength of attractors color");
    expect(minMaxInputs[3].vm.$props.level).toBe(6);
    expect(headings5[4].text()).toBe("Value offset");
    expect(minMaxInputs[4].vm.$props.minValue).toBe(attractorValueOffsetMinDefault);
    expect(minMaxInputs[4].vm.$props.maxValue).toBe(attractorValueOffsetMaxDefault);
    expect(minMaxInputs[4].vm.$props.min).toBe(strengthOffsetMinMin);
    expect(minMaxInputs[4].vm.$props.max).toBe(strengthOffsetMaxMax);
    expect(minMaxInputs[4].vm.$props.step).toBe(0.1);
    expect(minMaxInputs[4].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[4].vm.$props.minLabel).toBe("Minimum value offset of attractors color");
    expect(minMaxInputs[4].vm.$props.maxLabel).toBe("Maximum value offset of attractors color");
    expect(minMaxInputs[4].vm.$props.level).toBe(6);
  });

  it("renders the advanced settings section correctly", async () => {
    // Mount the RandomPanel
    const randomPanel = mount(RandomPanel, { props: props, shallow: false });

    // Get the DOM elements
    const content = randomPanel.find(".panel-content");
    const advancedSettingsSection = content.find("section:nth-of-type(3)");
    const headerDisclosure = advancedSettingsSection.findComponent(Disclosure);
    const sectionContent = advancedSettingsSection.find(".content");
    const disclosures = sectionContent.findAllComponents(Disclosure);

    // Open all disclosures
    for (let disclosure of disclosures) {
      await disclosure.find("button").trigger("click");
    }

    // Check the section header renders correctly
    expect(headerDisclosure.vm.$props.headingCentered).toBe(false);
    expect(headerDisclosure.vm.$props.headingLevel).toBe(3);
    expect(headerDisclosure.vm.$props.headingText).toBe("Advanced Settings");

    // Check the viewport part renders correctly
    let disclosure = disclosures[0];
    let headings5 = disclosure.findAll("h5");
    let minMaxInputs = disclosure.findAllComponents(MinMaxInput);
    expect(disclosure.vm.$props.headingText).toBe("Viewport");
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(4);
    expect(disclosure.vm.$props.rotateWhenExpand).toBe(true);
    expect(disclosure.vm.$props.buttonTitle).toBe("Show");
    expect(headings5[0].text()).toBe("Scale");
    expect(minMaxInputs[0].vm.$props.minValue).toBe(scaleMinDefault);
    expect(minMaxInputs[0].vm.$props.maxValue).toBe(scaleMaxDefault);
    expect(minMaxInputs[0].vm.$props.min).toBe(scaleMinMin);
    expect(minMaxInputs[0].vm.$props.max).toBe(scaleMaxMax);
    expect(minMaxInputs[0].vm.$props.step).toBe(0.1);
    expect(minMaxInputs[0].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[0].vm.$props.minLabel).toBe("Minimum scale of viewport");
    expect(minMaxInputs[0].vm.$props.maxLabel).toBe("Maximum scale of viewport");
    expect(minMaxInputs[0].vm.$props.level).toBe(6);
    expect(headings5[1].text()).toBe("Center modulus");
    expect(minMaxInputs[1].vm.$props.minValue).toBe(viewportCenterModulusMinDefault);
    expect(minMaxInputs[1].vm.$props.maxValue).toBe(viewportCenterModulusMaxDefault);
    expect(minMaxInputs[1].vm.$props.min).toBe(complexModulusMinMin);
    expect(minMaxInputs[1].vm.$props.max).toBe(complexModulusMaxMax);
    expect(minMaxInputs[1].vm.$props.step).toBe(0.1);
    expect(minMaxInputs[1].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[1].vm.$props.minLabel).toBe("Minimum modulus of viewport center");
    expect(minMaxInputs[1].vm.$props.maxLabel).toBe("Maximum modulus of viewport center");
    expect(minMaxInputs[1].vm.$props.level).toBe(6);

    // Check the computation part renders correctly
    disclosure = disclosures[1];
    headings5 = disclosure.findAll("h5");
    minMaxInputs = disclosure.findAllComponents(MinMaxInput);
    expect(disclosure.vm.$props.headingText).toBe("Computation");
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(4);
    expect(disclosure.vm.$props.rotateWhenExpand).toBe(true);
    expect(disclosure.vm.$props.buttonTitle).toBe("Show");
    expect(headings5[0].text()).toBe("Number of iterations");
    expect(minMaxInputs[0].vm.$props.minValue).toBe(nbIterationsMinDefault);
    expect(minMaxInputs[0].vm.$props.maxValue).toBe(nbIterationsMaxDefault);
    expect(minMaxInputs[0].vm.$props.min).toBe(nbIterationsMinMin);
    expect(minMaxInputs[0].vm.$props.max).toBe(nbIterationsMaxMax);
    expect(minMaxInputs[0].vm.$props.step).toBe(1);
    expect(minMaxInputs[0].vm.$props.integerOnly).toBe(true);
    expect(minMaxInputs[0].vm.$props.minLabel).toBe("Minimum number of iterations");
    expect(minMaxInputs[0].vm.$props.maxLabel).toBe("Maximum number of iterations");
    expect(minMaxInputs[0].vm.$props.level).toBe(6);
    expect(headings5[1].text()).toBe("Epsilon");
    expect(minMaxInputs[1].vm.$props.minValue).toBe(epsilonMinDefault);
    expect(minMaxInputs[1].vm.$props.maxValue).toBe(epsilonMaxDefault);
    expect(minMaxInputs[1].vm.$props.min).toBe(epsilonMinMin);
    expect(minMaxInputs[1].vm.$props.max).toBe(epsilonMaxMax);
    expect(minMaxInputs[1].vm.$props.step).toBe(0.000001);
    expect(minMaxInputs[1].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[1].vm.$props.minLabel).toBe("Minimum value of epsilon");
    expect(minMaxInputs[1].vm.$props.maxLabel).toBe("Maximum value of epsilon");
    expect(minMaxInputs[1].vm.$props.level).toBe(6);
    expect(headings5[2].text()).toBe("Julia bound");
    expect(minMaxInputs[2].vm.$props.minValue).toBe(juliaBoundMinDefault);
    expect(minMaxInputs[2].vm.$props.maxValue).toBe(juliaBoundMaxDefault);
    expect(minMaxInputs[2].vm.$props.min).toBe(juliaBoundMinMin);
    expect(minMaxInputs[2].vm.$props.max).toBe(juliaBoundMaxMax);
    expect(minMaxInputs[2].vm.$props.step).toBe(0.1);
    expect(minMaxInputs[2].vm.$props.integerOnly).toBe(false);
    expect(minMaxInputs[2].vm.$props.minLabel).toBe("Minimum value of the Julia bound");
    expect(minMaxInputs[2].vm.$props.maxLabel).toBe("Maximum value of the Julia bound");
    expect(minMaxInputs[2].vm.$props.level).toBe(6);
  });

  it("renders the randomize button correctly", () => {
    // Mount the RandomPanel
    const randomPanel = mount(RandomPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = randomPanel.find(".panel-content");
    const buttonSection = content.find("section:nth-of-type(4)");
    const button = buttonSection.findComponent(IconTextButton);

    // Check the button renders correctly
    expect(button.vm.$props.text).toBe("Randomize");
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    props = {
      configuration: Configuration.defaultConfiguration(),
    };
  });

  it("randomizes correctly", async () => {
    // Mount the RandomPanel
    const randomPanel = mount(RandomPanel, { props: props, shallow: false });

    // Mock the configuration randomize function
    props.configuration.randomize = vi.fn();

    // Open all disclosures
    const disclosures = randomPanel.findAllComponents(Disclosure);
    for (let disclosure of disclosures) {
      let button = disclosure.find("button");
      if (button.exists()) {
        await button.trigger("click");
      }
    }

    // Get the DOM elements
    const multiComboBoxes = randomPanel.findAllComponents(MultiComboBox);
    const minMaxInputs = randomPanel.findAllComponents(MinMaxInput);
    const randomizeButton = randomPanel.findComponent(IconTextButton);

    // Select the function and coefficient types
    const newFunctionTypes = new Set(["functionType"]);
    multiComboBoxes[0].vm.$emit("update:selected", newFunctionTypes);
    const newCoefficientTypes = new Set(["coefficientTypes"]);
    multiComboBoxes[1].vm.$emit("update:selected", newCoefficientTypes);

    // Select the min and max
    for (let m = 0; m < minMaxInputs.length; m++) {
      minMaxInputs[m].vm.$emit("update:minValue", 2 * m);
      minMaxInputs[m].vm.$emit("update:maxValue", 2 * m + 1);
      await randomPanel.vm.$nextTick();
    }

    // Click the randomize button
    randomizeButton.vm.$emit("click");

    // Check randomize is called correctly
    expect(props.configuration.randomize).toBeCalledWith(
      newFunctionTypes,
      newCoefficientTypes,
      { min: 0, max: 1 },
      { min: 2, max: 3 },
      { min: 4, max: 5 },
      { min: 6, max: 7 },
      { min: 8, max: 9 },
      { min: 10, max: 11 },
      { min: 12, max: 13 },
      { min: 14, max: 15 },
      { min: 16, max: 17 },
      { min: 18, max: 19 },
      { min: 20, max: 21 },
      { min: 22, max: 23 },
      { min: 24, max: 25 },
      { min: 26, max: 27 },
      { min: 28, max: 29 },
      { min: 30, max: 31 },
      { min: 32, max: 33 },
      { min: 34, max: 35 },
      { min: 36, max: 37 },
      { min: 38, max: 39 },
      { min: 40, max: 41 },
      { min: 42, max: 43 },
      { min: 44, max: 45 },
      { min: 46, max: 47 },
      { min: 48, max: 49 }
    );
  });
});
