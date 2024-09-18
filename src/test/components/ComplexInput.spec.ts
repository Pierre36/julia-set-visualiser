import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Complex from "@/models/Complex";
import ComplexInput, { type Props } from "@/components/ComplexInput.vue";

interface TestProps extends Props {
  complex: Complex;
}

let props: TestProps;

const complex = new Complex(3, 6);
const label = "label";

describe("Render", () => {
  beforeEach(() => {
    props = {
      complex: complex,
      label: label,
    };
  });

  it("contains the value", () => {
    const complexInput = mount(ComplexInput, { props: props });
    const input = complexInput.find("input");
    expect(input.element.value).toBe(complex.toString());
  });

  it("has the correct role", () => {
    const complexInput = mount(ComplexInput, { props: props });
    const input = complexInput.find("input");
    expect(input.attributes().role).toBe("textbox");
  });

  it("has the correct label", () => {
    const complexInput = mount(ComplexInput, { props: props });
    const input = complexInput.find("input");
    expect(input.attributes()["aria-label"]).toBe(label);
  });
});

describe("Interactions", () => {
  beforeEach(() => {
    props = {
      complex: complex,
      label: label,
    };
  });

  it("allows to type and emits new value", async () => {
    const complexInput = mount(ComplexInput, { props: props });
    const input = complexInput.find("input");
    const newValue = new Complex(4, 2);
    input.element.value = newValue.toString();
    await input.trigger("change");
    expect(complexInput.emitted()["update:complex"]).toEqual([[newValue]]);
  });
});

describe("Wrong input handling", () => {
  beforeEach(() => {
    props = {
      complex: complex,
      label: label,
    };
  });

  it("handles invalid complex number", async () => {
    const complexInput = mount(ComplexInput, { props: props });
    const input = complexInput.find("input");
    input.element.value = "wrong value";
    await input.trigger("change");
    expect(input.attributes()["aria-invalid"]).toBe("true");
    const wrongSVG = complexInput.find(".wrong-input-svg");
    expect(wrongSVG.exists() && wrongSVG.isVisible()).toBe(true);
  });

  it("handles empty string", async () => {
    const complexInput = mount(ComplexInput, { props: props });
    const input = complexInput.find("input");
    input.element.value = "";
    await input.trigger("change");
    expect(input.attributes()["aria-invalid"]).toBe("true");
    const wrongSVG = complexInput.find(".wrong-input-svg");
    expect(wrongSVG.exists() && wrongSVG.isVisible()).toBe(true);
  });
});
