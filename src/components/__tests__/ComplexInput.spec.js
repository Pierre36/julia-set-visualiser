import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { Complex } from "../../models/Complex";

import ComplexInput from "../ComplexInput.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      complex: new Complex(3, 6),
      label: "label",
    };
  });

  it("contains the value", () => {
    const complexInput = mount(ComplexInput, { props: props });
    const input = complexInput.find("input");
    expect(input.element.value).toBe(props.complex.toString());
    expect(input.attributes()["aria-valuenow"]).toBe(props.complex.toString());
  });

  it("has the correct role", () => {
    const complexInput = mount(ComplexInput, { props: props });
    const input = complexInput.find("input");
    expect(input.attributes().role).toBe("textbox");
  });

  it("has the correct label", () => {
    const complexInput = mount(ComplexInput, { props: props });
    const input = complexInput.find("input");
    expect(input.attributes()["aria-label"]).toBe(props.label);
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    props = {
      complex: new Complex(3, 6),
      label: "label",
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
  let props;

  beforeEach(() => {
    props = {
      complex: new Complex(3, 6),
      label: "label",
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
});
