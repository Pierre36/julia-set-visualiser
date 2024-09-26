import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import type { Props } from "@/components/inputs/ComplexEllipseInput.vue";
import ComplexEllipse from "@/models/ComplexEllipse";
import Complex from "@/models/Complex";
import ComplexEllipseInput from "@/components/inputs/ComplexEllipseInput.vue";
import ComplexInput from "@/components/inputs/ComplexInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";

interface TestProps extends Props {
  ellipse: ComplexEllipse;
}

let props: TestProps;

const ellipse = new ComplexEllipse(new Complex(3, 6), 36, 42, 16, 2000);
const level = 1;

describe("Render for type ELLIPSE", () => {
  beforeEach(() => {
    props = {
      ellipse: ellipse,
      level: level,
    };
  });

  it("is has the correct level of headings", () => {
    const ellipseInput = mount(ComplexEllipseInput, { props: props });
    for (let i = 1; i < 6 && i != level; i++) {
      expect(ellipseInput.findAll("h" + i).length).toBe(0);
    }
    expect(ellipseInput.findAll("h" + level).length).toBe(5);
  });

  it("has a complex input for the centre of the ellipse", () => {
    const ellipseInput = mount(ComplexEllipseInput, { props: props });
    const firstHeading = ellipseInput.findAll("h" + level)[0];
    expect(firstHeading.text()).toBe("Centre");
    const complexInput = ellipseInput.findComponent(ComplexInput);
    expect(complexInput.vm.$props.complex).toEqual(ellipse.centre);
    expect(complexInput.vm.$props.label).toBe("Ellipse centre");
  });

  it("has a number input for the half-width of the ellipse", () => {
    const ellipseInput = mount(ComplexEllipseInput, { props: props });
    const secondHeading = ellipseInput.findAll("h" + level)[1];
    expect(secondHeading.text()).toBe("Half-width");
    const numberInput = ellipseInput.findAllComponents(NumberInput)[0];
    expect(numberInput.vm.$props.value).toEqual(ellipse.halfWidth);
    expect(numberInput.vm.$props.min).toBe(0);
    expect(numberInput.vm.$props.max).toBeUndefined();
    expect(numberInput.vm.$props.step).toBe(0.1);
    expect(numberInput.vm.$props.isIntegerOnly).toBe(false);
    expect(numberInput.vm.$props.wrongInputMessage).toBe("Please enter a valid number");
    expect(numberInput.vm.$props.label).toBe("Ellipse half-width");
  });

  it("has a number input for the half-height of the ellipse", () => {
    const ellipseInput = mount(ComplexEllipseInput, { props: props });
    const thirdHeading = ellipseInput.findAll("h" + level)[2];
    expect(thirdHeading.text()).toBe("Half-height");
    const numberInput = ellipseInput.findAllComponents(NumberInput)[1];
    expect(numberInput.vm.$props.value).toEqual(ellipse.halfHeight);
    expect(numberInput.vm.$props.min).toBe(0);
    expect(numberInput.vm.$props.max).toBeUndefined();
    expect(numberInput.vm.$props.step).toBe(0.1);
    expect(numberInput.vm.$props.isIntegerOnly).toBe(false);
    expect(numberInput.vm.$props.wrongInputMessage).toBe("Please enter a valid number");
    expect(numberInput.vm.$props.label).toBe("Ellipse half-height");
  });

  it("has a number input for the rotation angle of the ellipse", () => {
    const ellipseInput = mount(ComplexEllipseInput, { props: props });
    const fourthHeading = ellipseInput.findAll("h" + level)[3];
    expect(fourthHeading.text()).toBe("Rotation angle");
    const numberInput = ellipseInput.findAllComponents(NumberInput)[2];
    expect(numberInput.vm.$props.value).toEqual(ellipse.rotationAngle);
    expect(numberInput.vm.$props.min).toBe(0);
    expect(numberInput.vm.$props.max).toBeUndefined();
    expect(numberInput.vm.$props.step).toBe(1);
    expect(numberInput.vm.$props.isIntegerOnly).toBe(false);
    expect(numberInput.vm.$props.wrongInputMessage).toBe("Please enter a valid number");
    expect(numberInput.vm.$props.label).toBe("Ellipse rotation angle");
  });

  it("has a number input for the duration of the animation", () => {
    const ellipseInput = mount(ComplexEllipseInput, { props: props });
    const fifthHeading = ellipseInput.findAll("h" + level)[4];
    expect(fifthHeading.text()).toBe("Duration");
    const numberInput = ellipseInput.findAllComponents(NumberInput)[3];
    expect(numberInput.vm.$props.value).toEqual(ellipse.duration / 1000);
    expect(numberInput.vm.$props.min).toBe(0);
    expect(numberInput.vm.$props.max).toBeUndefined();
    expect(numberInput.vm.$props.step).toBe(1);
    expect(numberInput.vm.$props.isIntegerOnly).toBe(false);
    expect(numberInput.vm.$props.wrongInputMessage).toBe("Please enter a valid number");
    expect(numberInput.vm.$props.label).toBe("Duration");
  });
});

describe("Interactions", () => {
  beforeEach(() => {
    props = {
      ellipse: ellipse,
      level: level,
    };
  });

  it("correctly changes the centre of the ellipse", async () => {
    const ellipseInput = mount(ComplexEllipseInput, { props: props });
    const complexInput = ellipseInput.findComponent(ComplexInput);
    const newCentre = new Complex(4, 2);
    complexInput.vm.$emit("update:complex", newCentre);
    await ellipseInput.vm.$nextTick();
    expect(ellipse.centre).toEqual(newCentre);
  });

  it("correctly changes the half-width of the ellipse", async () => {
    const ellipseInput = mount(ComplexEllipseInput, { props: props });
    const numberInput = ellipseInput.findAllComponents(NumberInput)[0];
    const newHalfWidth = 20;
    numberInput.vm.$emit("update:value", newHalfWidth);
    await ellipseInput.vm.$nextTick();
    expect(ellipse.halfWidth).toEqual(newHalfWidth);
  });

  it("correctly changes the half-height of the ellipse", async () => {
    const ellipseInput = mount(ComplexEllipseInput, { props: props });
    const numberInput = ellipseInput.findAllComponents(NumberInput)[1];
    const newHalfHeight = 20;
    numberInput.vm.$emit("update:value", newHalfHeight);
    await ellipseInput.vm.$nextTick();
    expect(ellipse.halfHeight).toEqual(newHalfHeight);
  });

  it("correctly changes the rotation angle of the ellipse", async () => {
    const ellipseInput = mount(ComplexEllipseInput, { props: props });
    const numberInput = ellipseInput.findAllComponents(NumberInput)[2];
    const newRotationAngle = 20;
    numberInput.vm.$emit("update:value", newRotationAngle);
    await ellipseInput.vm.$nextTick();
    expect(ellipse.rotationAngle).toEqual(newRotationAngle);
  });

  it("correctly changes the duration of the animation", async () => {
    const ellipseInput = mount(ComplexEllipseInput, { props: props });
    const numberInput = ellipseInput.findAllComponents(NumberInput)[3];
    const newDuration = 1000;
    numberInput.vm.$emit("update:value", newDuration / 1000);
    await ellipseInput.vm.$nextTick();
    expect(ellipse.duration).toEqual(newDuration);
  });
});
