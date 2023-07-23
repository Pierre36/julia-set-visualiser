import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import NumberInput from "../NumberInput.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      value: 36,
      min: 0,
      max: 100,
      step: 1,
      integerOnly: true,
      wrongInputMessage: "Wrong input message",
      label: "label",
    };
  });

  it("contains the value", () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    expect(input.element.value).toBe(props.value.toString());
    expect(input.attributes()["aria-valuenow"]).toBe(props.value.toString());
  });

  it("has the correct min, max and step", () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    expect(input.element.min).toBe(props.min.toString());
    expect(input.attributes()["aria-valuemin"]).toBe(props.min.toString());
    expect(input.element.max).toBe(props.max.toString());
    expect(input.attributes()["aria-valuemax"]).toBe(props.max.toString());
    expect(input.element.step).toBe(props.step.toString());
  });

  it("has the correct role", () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    expect(input.attributes().role).toBe("spinbutton");
  });

  it("has the correct label", () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    expect(input.attributes()["aria-label"]).toBe(props.label);
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    props = {
      value: 36,
      min: 0,
      max: 100,
      step: 1,
      integerOnly: true,
      wrongInputMessage: "Wrong input message",
    };
  });

  it("allows to type and emits new value", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    const newValue = 42;
    input.element.value = newValue.toString();
    await input.trigger("change");
    expect(numberInput.emitted()["update:value"]).toEqual([[newValue]]);
  });

  it("decrements when pressing 'down' key", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    await input.trigger("keydown.down");
    expect(numberInput.emitted()["update:value"]).toEqual([[props.value - props.step]]);
  });

  it("decrements when pressing 'down' button", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const downButton = numberInput.find(".down");
    await downButton.trigger("click");
    expect(numberInput.emitted()["update:value"]).toEqual([[props.value - props.step]]);
  });

  it("increments when pressing 'up' key", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    await input.trigger("keydown.up");
    expect(numberInput.emitted()["update:value"]).toEqual([[props.value + props.step]]);
  });

  it("increments when pressing 'up' button", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const upButton = numberInput.find(".up");
    await upButton.trigger("click");
    expect(numberInput.emitted()["update:value"]).toEqual([[props.value + props.step]]);
  });

  it("goes to min when pressing 'home' key if min defined", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    await input.trigger("keydown.home");
    expect(numberInput.emitted()["update:value"]).toEqual([[props.min]]);
  });

  it("does nothing when pressing 'home' key if min undefined", async () => {
    props.min = undefined;
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    await input.trigger("keydown.home");
    expect(numberInput.emitted()["update:value"]).toBeUndefined();
  });

  it("goes to max when pressing 'end' key", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    await input.trigger("keydown.end");
    expect(numberInput.emitted()["update:value"]).toEqual([[props.max]]);
  });

  it("does nothing when pressing 'end' key if max undefined", async () => {
    props.max = undefined;
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    await input.trigger("keydown.end");
    expect(numberInput.emitted()["update:value"]).toBeUndefined();
  });
});

describe("Wrong input handling", () => {
  let props;

  beforeEach(() => {
    props = {
      value: 36,
      min: 0,
      max: 100,
      step: 1,
      integerOnly: true,
      wrongInputMessage: "Wrong input message",
      label: "label",
    };
  });

  it("handles invalid number", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    input.element.value = "wrong value";
    await input.trigger("change");
    expect(input.attributes()["aria-invalid"]).toBe("true");
    const wrongSVG = numberInput.find(".wrongInputSVG");
    expect(wrongSVG.exists() && wrongSVG.isVisible()).toBe(true);
    expect(wrongSVG.find("title").text()).toBe(props.wrongInputMessage);
  });

  it("handles too high number", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    input.element.value = "101";
    await input.trigger("change");
    expect(input.attributes()["aria-invalid"]).toBe("true");
    const wrongSVG = numberInput.find(".wrongInputSVG");
    expect(wrongSVG.exists() && wrongSVG.isVisible()).toBe(true);
    expect(wrongSVG.find("title").text()).toBe(props.wrongInputMessage);
  });

  it("handles too low number", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    input.element.value = "-1";
    await input.trigger("change");
    expect(input.attributes()["aria-invalid"]).toBe("true");
    const wrongSVG = numberInput.find(".wrongInputSVG");
    expect(wrongSVG.exists() && wrongSVG.isVisible()).toBe(true);
    expect(wrongSVG.find("title").text()).toBe(props.wrongInputMessage);
  });

  it("handles invalid int number", async () => {
    props.integerOnly = true;
    let numberInput = mount(NumberInput, { props: props });
    let input = numberInput.find("input");
    input.element.value = "1.1";
    await input.trigger("change");
    expect(input.attributes()["aria-invalid"]).toBe("true");
    let wrongSVG = numberInput.find(".wrongInputSVG");
    expect(wrongSVG.exists() && wrongSVG.isVisible()).toBe(true);
    expect(wrongSVG.find("title").text()).toBe(props.wrongInputMessage);

    props.integerOnly = false;
    numberInput = mount(NumberInput, { props: props });
    input = numberInput.find("input");
    input.element.value = "1.1";
    await input.trigger("change");
    expect(input.attributes()["aria-invalid"]).toBe("false");
    wrongSVG = numberInput.find(".wrongInputSVG");
    expect(wrongSVG.exists() && wrongSVG.isVisible()).toBe(false);
  });
});
