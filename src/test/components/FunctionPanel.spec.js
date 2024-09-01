import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { FractalFunction } from "@/models/FractalFunction";
import { Polynomial } from "@/models/Polynomial";
import { ComplexCircle } from "@/models/ComplexCircle";
import { Complex } from "@/models/Complex";
import { FunctionTypes } from "@/constants/FunctionTypes";

import FunctionPanel from "@/components/FunctionPanel.vue";
import Disclosure from "@/components/Disclosure.vue";
import ComboBox from "@/components/ComboBox.vue";
import CoefficientInput from "@/components/CoefficientInput.vue";
import CoefficientItem from "@/components/CoefficientItem.vue";
import IconTextButton from "@/components/IconTextButton.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      fractalFunction: new FractalFunction(
        new Polynomial({
          0: new ComplexCircle(new Complex(0, 0), 1, 2000),
          2: new Complex(1, 0),
        }),
        new Polynomial(),
        FunctionTypes.DEFAULT,
        new Complex(1, 0)
      ),
    };
  });

  it("renders the header correctly", () => {
    // Mount the FunctionPanel
    const functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    const header = functionPanel.find("header");
    const disclosure = header.findComponent(Disclosure);

    // Check the header renders correctly
    expect(disclosure.vm.$props.headingCentered).toBe(true);
    expect(disclosure.vm.$props.headingLevel).toBe(2);
    expect(disclosure.vm.$props.headingText).toBe("Function");
  });

  it("renders the equation section correctly", () => {
    // Mount the FunctionPanel
    const functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = functionPanel.find(".panel-content");
    const equationSection = content.find("section:nth-of-type(1)");
    const equation = equationSection.find(".equation");

    // Check the equation renders correctly
    const expectedMathML = props.fractalFunction
      .toMathML()
      .replaceAll("<mspace width='1em'/>", "<mspace width='1em'></mspace>")
      .replaceAll("'", '"');
    expect(equation.html({ raw: true })).toContain(expectedMathML);
  });

  it("renders the type section correctly", () => {
    // Mount the FunctionPanel with a DEFAULT function
    let functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = functionPanel.find(".panel-content");
    let typeSection = content.find("section:nth-of-type(2)");
    let disclosure = typeSection.findComponent(Disclosure);
    let sectionContent = typeSection.find(".content");
    let subHeadings = sectionContent.findAll("h4");
    let comboBox = sectionContent.findComponent(ComboBox);
    let coefficientInput = sectionContent.findComponent(CoefficientInput);

    // Check the info header renders correctly
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(3);
    expect(disclosure.vm.$props.headingText).toBe("Function type");

    // Check the section content renders correctly
    expect(subHeadings.length).toBe(1);
    expect(subHeadings[0].text()).toBe("Type");
    expect(comboBox.vm.$props.options).toEqual([
      { id: FunctionTypes.DEFAULT, text: "Default" },
      { id: FunctionTypes.NEWTON, text: "Newton" },
      { id: FunctionTypes.FRACTION, text: "Fraction" },
    ]);
    expect(comboBox.vm.$props.selected).toBe(props.fractalFunction.functionType);
    expect(comboBox.vm.$props.label).toBe("Function type");
    expect(coefficientInput.exists()).toBe(false);

    // Mount the FunctionPanel with a NEWTON function
    props.fractalFunction.setFunctionType(FunctionTypes.NEWTON);
    functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    content = functionPanel.find(".panel-content");
    typeSection = content.find("section:nth-of-type(2)");
    disclosure = typeSection.findComponent(Disclosure);
    sectionContent = typeSection.find(".content");
    subHeadings = sectionContent.findAll("h4");
    comboBox = sectionContent.findComponent(ComboBox);
    coefficientInput = sectionContent.findComponent(CoefficientInput);

    // Check the section content renders correctly
    expect(subHeadings.length).toBe(2);
    expect(comboBox.vm.$props.selected).toBe(props.fractalFunction.functionType);
    expect(subHeadings[1].text()).toBe("Newton coefficient");
    expect(coefficientInput.exists()).toBe(true);
    expect(coefficientInput.vm.$props.coefficient).toEqual(props.fractalFunction.newtonCoefficient);
    expect(coefficientInput.vm.$props.level).toBe(5);
  });

  it("renders the numerator section correctly", () => {
    // Mount the FunctionPanel with a DEFAULT function
    let functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = functionPanel.find(".panel-content");
    let numeratorSection = content.find("section:nth-of-type(3)");
    let disclosure = numeratorSection.findComponent(Disclosure);
    let coefficientItems = numeratorSection.findAllComponents(CoefficientItem);
    let addButton = numeratorSection.findComponent(IconTextButton);

    // Check the info header renders correctly
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(3);
    expect(disclosure.vm.$props.headingText).toBe("Coefficients");

    // Check the coefficient items render correctly
    coefficientItems.forEach((item) => {
      expect(item.classes()).toContain("coefficient-item");
    });
    expect(coefficientItems.length).toBe(2);
    expect(coefficientItems[0].vm.$props.degree).toBe(0);
    expect(coefficientItems[0].vm.$props.coefficient).toEqual(
      props.fractalFunction.getCoefficient(0, true)
    );
    expect(coefficientItems[0].vm.$props.availablePowers).toEqual(
      props.fractalFunction.numerator.getAvailablePowers()
    );
    expect(coefficientItems[1].vm.$props.degree).toBe(2);
    expect(coefficientItems[1].vm.$props.coefficient).toEqual(
      props.fractalFunction.getCoefficient(2, true)
    );
    expect(coefficientItems[1].vm.$props.availablePowers).toEqual(
      props.fractalFunction.numerator.getAvailablePowers()
    );

    // Check the add button renders correctly
    expect(addButton.exists()).toBe(true);
    expect(addButton.vm.$props.text).toBe("New Coefficient");

    // Mount the FunctionPanel with a FRACTION function
    props.fractalFunction.setFunctionType(FunctionTypes.FRACTION);
    functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    content = functionPanel.find(".panel-content");
    numeratorSection = content.find("section:nth-of-type(3)");
    disclosure = numeratorSection.findComponent(Disclosure);

    // Check the info header renders correctly
    expect(disclosure.vm.$props.headingText).toBe("Numerator coefficients");

    // Mount the FunctionPanel with a full numerator
    props.fractalFunction = new FractalFunction(
      new Polynomial({
        0: new Complex(0, 0),
        1: new Complex(0, 0),
        2: new Complex(0, 0),
        3: new Complex(0, 0),
        4: new Complex(0, 0),
        5: new Complex(0, 0),
        6: new Complex(0, 0),
        7: new Complex(0, 0),
        8: new Complex(0, 0),
        9: new Complex(0, 0),
        10: new Complex(0, 0),
        11: new Complex(0, 0),
        12: new Complex(0, 0),
        13: new Complex(0, 0),
        14: new Complex(0, 0),
        15: new Complex(0, 0),
      }),
      new Polynomial(),
      FunctionTypes.DEFAULT,
      new Complex(1, 0)
    );
    functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    content = functionPanel.find(".panel-content");
    numeratorSection = content.find("section:nth-of-type(3)");
    addButton = numeratorSection.findComponent(IconTextButton);

    // Check the add does not exist
    expect(addButton.exists()).toBe(false);
  });

  it("renders the numerator section correctly", () => {
    // Mount the FunctionPanel with a DEFAULT function
    let functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = functionPanel.find(".panel-content");
    let denominatorSection = content.find("section:nth-of-type(4)");

    // Check the denominator section does no exist
    expect(denominatorSection.exists()).toBe(false);

    // Mount the FunctionPanel with a NEWTON function
    props.fractalFunction.setFunctionType(FunctionTypes.NEWTON);
    functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    content = functionPanel.find(".panel-content");
    denominatorSection = content.find("section:nth-of-type(4)");

    // Check the denominator section does no exist
    expect(denominatorSection.exists()).toBe(false);

    // Mount the FunctionPanel with a FRACTION function
    props.fractalFunction.setFunctionType(FunctionTypes.FRACTION);
    functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    content = functionPanel.find(".panel-content");
    denominatorSection = content.find("section:nth-of-type(4)");
    let disclosure = denominatorSection.findComponent(Disclosure);
    let coefficientItems = denominatorSection.findAllComponents(CoefficientItem);
    let addButton = denominatorSection.findComponent(IconTextButton);

    // Check the denominator section exists
    expect(denominatorSection.exists()).toBe(true);

    // Check the info header renders correctly
    expect(disclosure.vm.$props.headingCentered).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(3);
    expect(disclosure.vm.$props.headingText).toBe("Denominator coefficients");

    // Check the coefficient items render correctly
    coefficientItems.forEach((item) => {
      expect(item.classes()).toContain("coefficient-item");
    });
    expect(coefficientItems.length).toBe(1);
    expect(coefficientItems[0].vm.$props.degree).toBe(0);
    expect(coefficientItems[0].vm.$props.coefficient).toEqual(
      props.fractalFunction.getCoefficient(0, false)
    );
    expect(coefficientItems[0].vm.$props.availablePowers).toEqual(
      props.fractalFunction.denominator.getAvailablePowers()
    );

    // Check the add button renders correctly
    expect(addButton.exists()).toBe(true);
    expect(addButton.vm.$props.text).toBe("New Coefficient");

    // Mount the FunctionPanel with a full denominator
    props.fractalFunction = new FractalFunction(
      new Polynomial(),
      new Polynomial({
        0: new Complex(0, 0),
        1: new Complex(0, 0),
        2: new Complex(0, 0),
        3: new Complex(0, 0),
        4: new Complex(0, 0),
        5: new Complex(0, 0),
        6: new Complex(0, 0),
        7: new Complex(0, 0),
        8: new Complex(0, 0),
        9: new Complex(0, 0),
        10: new Complex(0, 0),
        11: new Complex(0, 0),
        12: new Complex(0, 0),
        13: new Complex(0, 0),
        14: new Complex(0, 0),
        15: new Complex(0, 0),
      }),
      FunctionTypes.FRACTION,
      new Complex(1, 0)
    );
    functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    content = functionPanel.find(".panel-content");
    denominatorSection = content.find("section:nth-of-type(4)");
    addButton = denominatorSection.findComponent(IconTextButton);

    // Check the add does not exist
    expect(addButton.exists()).toBe(false);
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    props = {
      fractalFunction: new FractalFunction(
        new Polynomial({
          0: new ComplexCircle(new Complex(0, 0), 1, 2000),
          2: new Complex(1, 0),
        }),
        new Polynomial(),
        FunctionTypes.DEFAULT,
        new Complex(1, 0)
      ),
    };
  });

  it("changes the function type with the type combobox", () => {
    // Mount the FunctionPanel
    const functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = functionPanel.find(".panel-content");
    let typeSection = content.find("section:nth-of-type(2)");
    let sectionContent = typeSection.find(".content");
    let comboBox = sectionContent.findComponent(ComboBox);

    // Make the combobox emits an update event
    const newFunctionType = FunctionTypes.FRACTION;
    comboBox.vm.$emit("update:selected", newFunctionType);

    // Check the function type has changed accordingly
    expect(props.fractalFunction.functionType).toBe(newFunctionType);
    expect(functionPanel.emitted().change).toBeDefined();
  });

  it("changes the newton coefficient with the newton coefficient input", () => {
    // Mount the FunctionPanel
    props.fractalFunction.setFunctionType(FunctionTypes.NEWTON);
    const functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = functionPanel.find(".panel-content");
    let typeSection = content.find("section:nth-of-type(2)");
    let sectionContent = typeSection.find(".content");
    let coefficientInput = sectionContent.findComponent(CoefficientInput);

    // Make the coefficientInput emits an update event
    const newNewtonCoefficient = new Complex(3, 6);
    coefficientInput.vm.$emit("update:coefficient", newNewtonCoefficient);

    // Check the newton coefficient has changed accordingly
    expect(props.fractalFunction.newtonCoefficient).toEqual(newNewtonCoefficient);
    expect(functionPanel.emitted().change).toBeDefined();
  });

  it("changes the numerator coefficient degree with the coefficient item", () => {
    // Mount the FunctionPanel
    const functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = functionPanel.find(".panel-content");
    let numeratorSection = content.find("section:nth-of-type(3)");
    let coefficientItems = numeratorSection.findAllComponents(CoefficientItem);

    // Make the coefficientInput emits an update event
    const oldDegree = 0;
    const newDegree = 5;
    const oldCoefficient = props.fractalFunction.getCoefficient(oldDegree, true);
    coefficientItems[0].vm.$emit("update:degree", newDegree);

    // Check the numerator has changed accordingly
    expect(props.fractalFunction.getCoefficient(oldDegree, true)).toBeNull();
    expect(props.fractalFunction.getCoefficient(newDegree, true)).toEqual(oldCoefficient);
    expect(functionPanel.emitted().change).toBeDefined();
  });

  it("changes the numerator coefficient value with the coefficient item", () => {
    // Mount the FunctionPanel
    const functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = functionPanel.find(".panel-content");
    let numeratorSection = content.find("section:nth-of-type(3)");
    let coefficientItems = numeratorSection.findAllComponents(CoefficientItem);

    // Make the coefficientItem emits an update event
    const newCoefficient = new Complex(3, 6);
    coefficientItems[0].vm.$emit("update:coefficient", newCoefficient);

    // Check the numerator has changed accordingly
    expect(props.fractalFunction.getCoefficient(0, true)).toEqual(newCoefficient);
    expect(functionPanel.emitted().change).toBeDefined();
  });

  it("deletes the numerator coefficient with the coefficient item", () => {
    // Mount the FunctionPanel
    const functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = functionPanel.find(".panel-content");
    let numeratorSection = content.find("section:nth-of-type(3)");
    let coefficientItems = numeratorSection.findAllComponents(CoefficientItem);

    // Make the coefficientItem emits an update event
    coefficientItems[0].vm.$emit("delete:coefficient");

    // Check the numerator has changed accordingly
    expect(props.fractalFunction.getCoefficient(0, true)).toBeNull();
    expect(functionPanel.emitted().change).toBeDefined();
  });

  it("adds a numerator coefficient with the add button", () => {
    // Mount the FunctionPanel
    const functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = functionPanel.find(".panel-content");
    let numeratorSection = content.find("section:nth-of-type(3)");
    let addButton = numeratorSection.findComponent(IconTextButton);

    // Click the addButton
    addButton.trigger("click");

    // Check the numerator has changed accordingly
    expect(props.fractalFunction.getCoefficient(1, true)).toEqual(new Complex(0, 0));
    expect(functionPanel.emitted().change).toBeDefined();
  });

  it("changes the denominator coefficient degree with the coefficient item", () => {
    // Mount the FunctionPanel
    props.fractalFunction.setFunctionType(FunctionTypes.FRACTION);
    const functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = functionPanel.find(".panel-content");
    let denominatorSection = content.find("section:nth-of-type(4)");
    let coefficientItems = denominatorSection.findAllComponents(CoefficientItem);

    // Make the coefficientInput emits an update event
    const oldDegree = 0;
    const newDegree = 5;
    const oldCoefficient = props.fractalFunction.getCoefficient(oldDegree, false);
    coefficientItems[0].vm.$emit("update:degree", newDegree);

    // Check the denominator has changed accordingly
    expect(props.fractalFunction.getCoefficient(oldDegree, false)).toBeNull();
    expect(props.fractalFunction.getCoefficient(newDegree, false)).toEqual(oldCoefficient);
    expect(functionPanel.emitted().change).toBeDefined();
  });

  it("changes the denominator coefficient value with the coefficient item", () => {
    // Mount the FunctionPanel
    props.fractalFunction.setFunctionType(FunctionTypes.FRACTION);
    const functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = functionPanel.find(".panel-content");
    let denominatorSection = content.find("section:nth-of-type(4)");
    let coefficientItems = denominatorSection.findAllComponents(CoefficientItem);

    // Make the coefficientItem emits an update event
    const newCoefficient = new Complex(3, 6);
    coefficientItems[0].vm.$emit("update:coefficient", newCoefficient);

    // Check the denominator has changed accordingly
    expect(props.fractalFunction.getCoefficient(0, false)).toEqual(newCoefficient);
    expect(functionPanel.emitted().change).toBeDefined();
  });

  it("deletes the denominator coefficient with the coefficient item", () => {
    // Mount the FunctionPanel
    props.fractalFunction.setFunctionType(FunctionTypes.FRACTION);
    const functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = functionPanel.find(".panel-content");
    let denominatorSection = content.find("section:nth-of-type(4)");
    let coefficientItems = denominatorSection.findAllComponents(CoefficientItem);

    // Make the coefficientItem emits an update event
    coefficientItems[0].vm.$emit("delete:coefficient");

    // Check the denominator has changed accordingly
    expect(props.fractalFunction.getCoefficient(0, false)).toBeNull();
    expect(functionPanel.emitted().change).toBeDefined();
  });

  it("adds a denominator coefficient with the add button", () => {
    // Mount the FunctionPanel
    props.fractalFunction.setFunctionType(FunctionTypes.FRACTION);
    const functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = functionPanel.find(".panel-content");
    let denominatorSection = content.find("section:nth-of-type(4)");
    let addButton = denominatorSection.findComponent(IconTextButton);

    // Click the addButton
    addButton.trigger("click");

    // Check the denominator has changed accordingly
    expect(props.fractalFunction.getCoefficient(1, false)).toEqual(new Complex(0, 0));
    expect(functionPanel.emitted().change).toBeDefined();
  });

  it("does not change the coefficient degree with the coefficient item if the degree is the same as before", () => {
    // Mount the FunctionPanel
    const functionPanel = mount(FunctionPanel, { props: props, shallow: true });

    // Get the DOM elements
    let content = functionPanel.find(".panel-content");
    let numeratorSection = content.find("section:nth-of-type(3)");
    let coefficientItems = numeratorSection.findAllComponents(CoefficientItem);

    // Make the coefficientInput emits an update event
    const oldDegree = 0;
    const oldCoefficient = props.fractalFunction.getCoefficient(oldDegree, true);
    coefficientItems[0].vm.$emit("update:degree", oldDegree);

    // Check the numerator has changed accordingly
    expect(props.fractalFunction.getCoefficient(oldDegree, true)).toEqual(oldCoefficient);
  });
});
