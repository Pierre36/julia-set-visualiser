import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Complex from "@/models/Complex";
import ComplexCircle from "@/models/ComplexCircle";
import ComplexEllipse from "@/models/ComplexEllipse";
import CoefficientTypes from "@/constants/CoefficientTypes";
import CoefficientInput, { type Props } from "@/components/inputs/CoefficientInput.vue";
import ComboBox from "@/components/primitives/ComboBox.vue";
import ComplexInput from "@/components/inputs/ComplexInput.vue";
import ComplexCircleInput from "@/components/inputs/ComplexCircleInput.vue";
import ComplexLineInput from "@/components/inputs/ComplexLineInput.vue";
import ComplexEllipseInput from "@/components/inputs/ComplexEllipseInput.vue";
import ComplexLine from "@/models/ComplexLine";
import type Coefficient from "@/models/Coefficient";

interface TestProps extends Props {
  coefficient: Coefficient;
}

let props: TestProps;

const level = 1;

describe("Render", () => {
  const coefficient = new Complex(3, 6);

  beforeEach(() => {
    props = {
      coefficient: coefficient,
      level: level,
    };
  });

  it("displays a combobox to choose the type of coefficient", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const firstHeading = coefficientInput.findAll("h" + level)[0];
    expect(firstHeading.text()).toBe("Type");
    // @ts-ignore
    const firstComboBox: VueWrapper<ComboBox> = coefficientInput.findAllComponents(ComboBox)[0];
    expect(firstComboBox.vm.$props.options).toEqual([
      { id: CoefficientTypes.CONSTANT, text: "Constant" },
      { id: CoefficientTypes.CIRCLE, text: "Circle" },
      { id: CoefficientTypes.LINE, text: "Line" },
      { id: CoefficientTypes.ELLIPSE, text: "Ellipse" },
    ]);
    expect(firstComboBox.vm.$props.label).toBe("Coefficient type");
  });
});

describe("Render for type CONSTANT", () => {
  const coefficient = new Complex(3, 6);

  beforeEach(() => {
    props = {
      coefficient: coefficient,
      level: level,
    };
  });

  it("is has the correct level of headings", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    for (let i = 1; i < 6 && i != level; i++) {
      expect(coefficientInput.findAll("h" + i).length).toBe(0);
    }
    expect(coefficientInput.findAll("h" + level).length).toBe(2);
  });

  it("has a type combobox with the correct type", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    // @ts-ignore
    const firstComboBox: VueWrapper<ComboBox> = coefficientInput.findAllComponents(ComboBox)[0];
    expect(firstComboBox.vm.$props.selected).toBe(CoefficientTypes.CONSTANT);
  });

  it("has a complex input for the value of the constant", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const secondHeading = coefficientInput.findAll("h" + level)[1];
    expect(secondHeading.text()).toBe("Value");
    const complexInput = coefficientInput.findComponent(ComplexInput);
    expect(complexInput.vm.$props.complex).toEqual(props.coefficient);
    expect(complexInput.vm.$props.label).toBe("Coefficient value");
  });
});

describe("Render for type CIRCLE", () => {
  const coefficient = new ComplexCircle(new Complex(3, 6), 42, 2000);

  beforeEach(() => {
    props = {
      coefficient: coefficient,
      level: level,
    };
  });

  it("has a type combobox with the correct type", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    // @ts-ignore
    const firstComboBox: VueWrapper<ComboBox> = coefficientInput.findAllComponents(ComboBox)[0];
    expect(firstComboBox.vm.$props.selected).toBe(CoefficientTypes.CIRCLE);
  });

  it("has a complex circle input for the value of the circle", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const circleInput = coefficientInput.findComponent(ComplexCircleInput);
    expect(circleInput.vm.$props.circle).toEqual(coefficient);
    expect(circleInput.vm.$props.level).toBe(level);
  });
});

describe("Render for type LINE", () => {
  const coefficient = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

  beforeEach(() => {
    props = {
      coefficient: coefficient,
      level: level,
    };
  });

  it("has a type combobox with the correct type", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    // @ts-ignore
    const firstComboBox: VueWrapper<ComboBox> = coefficientInput.findAllComponents(ComboBox)[0];
    expect(firstComboBox.vm.$props.selected).toBe(CoefficientTypes.LINE);
  });

  it("has a complex line input for the value of the line", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const lineInput = coefficientInput.findComponent(ComplexLineInput);
    expect(lineInput.vm.$props.line).toEqual(coefficient);
    expect(lineInput.vm.$props.level).toBe(level);
  });
});

describe("Render for type ELLIPSE", () => {
  const coefficient = new ComplexEllipse(new Complex(3, 6), 36, 42, 16, 2000);

  beforeEach(() => {
    props = {
      coefficient: coefficient,
      level: level,
    };
  });

  it("has a type combobox with the correct type", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    // @ts-ignore
    const firstComboBox: VueWrapper<ComboBox> = coefficientInput.findAllComponents(ComboBox)[0];
    expect(firstComboBox.vm.$props.selected).toBe(CoefficientTypes.ELLIPSE);
  });

  it("has a complex ellipse input for the value of the ellipse", () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const ellipseInput = coefficientInput.findComponent(ComplexEllipseInput);
    expect(ellipseInput.vm.$props.ellipse).toEqual(coefficient);
    expect(ellipseInput.vm.$props.level).toBe(level);
  });
});

describe("Interactions", () => {
  const coefficient = new Complex(3, 6);

  beforeEach(() => {
    props = {
      coefficient: coefficient,
      level: level,
    };
  });

  it("correctly changes type to CIRCLE", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    // @ts-ignore
    const typeComboBox: VueWrapper<ComboBox> = coefficientInput.findAllComponents(ComboBox)[0];
    typeComboBox.vm.$emit("update:selected", CoefficientTypes.CIRCLE);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([
      [new ComplexCircle(new Complex(0, 0), 1, 5000)],
    ]);
  });

  it("correctly changes type to LINE", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    // @ts-ignore
    const typeComboBox: VueWrapper<ComboBox> = coefficientInput.findAllComponents(ComboBox)[0];
    typeComboBox.vm.$emit("update:selected", CoefficientTypes.LINE);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([
      [new ComplexLine(new Complex(-1, 0), new Complex(1, 0), 5000)],
    ]);
  });

  it("correctly changes type to ELLIPSE", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    // @ts-ignore
    const typeComboBox: VueWrapper<ComboBox> = coefficientInput.findAllComponents(ComboBox)[0];
    typeComboBox.vm.$emit("update:selected", CoefficientTypes.ELLIPSE);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([
      [new ComplexEllipse(new Complex(0, 0), 1, 1, 0, 5000)],
    ]);
  });

  it("correctly changes type to CONSTANT", async () => {
    props.coefficient = new ComplexCircle(new Complex(0, 0), 1, 2000);
    const coefficientInput = mount(CoefficientInput, { props: props });
    // @ts-ignore
    const typeComboBox: VueWrapper<ComboBox> = coefficientInput.findAllComponents(ComboBox)[0];
    typeComboBox.vm.$emit("update:selected", CoefficientTypes.CONSTANT);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([[new Complex(0, 0)]]);
  });
});

describe("Interactions for type CONSTANT", () => {
  const coefficient = new Complex(3, 6);

  beforeEach(() => {
    props = {
      coefficient: coefficient,
      level: level,
    };
  });

  it("correctly changes the value of the CONSTANT", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const complexInput = coefficientInput.findComponent(ComplexInput);
    const newComplex = new Complex(4, 2);
    complexInput.vm.$emit("update:complex", newComplex);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([[newComplex]]);
  });
});

describe("Interactions for type CIRCLE", () => {
  const coefficient = new ComplexCircle(new Complex(3, 6), 42, 2000);

  beforeEach(() => {
    props = {
      coefficient: coefficient,
      level: level,
    };
  });

  it("correctly changes the value of the CIRCLE", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const circleInput = coefficientInput.findComponent(ComplexCircleInput);
    const newCircle = new ComplexCircle(new Complex(4, 2), 36, 5000);
    circleInput.vm.$emit("update:circle", newCircle);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([[newCircle]]);
  });
});

describe("Interactions for type LINE", () => {
  const coefficient = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

  beforeEach(() => {
    props = {
      coefficient: coefficient,
      level: level,
    };
  });

  it("correctly changes the value of the LINE", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const lineInput = coefficientInput.findComponent(ComplexLineInput);
    const newLine = new ComplexLine(new Complex(4, 2), new Complex(3, 6), 5000);
    lineInput.vm.$emit("update:line", newLine);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([[newLine]]);
  });
});

describe("Interactions for type ELLIPSE", () => {
  const coefficient = new ComplexEllipse(new Complex(3, 6), 36, 42, 16, 2000);

  beforeEach(() => {
    props = {
      coefficient: coefficient,
      level: level,
    };
  });

  it("correctly changes the value of the LINE", async () => {
    const coefficientInput = mount(CoefficientInput, { props: props });
    const ellipseInput = coefficientInput.findComponent(ComplexEllipseInput);
    const newEllipse = new ComplexEllipse(new Complex(4, 2), 42, 36, 20, 5000);
    ellipseInput.vm.$emit("update:ellipse", newEllipse);
    await coefficientInput.vm.$nextTick();
    expect(coefficientInput.emitted()["update:coefficient"]).toEqual([[newEllipse]]);
  });
});
