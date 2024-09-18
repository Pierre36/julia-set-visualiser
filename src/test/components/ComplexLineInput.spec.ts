import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Complex from "@/models/Complex";
import ComplexLine from "@/models/ComplexLine";
import ComplexInput from "@/components/ComplexInput.vue";
import NumberInput from "@/components/NumberInput.vue";
import type { Props } from "@/components/ComplexLineInput.vue";
import ComplexLineInput from "@/components/ComplexLineInput.vue";

interface TestProps extends Props {
  line: ComplexLine;
}

let props: TestProps;

const line = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);
const level = 1;

describe("Render", () => {
  beforeEach(() => {
    props = {
      line: line,
      level: level,
    };
  });

  it("is has the correct level of headings", () => {
    const lineInput = mount(ComplexLineInput, { props: props });
    for (let i = 1; i < 6 && i != props.level; i++) {
      expect(lineInput.findAll("h" + i).length).toBe(0);
    }
    expect(lineInput.findAll("h" + props.level).length).toBe(3);
  });

  it("has a complex input for the start of the line", () => {
    const lineInput = mount(ComplexLineInput, { props: props });
    const firstHeading = lineInput.findAll("h" + level)[0];
    expect(firstHeading.text()).toBe("Start");
    const complexInput = lineInput.findAllComponents(ComplexInput)[0];
    expect(complexInput.vm.$props.complex).toEqual(line.start);
    expect(complexInput.vm.$props.label).toBe("Line start");
  });

  it("has a complex input for the end of the line", () => {
    const lineInput = mount(ComplexLineInput, { props: props });
    const secondHeading = lineInput.findAll("h" + level)[1];
    expect(secondHeading.text()).toBe("End");
    const complexInput = lineInput.findAllComponents(ComplexInput)[1];
    expect(complexInput.vm.$props.complex).toEqual(line.end);
    expect(complexInput.vm.$props.label).toBe("Line end");
  });

  it("has a number input for the duration of the animation", () => {
    const lineInput = mount(ComplexLineInput, { props: props });
    const thirdHeading = lineInput.findAll("h" + level)[2];
    expect(thirdHeading.text()).toBe("Duration");
    const numberInput = lineInput.findAllComponents(NumberInput)[0];
    expect(numberInput.vm.$props.value).toEqual(line.duration / 1000);
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
      line: line,
      level: level,
    };
  });

  it("correctly changes the start of the line", async () => {
    const lineInput = mount(ComplexLineInput, { props: props });
    const complexInput = lineInput.findAllComponents(ComplexInput)[0];
    const newStart = new Complex(4, 2);
    complexInput.vm.$emit("update:complex", newStart);
    await lineInput.vm.$nextTick();
    expect(line.start).toEqual(newStart);
  });

  it("correctly changes the radius of the line", async () => {
    const lineInput = mount(ComplexLineInput, { props: props });
    const complexInput = lineInput.findAllComponents(ComplexInput)[1];
    const newEnd = new Complex(3, 6);
    complexInput.vm.$emit("update:complex", newEnd);
    await lineInput.vm.$nextTick();
    expect(line.end).toEqual(newEnd);
  });

  it("correctly changes the duration of the animation", async () => {
    const lineInput = mount(ComplexLineInput, { props: props });
    const numberInput = lineInput.findComponent(NumberInput);
    const newDuration = 1000;
    numberInput.vm.$emit("update:value", newDuration / 1000);
    await lineInput.vm.$nextTick();
    expect(line.duration).toEqual(newDuration);
  });
});
