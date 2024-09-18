import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Complex from "@/models/Complex";
import ComplexCircle from "@/models/ComplexCircle";
import ComplexCircleInput from "@/components/ComplexCircleInput.vue";
import ComplexInput from "@/components/ComplexInput.vue";
import NumberInput from "@/components/NumberInput.vue";
import type { Props } from "@/components/ComplexCircleInput.vue";

interface TestProps extends Props {
  circle: ComplexCircle;
}

let props: TestProps;

const circle = new ComplexCircle(new Complex(3, 6), 36, 2000);
const level = 1;

describe("Render", () => {
  beforeEach(() => {
    props = {
      circle: circle,
      level: level,
    };
  });

  it("is has the correct level of headings", () => {
    const circleInput = mount(ComplexCircleInput, { props: props });
    for (let i = 1; i < 6 && i != level; i++) {
      expect(circleInput.findAll("h" + i).length).toBe(0);
    }
    expect(circleInput.findAll("h" + level).length).toBe(3);
  });

  it("has a complex input for the centre of the circle", () => {
    const circleInput = mount(ComplexCircleInput, { props: props });
    const firstHeading = circleInput.findAll("h" + level)[0];
    expect(firstHeading.text()).toBe("Centre");
    const complexInput = circleInput.findComponent(ComplexInput);
    expect(complexInput.vm.$props.complex).toEqual(circle.centre);
    expect(complexInput.vm.$props.label).toBe("Circle centre");
  });

  it("has a number input for the radius of the circle", () => {
    const circleInput = mount(ComplexCircleInput, { props: props });
    const secondHeading = circleInput.findAll("h" + level)[1];
    expect(secondHeading.text()).toBe("Radius");
    const numberInput = circleInput.findAllComponents(NumberInput)[0];
    expect(numberInput.vm.$props.value).toEqual(circle.radius);
    expect(numberInput.vm.$props.min).toBe(0);
    expect(numberInput.vm.$props.max).toBeUndefined();
    expect(numberInput.vm.$props.step).toBe(0.1);
    expect(numberInput.vm.$props.isIntegerOnly).toBe(false);
    expect(numberInput.vm.$props.wrongInputMessage).toBe("Please enter a valid number");
    expect(numberInput.vm.$props.label).toBe("Circle radius");
  });

  it("has a number input for the duration of the animation", () => {
    const circleInput = mount(ComplexCircleInput, { props: props });
    const thirdHeading = circleInput.findAll("h" + level)[2];
    expect(thirdHeading.text()).toBe("Duration");
    const numberInput = circleInput.findAllComponents(NumberInput)[1];
    expect(numberInput.vm.$props.value).toEqual(circle.duration / 1000);
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
      circle: circle,
      level: level,
    };
  });

  it("correctly changes the centre of the circle", async () => {
    const circleInput = mount(ComplexCircleInput, { props: props });
    const complexInput = circleInput.findComponent(ComplexInput);
    const newCentre = new Complex(4, 2);
    complexInput.vm.$emit("update:complex", newCentre);
    await circleInput.vm.$nextTick();
    expect(circle.centre).toEqual(newCentre);
  });

  it("correctly changes the radius of the circle", async () => {
    const circleInput = mount(ComplexCircleInput, { props: props });
    const numberInput = circleInput.findAllComponents(NumberInput)[0];
    const newRadius = 36;
    numberInput.vm.$emit("update:value", newRadius);
    await circleInput.vm.$nextTick();
    expect(circle.radius).toEqual(newRadius);
  });

  it("correctly changes the duration of the animation", async () => {
    const circleInput = mount(ComplexCircleInput, { props: props });
    const numberInput = circleInput.findAllComponents(NumberInput)[1];
    const newDuration = 1000;
    numberInput.vm.$emit("update:value", newDuration / 1000);
    await circleInput.vm.$nextTick();
    expect(circle.duration).toEqual(newDuration);
  });
});
