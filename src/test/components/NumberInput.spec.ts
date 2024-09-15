import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import NumberInput, { type Props } from "@/components/NumberInput.vue";

let props: Props;

const value = 36;
const min = 0;
const max = 100;
const step = 1;
const wrongInputMessage = "Wrong input message";
const isIntegerOnly = true;
const label = "label";

describe("Render", () => {
  beforeEach(() => {
    props = {
      value: value,
      min: min,
      max: max,
      step: step,
      isIntegerOnly: isIntegerOnly,
      wrongInputMessage: wrongInputMessage,
      label: label,
    };
  });

  it("contains the value", () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    expect(input.element.value).toBe(`${value}`);
  });

  it("has the correct min, max and step", () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    expect(input.element.min).toBe(`${min}`);
    expect(input.attributes()["aria-valuemin"]).toBe(`${min}`);
    expect(input.element.max).toBe(`${max}`);
    expect(input.attributes()["aria-valuemax"]).toBe(`${max}`);
    expect(input.element.step).toBe(`${step}`);
  });

  it("has the correct role", () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    expect(input.attributes().role).toBe("spinbutton");
  });

  it("has the correct label", () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    expect(input.attributes()["aria-label"]).toBe(label);
  });
});

describe("Interactions", () => {
  beforeEach(() => {
    props = {
      value: value,
      min: min,
      max: max,
      step: step,
      isIntegerOnly: true,
      wrongInputMessage: wrongInputMessage,
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
    expect(numberInput.emitted()["update:value"]).toEqual([[value - step]]);
  });

  it("decrements when pressing 'down' button", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const downButton = numberInput.find(".down");
    await downButton.trigger("click");
    expect(numberInput.emitted()["update:value"]).toEqual([[value - step]]);
  });

  it("increments when pressing 'up' key", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    await input.trigger("keydown.up");
    expect(numberInput.emitted()["update:value"]).toEqual([[value + step]]);
  });

  it("increments when pressing 'up' button", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const upButton = numberInput.find(".up");
    await upButton.trigger("click");
    expect(numberInput.emitted()["update:value"]).toEqual([[value + step]]);
  });

  it("goes to min when pressing 'home' key if min defined", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    await input.trigger("keydown.home");
    expect(numberInput.emitted()["update:value"]).toEqual([[min]]);
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
    expect(numberInput.emitted()["update:value"]).toEqual([[max]]);
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
  let props: Props;

  beforeEach(() => {
    props = {
      value: value,
      min: min,
      max: max,
      step: step,
      isIntegerOnly: true,
      wrongInputMessage: wrongInputMessage,
      label: label,
    };
  });

  it("handles invalid number", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    input.element.value = "wrong value";
    await input.trigger("change");
    expect(input.attributes()["aria-invalid"]).toBe("true");
    const wrongSVG = numberInput.find(".wrong-input-svg");
    expect(wrongSVG.exists() && wrongSVG.isVisible()).toBe(true);
    expect(wrongSVG.find("title").text()).toBe(wrongInputMessage);
  });

  it("handles too high number", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    input.element.value = "101";
    await input.trigger("change");
    expect(input.attributes()["aria-invalid"]).toBe("true");
    const wrongSVG = numberInput.find(".wrong-input-svg");
    expect(wrongSVG.exists() && wrongSVG.isVisible()).toBe(true);
    expect(wrongSVG.find("title").text()).toBe(wrongInputMessage);
  });

  it("handles too low number", async () => {
    const numberInput = mount(NumberInput, { props: props });
    const input = numberInput.find("input");
    input.element.value = "-1";
    await input.trigger("change");
    expect(input.attributes()["aria-invalid"]).toBe("true");
    const wrongSVG = numberInput.find(".wrong-input-svg");
    expect(wrongSVG.exists() && wrongSVG.isVisible()).toBe(true);
    expect(wrongSVG.find("title").text()).toBe(wrongInputMessage);
  });

  it("handles invalid int number", async () => {
    props.isIntegerOnly = true;
    let numberInput = mount(NumberInput, { props: props });
    let input = numberInput.find("input");
    input.element.value = "1.1";
    await input.trigger("change");
    expect(input.attributes()["aria-invalid"]).toBe("true");
    let wrongSVG = numberInput.find(".wrong-input-svg");
    expect(wrongSVG.exists() && wrongSVG.isVisible()).toBe(true);
    expect(wrongSVG.find("title").text()).toBe(wrongInputMessage);

    props.isIntegerOnly = false;
    numberInput = mount(NumberInput, { props: props });
    input = numberInput.find("input");
    input.element.value = "1.1";
    await input.trigger("change");
    expect(input.attributes()["aria-invalid"]).toBe("false");
    wrongSVG = numberInput.find(".wrong-input-svg");
    expect(wrongSVG.exists() && wrongSVG.isVisible()).toBe(false);
  });
});
