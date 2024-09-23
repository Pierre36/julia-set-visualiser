import { describe, it, expect, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import Complex from "@/models/Complex";
import CoefficientInput from "@/components/CoefficientInput.vue";
import CoefficientItem, { type Props } from "@/components/CoefficientItem.vue";
import ComboBox from "@/components/ComboBox.vue";
import type Coefficient from "@/models/Coefficient";

interface TestProps extends Props {
  coefficient: Coefficient;
  degree: number;
}

let props: TestProps;

const degree = 6;
const coefficient = new Complex(3, 6);
const availablePowers = [1, 2, 3];

describe("Render", () => {
  beforeEach(() => {
    props = { degree: degree, coefficient: coefficient, availablePowers: availablePowers };
  });

  it("displays a combobox to change the degree", () => {
    // Mount the CoefficientItem
    const coefficientItem = mount(CoefficientItem, { props: props });

    // Get the DOM element
    const degreeDiv = coefficientItem.find(".degree-picker");
    const degreeTitle = degreeDiv.find("span");
    // @ts-ignore
    const degreeComboBox: VueWrapper<ComboBox> = degreeDiv.findComponent(ComboBox);

    // Check the title is correct
    expect(degreeTitle.text()).toBe("Degree");

    // Check the ComboBox is rendered correctly
    expect(degreeComboBox.vm.$props.options).toEqual([
      { id: 1, text: "1" },
      { id: 2, text: "2" },
      { id: 3, text: "3" },
      { id: 6, text: "6" },
    ]);
    expect(degreeComboBox.vm.$props.selected).toBe(degree);
    expect(degreeComboBox.vm.$props.label).toBe("Coefficient degree");
  });

  it("displays a button to remove the coefficient", () => {
    // Mount the CoefficientItem
    const coefficientItem = mount(CoefficientItem, { props: props });

    // Get the button
    const degreeDiv = coefficientItem.find(".degree-picker");
    const removeButton = degreeDiv.find({ ref: "removeButton" });

    // Check the button is rendered correctly
    expect(removeButton.find("svg").find("title").text()).toBe("Remove coefficient");
  });

  it("displays a CoefficientInput to change the coefficient", () => {
    // Mount the CoefficientItem
    const coefficientItem = mount(CoefficientItem, { props: props });

    // Get the CoefficientInput
    const coefficientInput = coefficientItem.findComponent(CoefficientInput);

    // Check the CoefficientInput is rendered correctly
    expect(coefficientInput.vm.$props.coefficient).toEqual(coefficient);
    expect(coefficientInput.vm.$props.level).toEqual(4);
  });
});

describe("Interactions", () => {
  beforeEach(() => {
    props = { degree: degree, coefficient: coefficient, availablePowers: availablePowers };
  });

  it("emits an event when changing the degree", () => {
    // Mount the CoefficientItem
    const coefficientItem = mount(CoefficientItem, { props: props });

    // Get the DOM element
    const degreeDiv = coefficientItem.find(".degree-picker");
    // @ts-ignore
    const degreeComboBox: VueWrapper<ComboBox> = degreeDiv.findComponent(ComboBox);

    // Change the degree
    const newDegree = "2";
    degreeComboBox.vm.$emit("update:selected", newDegree);

    // Check an event is emitted
    expect(coefficientItem.emitted()["update:degree"]).toEqual([[newDegree]]);
  });

  it("emits an event when clicking the remove button", () => {
    // Mount the CoefficientItem
    const coefficientItem = mount(CoefficientItem, { props: props });

    // Get the button
    const degreeDiv = coefficientItem.find(".degree-picker");
    const removeButton = degreeDiv.find({ ref: "removeButton" });

    // Click the button
    removeButton.trigger("click");

    // Check an event is emitted
    expect(coefficientItem.emitted()["delete:coefficient"]).toBeDefined();
  });

  it("emits an event when changing the coefficient", () => {
    // Mount the CoefficientItem
    const coefficientItem = mount(CoefficientItem, { props: props });

    // Get the CoefficientInput
    const coefficientInput = coefficientItem.findComponent(CoefficientInput);

    // Update the coefficient
    const newCoefficient = new Complex(4, 2);
    coefficientInput.vm.$emit("update:coefficient", newCoefficient);

    // Check an event is emitted
    expect(coefficientItem.emitted()["update:coefficient"]).toEqual([[newCoefficient]]);
  });
});
