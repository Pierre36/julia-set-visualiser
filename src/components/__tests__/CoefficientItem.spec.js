import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { Complex } from "../../models/Complex";

import CoefficientInput from "../CoefficientInput.vue";
import CoefficientItem from "../CoefficientItem.vue";
import ComboBox from "../ComboBox.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      degree: 6,
      coefficient: new Complex(3, 6),
      availablePowers: ["1", "2", "3"],
    };
  });

  it("displays a combobox to change the degree", () => {
    // Mount the CoefficientItem
    const coefficientItem = mount(CoefficientItem, { props: props });

    // Get the DOM element
    const degreeDiv = coefficientItem.find(".degreePicker");
    const degreeTitle = degreeDiv.find("span");
    const degreeCombobBox = degreeDiv.findComponent(ComboBox);

    // Check the title is correct
    expect(degreeTitle.text()).toBe("Degree");

    // Check the ComboBox is rendered correctly
    expect(degreeCombobBox.vm.$props.options).toEqual([
      { id: "1", text: "1" },
      { id: "2", text: "2" },
      { id: "3", text: "3" },
      { id: "6", text: "6" },
    ]);
    expect(degreeCombobBox.vm.$props.selected).toBe(props.degree.toString());
    expect(degreeCombobBox.vm.$props.label).toBe("Coefficient degree");
  });

  it("displays a button to remove the coefficient", () => {
    // Mount the CoefficientItem
    const coefficientItem = mount(CoefficientItem, { props: props });

    // Get the button
    const degreeDiv = coefficientItem.find(".degreePicker");
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
    expect(coefficientInput.vm.$props.coefficient).toEqual(props.coefficient);
    expect(coefficientInput.vm.$props.level).toEqual(4);
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    props = {
      degree: 6,
      coefficient: new Complex(3, 6),
      availablePowers: ["1", "2", "3"],
    };
  });

  it("emits an event when changing the degree", () => {
    // Mount the CoefficientItem
    const coefficientItem = mount(CoefficientItem, { props: props });

    // Get the DOM element
    const degreeDiv = coefficientItem.find(".degreePicker");
    const degreeCombobBox = degreeDiv.findComponent(ComboBox);

    // Change the degree
    const newDegree = "2";
    degreeCombobBox.vm.$emit("update:selected", newDegree);

    // Check an event is emitted
    expect(coefficientItem.emitted()["update:degree"]).toEqual([[newDegree]]);
  });

  it("emits an event when clicking the remove button", () => {
    // Mount the CoefficientItem
    const coefficientItem = mount(CoefficientItem, { props: props });

    // Get the button
    const degreeDiv = coefficientItem.find(".degreePicker");
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
