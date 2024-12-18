import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MultiComboBox, { type Props } from "@/components/primitives/MultiComboBox.vue";

interface TestProps<T> extends Props<T> {
  selected: Set<T>;
}

let props: TestProps<String>;

const id = "id";
const options = [
  { id: "0", text: "option0" },
  { id: "1", text: "option1" },
  { id: "2", text: "option2" },
];
const label = "label";
const noOptionsSelectedText = "no options selected text";
const allOptionsSelectedText = "all options selected text";

describe("Button render", () => {
  beforeEach(() => {
    props = {
      id,
      options,
      selected: new Set(["1"]),
      label,
      noOptionsSelectedText,
      allOptionsSelectedText,
    };
  });

  it("is noOptionsSelectedText when the selected is empty and noOptionsSelectedText is set", () => {
    props.selected = new Set();
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    expect(button.text()).toContain(props.noOptionsSelectedText);
  });

  it("is noOptionsSelectedText when the selected is not in the options and noOptionsSelectedText is set", () => {
    props.selected = new Set(["-1"]);
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    expect(button.text()).toContain(props.noOptionsSelectedText);
  });

  it("contains the selected option text when only one option is selected", () => {
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    expect(button.text()).toContain("option1");
  });

  it("contains the number of selected options when multiple options are selected", () => {
    props.selected = new Set(["0", "1"]);
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    expect(button.text()).toContain("2 selected options");
  });

  it("is allOptionsSelectedText when all options are selected and allOptionsSelectedText is set", () => {
    props.selected = new Set(["0", "1", "2"]);
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    expect(button.text()).toContain(props.allOptionsSelectedText);
  });

  it("has the correct label", () => {
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    expect(button.attributes()["aria-label"]).toBe(props.label);
  });

  it("has the correct aria attributes", () => {
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    expect(button.attributes().role).toBe("combobox");
    expect(button.attributes()["aria-controls"]).toBe(props.id + "_popup");
  });
});

describe("List render", () => {
  beforeEach(() => {
    props = {
      id,
      options,
      selected: new Set(["0"]),
      label,
      noOptionsSelectedText,
      allOptionsSelectedText,
    };
  });

  it("has the role 'listbox'", () => {
    const multiComboBox = mount(MultiComboBox, { props: props });
    const popup = multiComboBox.find("#" + props.id + "_popup");
    expect(popup.attributes().role).toBe("listbox");
  });

  it("has options with role 'option'", () => {
    const multiComboBox = mount(MultiComboBox, { props: props });
    const optionItems = multiComboBox.findAll("li");
    optionItems.forEach((item) => {
      expect(item.attributes().role).toBe("option");
    });
  });

  it("contains all the options", () => {
    const multiComboBox = mount(MultiComboBox, { props: props });
    const optionItems = multiComboBox.findAll("[role='option']");
    options.forEach((option) => {
      expect(optionItems.some((item) => item.text().includes(option.text))).toBe(true);
    });
  });

  it("has the proper aria-selected attributes", () => {
    const multiComboBox = mount(MultiComboBox, { props: props });
    const options = multiComboBox.findAll("[role='option']");
    expect(options[0].attributes()["aria-selected"]).toBe("true");
    for (let i = 1; i < options.length; i++) {
      expect(options[i].attributes()["aria-selected"]).toBe("false");
    }
  });

  it("is closed by default", () => {
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    const popup = multiComboBox.find("#" + props.id + "_popup");
    expect(popup.isVisible()).toBe(false);
    expect(button.attributes()["aria-expanded"]).toBe("false");
  });
});

describe("MultiComboBox interactions with popup closed", () => {
  beforeEach(() => {
    props = {
      id,
      options,
      selected: new Set(["1"]),
      label,
      noOptionsSelectedText,
      allOptionsSelectedText,
    };
  });

  it("opens the popup when clicking the button", async () => {
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    const popup = multiComboBox.find("#" + props.id + "_popup");

    // Click the button
    await button.trigger("click");

    // Check it is open
    expect(popup.isVisible()).toBe(true);
    expect(button.attributes()["aria-expanded"]).toBe("true");
  });

  it("opens the popup when pressing 'down'", async () => {
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    const popup = multiComboBox.find("#" + props.id + "_popup");

    // Press key "down"
    await button.trigger("keydown.down");

    // Check the popup is open
    expect(popup.isVisible()).toBe(true);
  });

  it("opens the popup when pressing 'enter'", async () => {
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    const popup = multiComboBox.find("#" + props.id + "_popup");

    // Press key "enter"
    await button.trigger("keydown.enter");

    // Check the popup is open
    expect(popup.isVisible()).toBe(true);
  });
});

describe("MultiComboBox focus interactions", () => {
  beforeEach(() => {
    props = {
      id,
      options,
      selected: new Set(["1"]),
      label,
      noOptionsSelectedText,
      allOptionsSelectedText,
    };
  });

  it("has the focus on the first option item when opening the popup", async () => {
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    const optionItems = multiComboBox.findAll("[role='option']");

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
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    const optionItems = multiComboBox.findAll("[role='option']");

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
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    const optionItems = multiComboBox.findAll("[role='option']");

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
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    const optionItems = multiComboBox.findAll("[role='option']");

    // Open the popup and moves the focus
    await button.trigger("click");
    await button.trigger("keydown.up");

    // Press key "home" and check the focus is correct
    await button.trigger("keydown.home");
    expect(optionItems[0].classes()).toContain("focused");
    expect(button.attributes()["aria-activedescendant"]).toBe(optionItems[0].attributes().id);
  });

  it("moves the focus to the last option when pressing 'end'", async () => {
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    const optionItems = multiComboBox.findAll("[role='option']");

    // Open the popup
    await button.trigger("click");
    await button.trigger("keydown.down");

    // Press key "home" and check the focus is correct
    await button.trigger("keydown.end");
    expect(optionItems[2].classes()).toContain("focused");
    expect(button.attributes()["aria-activedescendant"]).toBe(optionItems[2].attributes().id);
  });
});

describe("MultiComboBox interactions with popup open", () => {
  beforeEach(() => {
    props = { id, options, selected: new Set(["1"]) };
  });

  it("closes the popup when clicking outside it", async () => {
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    const popup = multiComboBox.find("#" + props.id + "_popup");

    // Open the popup
    await button.trigger("click");

    // Close the popup
    document.dispatchEvent(new Event("click"));
    await multiComboBox.vm.$nextTick();

    // Check it is closed
    expect(popup.isVisible()).toBe(false);
  });

  it("removes the event listener when unmounting the component", async () => {
    // Spy the document
    vi.spyOn(document, "addEventListener");
    vi.spyOn(document, "removeEventListener");

    // Mount the ComboBox
    const comboBox = mount(MultiComboBox, { props: props });

    // Check a listener is created
    expect(document.addEventListener).toBeCalled();

    // Unmount the component
    comboBox.unmount();

    // Check the listener is removed
    expect(document.removeEventListener).toBeCalled();
  });

  it("closes the popup when pressing 'escape'", async () => {
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    const popup = multiComboBox.find("#" + props.id + "_popup");

    // Open the popup
    await button.trigger("click");

    // Press key "escape"
    await button.trigger("keydown.escape");

    // Check the popup is open
    expect(popup.isVisible()).toBe(false);
  });

  it("closes the popup when pressing tab", async () => {
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    const popup = multiComboBox.find("#" + props.id + "_popup");

    // Open the popup
    await button.trigger("click");

    // Press key "tab"
    await button.trigger("keydown.tab");

    // Check it is closed
    expect(popup.isVisible()).toBe(false);
  });

  it("keeps the popup open when clicking inside it (not on an option)", async () => {
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    const popup = multiComboBox.find("#" + props.id + "_popup");

    // Open the popup and click inside it
    await button.trigger("click");
    await popup.trigger("click");

    // Check it is open
    expect(popup.isVisible()).toBe(true);
  });

  it("emits an event when pressing 'enter'", async () => {
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");

    // Open the popup
    await button.trigger("click");

    // Move the focus to the last option
    await button.trigger("keydown.end");

    // Press key "enter"
    await button.trigger("keydown.enter");

    // Check the correct event is emitted
    expect(props.selected).toEqual(new Set(["1", "2"]));
  });

  it("emits an event when selecting a new option", async () => {
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");

    // Open the popup
    await button.trigger("click");

    // Click on a new option
    const optionItem = multiComboBox.findAll("[role='option']")[2];
    await optionItem.trigger("click");

    // Check the correct event is emitted
    expect(props.selected).toEqual(new Set(["1", "2"]));
  });

  it("emits an event when deselecting an option", async () => {
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");

    // Open the popup
    await button.trigger("click");

    // Click on the selected option
    const optionItem = multiComboBox.findAll("[role='option']")[1];
    await optionItem.trigger("click");

    // Check the correct event is emitted
    expect(props.selected).toEqual(new Set([]));
  });
});

describe("MultiComboBox popup scroll behavior", () => {
  const optionsCount = 20;
  const popupHeight = 100;
  const optionHeight = 10;
  let scrollTop = 0;

  beforeEach(() => {
    props = { id, options: [], selected: new Set() };
    for (let i = 0; i < optionsCount; i++) {
      props.options!.push({ id: i.toString(), text: `option${i}` });
    }
    HTMLElement.prototype.scrollTo = (_, scrollY?) => (scrollTop = scrollY as number);
  });

  it("scrolls to show focused item", async () => {
    // Mount the MultiComboBox
    const multiComboBox = mount(MultiComboBox, { props: props });
    const button = multiComboBox.find("button");
    const popup = multiComboBox.find("#" + props.id + "_popup");
    const optionItems = multiComboBox.findAll("[role='option']");

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
