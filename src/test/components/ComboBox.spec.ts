import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ComboBox, { type ComboBoxOption, type Props } from "@/components/ComboBox.vue";
import { CustomEvent } from "../testUtils";

interface TestProps<T> extends Props<T> {
  selected: T | null;
}

let props: TestProps<string>;

const id = "id";
const options = [
  { id: "0", text: "option0" },
  { id: "1", text: "option1" },
  { id: "2", text: "option2" },
];
const selected = "1";
const label = "label";

describe("Button render", () => {
  beforeEach(() => {
    props = { id: id, options: options, selected: selected, label: label };
  });

  it("is empty when the selected is null", () => {
    props.selected = null;
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    expect(button.text()).toBe("down-arrow");
  });

  it("is empty when the selected is not in the options", () => {
    props.selected = "-1";
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    expect(button.text()).toBe("down-arrow");
  });

  it("contains the selected option text when it can", () => {
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    expect(button.text()).toContain("option1");
  });

  it("has the correct label", () => {
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    expect(button.attributes()["aria-label"]).toBe(label);
  });

  it("has the correct aria attributes", () => {
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    expect(button.attributes().role).toBe("combobox");
    expect(button.attributes()["aria-controls"]).toBe(`${id}_popup`);
  });
});

describe("List render", () => {
  let selectedOption: ComboBoxOption<string>;

  beforeEach(() => {
    beforeEach(() => {
      props = { id: id, options: options, selected: selected, label: label };
    });
    selectedOption = options[1];
  });

  it("has the role 'listbox'", () => {
    const comboBox = mount(ComboBox, { props: props });
    const popup = comboBox.find(`#${id}_popup`);
    expect(popup.attributes().role).toBe("listbox");
  });

  it("has options with role 'option'", () => {
    const comboBox = mount(ComboBox, { props: props });
    const optionItems = comboBox.findAll("li");
    optionItems.forEach((item) => {
      expect(item.attributes().role).toBe("option");
    });
  });

  it("contains all the options", () => {
    const comboBox = mount(ComboBox, { props: props });
    const optionItems = comboBox.findAll("[role='option']");
    options.forEach((option) => {
      expect(optionItems.some((item) => item.text().includes(option.text))).toBe(true);
    });
  });

  it("displays the selected option first", () => {
    const comboBox = mount(ComboBox, { props: props });
    const option = comboBox.find("[role='option']");
    expect(option.text()).toContain(selectedOption.text);
  });

  it("has the proper aria-selected attributes", () => {
    const comboBox = mount(ComboBox, { props: props });
    const options = comboBox.findAll("[role='option']");
    expect(options[0].attributes()["aria-selected"]).toBe("true");
    for (let i = 1; i < options.length; i++) {
      expect(options[i].attributes()["aria-selected"]).toBe("false");
    }
  });

  it("is closed by default", () => {
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const popup = comboBox.find(`#${id}_popup`);
    expect(popup.isVisible()).toBe(false);
    expect(button.attributes()["aria-expanded"]).toBe("false");
  });
});

describe("Combobox interactions with popup closed", () => {
  let props: {
    id: string;
    options: { id: string; text: string }[];
    selected: string;
    label?: string;
  };

  beforeEach(() => {
    props = {
      id: "id",
      options: [
        { id: "0", text: "option0" },
        { id: "1", text: "option1" },
        { id: "2", text: "option2" },
      ],
      selected: "1",
    };
  });

  it("opens the popup when clicking the button", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const popup = comboBox.find(`#${id}_popup`);

    // Click the button
    await button.trigger("click");

    // Check it is open
    expect(popup.isVisible()).toBe(true);
    expect(button.attributes()["aria-expanded"]).toBe("true");
  });

  it("opens the popup when pressing 'down'", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const popup = comboBox.find(`#${id}_popup`);

    // Press key "down"
    await button.trigger("keydown.down");

    // Check the popup is open
    expect(popup.isVisible()).toBe(true);
  });

  it("opens the popup when pressing 'enter'", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const popup = comboBox.find(`#${id}_popup`);

    // Press key "enter"
    await button.trigger("keydown.enter");

    // Check the popup is open
    expect(popup.isVisible()).toBe(true);
  });
});

describe("Combobox focus interactions", () => {
  let props: {
    id: string;
    options: { id: string; text: string }[];
    selected: string;
    label?: string;
  };

  beforeEach(() => {
    props = {
      id: "id",
      options: [
        { id: "0", text: "option0" },
        { id: "1", text: "option1" },
        { id: "2", text: "option2" },
      ],
      selected: "1",
    };
  });

  it("has the focus on the first option item when opening the popup", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const optionItems = comboBox.findAll("[role='option']");

    // Open the popup
    await button.trigger("click");

    // Check the first option item is focused
    const firstOptionItem = optionItems[0];
    expect(firstOptionItem.classes()).toContain("focused");
    expect(button.attributes()["aria-activedescendant"]).toBe(firstOptionItem.attributes().id);

    // Check the other option item are not focused
    for (let i = 1; i < optionItems.length; i++) {
      expect(optionItems[i].classes()).not.toContain("focused");
    }
  });

  it("moves the focus down when pressing 'down'", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const optionItems = comboBox.findAll("[role='option']");

    // Open the popup
    await button.trigger("click");

    // Press key "down" and check the focus is correct
    await button.trigger("keydown.down");
    expect(optionItems[1].classes()).toContain("focused");
    expect(button.attributes()["aria-activedescendant"]).toBe(optionItems[1].attributes().id);
    await button.trigger("keydown.down");
    expect(optionItems[2].classes()).toContain("focused");
    expect(button.attributes()["aria-activedescendant"]).toBe(optionItems[2].attributes().id);
    await button.trigger("keydown.down");
    expect(optionItems[0].classes()).toContain("focused");
    expect(button.attributes()["aria-activedescendant"]).toBe(optionItems[0].attributes().id);
  });

  it("moves the focus up when pressing 'up'", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const optionItems = comboBox.findAll("[role='option']");

    // Open the popup
    await button.trigger("click");

    // Press key "up" and check the focus is correct
    await button.trigger("keydown.up");
    expect(optionItems[2].classes()).toContain("focused");
    expect(button.attributes()["aria-activedescendant"]).toBe(optionItems[2].attributes().id);
    await button.trigger("keydown.up");
    expect(optionItems[1].classes()).toContain("focused");
    expect(button.attributes()["aria-activedescendant"]).toBe(optionItems[1].attributes().id);
    await button.trigger("keydown.up");
    expect(optionItems[0].classes()).toContain("focused");
    expect(button.attributes()["aria-activedescendant"]).toBe(optionItems[0].attributes().id);
  });

  it("moves the focus to the first option when pressing 'home'", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const optionItems = comboBox.findAll("[role='option']");

    // Open the popup and moves the focus
    await button.trigger("click");
    await button.trigger("keydown.up");

    // Press key "home" and check the focus is correct
    await button.trigger("keydown.home");
    expect(optionItems[0].classes()).toContain("focused");
    expect(button.attributes()["aria-activedescendant"]).toBe(optionItems[0].attributes().id);
  });

  it("moves the focus to the last option when pressing 'end'", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const optionItems = comboBox.findAll("[role='option']");

    // Open the popup
    await button.trigger("click");
    await button.trigger("keydown.down");

    // Press key "home" and check the focus is correct
    await button.trigger("keydown.end");
    expect(optionItems[2].classes()).toContain("focused");
    expect(button.attributes()["aria-activedescendant"]).toBe(optionItems[2].attributes().id);
  });
});

describe("Combobox interactions with popup open", () => {
  let props: {
    id: string;
    options: { id: string; text: string }[];
    selected: string;
    label?: string;
  };

  beforeEach(() => {
    props = {
      id: "id",
      options: [
        { id: "0", text: "option0" },
        { id: "1", text: "option1" },
        { id: "2", text: "option2" },
      ],
      selected: "1",
    };
  });

  it("closes the popup when clicking outside of it", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props, attachToDocument: true });
    const button = comboBox.find("button");
    const popup = comboBox.find(`#${id}_popup`);

    // Open the popup
    await button.trigger("click");

    // Close the popup
    document.dispatchEvent(new CustomEvent("click", { target: document.createElement("div") }));
    await comboBox.vm.$nextTick();

    // Check it is closed
    expect(popup.isVisible()).toBe(false);
  });

  it("does not close the popup when the click has an invalid target", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const popup = comboBox.find(`#${id}_popup`);

    // Open the popup
    await button.trigger("click");

    // Close the popup
    document.dispatchEvent(new Event("click"));
    await comboBox.vm.$nextTick();

    // Check it is closed
    expect(popup.isVisible()).toBe(true);
  });

  it("closes the popup when pressing 'escape'", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const popup = comboBox.find(`#${id}_popup`);

    // Open the popup
    await button.trigger("click");

    // Press key "escape"
    await button.trigger("keydown.escape");

    // Check the popup is open
    expect(popup.isVisible()).toBe(false);
  });

  it("closes the popup when pressing tab", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const popup = comboBox.find(`#${id}_popup`);

    // Open the popup
    await button.trigger("click");

    // Press key "tab"
    await button.trigger("keydown.tab");

    // Check it is closed
    expect(popup.isVisible()).toBe(false);
  });

  it("keeps the popup open when clicking inside it (not on an option)", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const popup = comboBox.find(`#${id}_popup`);

    // Open the popup and click inside it
    await button.trigger("click");
    await popup.trigger("click");

    // Check it is open
    expect(popup.isVisible()).toBe(true);
  });

  it("emits an event and closes the popup when pressing 'enter'", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const popup = comboBox.find(`#${id}_popup`);

    // Open the popup
    await button.trigger("click");

    // Move the focus to the last option
    await button.trigger("keydown.end");

    // Press key "enter"
    await button.trigger("keydown.enter");

    // Check the correct event is emitted
    expect(comboBox.emitted()["update:selected"]).toEqual([["2"]]);

    // Check the popup is closed
    expect(popup.isVisible()).toBe(false);
  });

  it("emits an event and closes the popup when clicking on an option", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const popup = comboBox.find(`#${id}_popup`);

    // Open the popup
    await button.trigger("click");

    // Click on an option
    const optionItem = comboBox.findAll("[role='option']")[2];
    await optionItem.trigger("click");

    // Check the correct event is emitted
    expect(comboBox.emitted()["update:selected"]).toEqual([["2"]]);

    // Check the popup is closed
    expect(popup.isVisible()).toBe(false);
  });

  it("removes the event listener when unmounting the component", async () => {
    // Spy the document
    vi.spyOn(document, "addEventListener");
    vi.spyOn(document, "removeEventListener");

    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });

    // Check a listener is created
    expect(document.addEventListener).toBeCalled();

    // Unmount the component
    comboBox.unmount();

    // Check the listener is removed
    expect(document.removeEventListener).toBeCalled();
  });
});

describe("Combobox popup scroll behavior", () => {
  const optionsCount = 20;
  const popupHeight = 100;
  const optionHeight = 10;
  let scrollTop = 0;

  beforeEach(() => {
    props = { id: id, options: [], selected: "0" };
    for (let i = 0; i < optionsCount; i++) {
      props.options?.push({ id: i.toString(), text: `option${i}` });
    }
    HTMLUListElement.prototype.scrollTo = (_, scrollY?) => (scrollTop = scrollY as number);
  });

  it("scrolls to show focused item", async () => {
    // Mount the ComboBox
    const comboBox = mount(ComboBox, { props: props });
    const button = comboBox.find("button");
    const popup = comboBox.find(`#${id}_popup`);
    const optionItems = comboBox.findAll("[role='option']");

    // Mock scroll related methods
    vi.spyOn(popup.element, "clientHeight", "get").mockImplementation(() => popupHeight);
    vi.spyOn(popup.element, "scrollTop", "get").mockImplementation(() => scrollTop);
    optionItems.forEach((item, index) => {
      vi.spyOn(item.element, "clientHeight", "get").mockImplementation(() => optionHeight);
      vi.spyOn(item.element as HTMLElement, "offsetTop", "get").mockImplementation(
        () => index * optionHeight
      );
    });

    // Open the popup
    await button.trigger("click");

    // Moves to the last item and check the popup is correctly scrolled
    await button.trigger("keydown.end");
    expect(scrollTop).toBe(100);

    // Go back to the first item and check the popup is correctly scrolled
    await button.trigger("keydown.home");
    expect(scrollTop).toBe(0);
  });
});
