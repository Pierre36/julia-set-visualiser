import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { Complex } from "../../models/Complex";
import { ComplexCircle } from "../../models/ComplexCircle";
import { ComplexLine } from "../../models/ComplexLine";

import CoefficientInput from "../CoefficientInput.vue";
import ComboBox from "../ComboBox.vue";
import ComplexInput from "../ComplexInput.vue";
import NumberInput from "../NumberInput.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      coefficient: new Complex(3, 6),
      level: 1,
    };
  });

  it("displays a combobox to choose the type of coefficient", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const firstHeading = coefficientInput.findAll("h" + props.level)[0];
    expect(firstHeading.text()).toBe("Type");
    const firstComboBox = coefficientInput.findAllComponents(ComboBox)[0];
    expect(firstComboBox.vm.$props.options).toEqual([
      { id: "CONSTANT", text: "Constant" },
      { id: "CIRCLE", text: "Circle" },
      { id: "LINE", text: "Line" },
    ]);
    expect(firstComboBox.vm.$props.label).toBe("Coefficient type");
  });
});

describe("Render for type CONSTANT", () => {
  let props;

  beforeEach(() => {
    props = {
      coefficient: new Complex(3, 6),
      level: 2,
    };
  });

  it("is has the correct level of headings", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    for (let i = 1; i < 6 && i != props.level; i++) {
      expect(coefficientInput.findAll("h" + i).length).toBe(0);
    }
    expect(coefficientInput.findAll("h" + props.level).length).toBe(2);
  });

  it("has a type combobox with the correct type", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const firstComboBox = coefficientInput.findAllComponents(ComboBox)[0];
    expect(firstComboBox.vm.$props.selected).toBe("CONSTANT");
  });

  it("has a complex input for the value of the constant", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const secondHeading = coefficientInput.findAll("h" + props.level)[1];
    expect(secondHeading.text()).toBe("Value");
    const complexInput = coefficientInput.findComponent(ComplexInput);
    expect(complexInput.vm.$props.complex).toEqual(props.coefficient);
    expect(complexInput.vm.$props.label).toBe("Coefficient value");
  });
});

describe("Render for type CIRCLE", () => {
  let props;

  beforeEach(() => {
    props = {
      coefficient: new ComplexCircle(new Complex(3, 6), 42, 2000),
      level: 3,
    };
  });

  it("is has the correct level of headings", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    for (let i = 1; i < 6 && i != props.level; i++) {
      expect(coefficientInput.findAll("h" + i).length).toBe(0);
    }
    expect(coefficientInput.findAll("h" + props.level).length).toBe(4);
  });

  it("has a type combobox with the correct type", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const firstComboBox = coefficientInput.findAllComponents(ComboBox)[0];
    expect(firstComboBox.vm.$props.selected).toBe("CIRCLE");
  });

  it("has a complex input for the center of the circle", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const secondHeading = coefficientInput.findAll("h" + props.level)[1];
    expect(secondHeading.text()).toBe("Center");
    const complexInput = coefficientInput.findComponent(ComplexInput);
    expect(complexInput.vm.$props.complex).toEqual(props.coefficient.center);
    expect(complexInput.vm.$props.label).toBe("Circle center");
  });

  it("has a number input for the radius of the circle", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const thirdHeading = coefficientInput.findAll("h" + props.level)[2];
    expect(thirdHeading.text()).toBe("Radius");
    const numberInput = coefficientInput.findAllComponents(NumberInput)[0];
    expect(numberInput.vm.$props.value).toEqual(props.coefficient.radius);
    expect(numberInput.vm.$props.min).toBe(0);
    expect(numberInput.vm.$props.max).toBeUndefined();
    expect(numberInput.vm.$props.step).toBe(0.1);
    expect(numberInput.vm.$props.integerOnly).toBe(false);
    expect(numberInput.vm.$props.wrongInputMessage).toBe("Please enter a valid number");
    expect(numberInput.vm.$props.label).toBe("Circle radius");
  });

  it("has a number input for the duration of the animation", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const fourthHeading = coefficientInput.findAll("h" + props.level)[3];
    expect(fourthHeading.text()).toBe("Duration");
    const numberInput = coefficientInput.findAllComponents(NumberInput)[1];
    expect(numberInput.vm.$props.value).toEqual(props.coefficient.duration / 1000);
    expect(numberInput.vm.$props.min).toBe(0);
    expect(numberInput.vm.$props.max).toBeUndefined();
    expect(numberInput.vm.$props.step).toBe(1);
    expect(numberInput.vm.$props.integerOnly).toBe(false);
    expect(numberInput.vm.$props.wrongInputMessage).toBe("Please enter a valid number");
    expect(numberInput.vm.$props.label).toBe("Duration");
  });
});

describe("Render for type LINE", () => {
  let props;

  beforeEach(() => {
    props = {
      coefficient: new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000),
      level: 3,
    };
  });

  it("is has the correct level of headings", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    for (let i = 1; i < 6 && i != props.level; i++) {
      expect(coefficientInput.findAll("h" + i).length).toBe(0);
    }
    expect(coefficientInput.findAll("h" + props.level).length).toBe(4);
  });

  it("has a type combobox with the correct type", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const firstComboBox = coefficientInput.findAllComponents(ComboBox)[0];
    expect(firstComboBox.vm.$props.selected).toBe("LINE");
  });

  it("has a complex input for the start of the line", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const secondHeading = coefficientInput.findAll("h" + props.level)[1];
    expect(secondHeading.text()).toBe("Start");
    const complexInput = coefficientInput.findAllComponents(ComplexInput)[0];
    expect(complexInput.vm.$props.complex).toEqual(props.coefficient.start);
    expect(complexInput.vm.$props.label).toBe("Line start");
  });

  it("has a complex input for the end of the line", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const secondHeading = coefficientInput.findAll("h" + props.level)[2];
    expect(secondHeading.text()).toBe("End");
    const complexInput = coefficientInput.findAllComponents(ComplexInput)[1];
    expect(complexInput.vm.$props.complex).toEqual(props.coefficient.end);
    expect(complexInput.vm.$props.label).toBe("Line end");
  });

  it("has a number input for the duration of the animation", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const fourthHeading = coefficientInput.findAll("h" + props.level)[3];
    expect(fourthHeading.text()).toBe("Duration");
    const numberInput = coefficientInput.findAllComponents(NumberInput)[0];
    expect(numberInput.vm.$props.value).toEqual(props.coefficient.duration / 1000);
    expect(numberInput.vm.$props.min).toBe(0);
    expect(numberInput.vm.$props.max).toBeUndefined();
    expect(numberInput.vm.$props.step).toBe(1);
    expect(numberInput.vm.$props.integerOnly).toBe(false);
    expect(numberInput.vm.$props.wrongInputMessage).toBe("Please enter a valid number");
    expect(numberInput.vm.$props.label).toBe("Duration");
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    props = {
      coefficient: new Complex(3, 6),
      level: 4,
    };
  });

  it("correctly changes type to CIRCLE", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const typeComboBox = coefficientInput.findAllComponents(ComboBox)[0];
    typeComboBox.vm.$emit("update:selected", "CIRCLE");
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([
      [new ComplexCircle(new Complex(0, 0), 1, 5000)],
    ]);
  });

  it("correctly changes type to LINE", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const typeComboBox = coefficientInput.findAllComponents(ComboBox)[0];
    typeComboBox.vm.$emit("update:selected", "LINE");
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([
      [new ComplexLine(new Complex(-1, 0), new Complex(1, 0), 5000)],
    ]);
  });

  it("correctly changes type to CONSTANT", async () => {
    props.coefficient = new ComplexCircle(new Complex(0, 0), 1, 2000);
    const coefficientInput = mount(CoefficientInput, { props: props });
    const typeComboBox = coefficientInput.findAllComponents(ComboBox)[0];
    typeComboBox.vm.$emit("update:selected", "CONSTANT");
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([[new Complex(0, 0)]]);
  });
});

describe("Interactions for type CONSTANT", () => {
  let props;

  beforeEach(() => {
    props = {
      coefficient: new Complex(3, 6),
      level: 5,
    };
  });

  it("correctly changes the value of the CONSTANT", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const complexInput = coefficientInput.findComponent(ComplexInput);
    const newValue = new Complex(4, 2);
    complexInput.vm.$emit("update:complex", newValue);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([[newValue]]);
  });
});

describe("Interactions for type CIRCLE", () => {
  let props;

  beforeEach(() => {
    props = {
      coefficient: new ComplexCircle(new Complex(3, 6), 42, 2000),
      level: 1,
    };
  });

  it("correctly changes the center of the CIRCLE", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const complexInput = coefficientInput.findComponent(ComplexInput);
    const newCenter = new Complex(4, 2);
    complexInput.vm.$emit("update:complex", newCenter);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([
      [new ComplexCircle(newCenter, props.coefficient.radius, props.coefficient.duration)],
    ]);
  });

  it("correctly changes the radius of the CIRCLE", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const numberInput = coefficientInput.findAllComponents(NumberInput)[0];
    const newRadius = 36;
    numberInput.vm.$emit("update:value", newRadius);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([
      [new ComplexCircle(props.coefficient.center, newRadius, props.coefficient.duration)],
    ]);
  });

  it("correctly changes the duration of the animation", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const numberInput = coefficientInput.findAllComponents(NumberInput)[1];
    const newDuration = 1000;
    numberInput.vm.$emit("update:value", newDuration);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([
      [new ComplexCircle(props.coefficient.center, props.coefficient.radius, newDuration * 1000)],
    ]);
  });
});

describe("Interactions for type LINE", () => {
  let props;

  beforeEach(() => {
    props = {
      coefficient: new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000),
      level: 1,
    };
  });

  it("correctly changes the start of the LINE", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const complexInput = coefficientInput.findAllComponents(ComplexInput)[0];
    const newStart = new Complex(4, 2);
    complexInput.vm.$emit("update:complex", newStart);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([
      [new ComplexLine(newStart, props.coefficient.end, props.coefficient.duration)],
    ]);
  });

  it("correctly changes the radius of the CIRCLE", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const complexInput = coefficientInput.findAllComponents(ComplexInput)[1];
    const newEnd = new Complex(3, 6);
    complexInput.vm.$emit("update:complex", newEnd);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([
      [new ComplexLine(props.coefficient.start, newEnd, props.coefficient.duration)],
    ]);
  });

  it("correctly changes the duration of the animation", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const numberInput = coefficientInput.findComponent(NumberInput);
    const newDuration = 1000;
    numberInput.vm.$emit("update:value", newDuration);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([
      [new ComplexLine(props.coefficient.start, props.coefficient.end, newDuration * 1000)],
    ]);
  });
});