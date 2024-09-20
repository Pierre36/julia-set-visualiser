import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ExpandableDisclosure, { type Props } from "@/components/ExpandableDisclosure.vue";

let props: Props;

const headingCentred = true;
const headingLevel = 2;
const headingText = "heading text";
const buttonTitle = "button title";
const buttonSvgPath = "button svg path";
const rotateWhenExpand = true;

describe("Render", () => {
  beforeEach(() => {
    props = {
      headingCentred: headingCentred,
      headingLevel: headingLevel,
      headingText: headingText,
      buttonTitle: buttonTitle,
      buttonSvgPath: buttonSvgPath,
      rotateWhenExpand: rotateWhenExpand,
    };
  });

  it("renders the header correctly", () => {
    // Mount the ExpandableDisclosure
    const disclosure = mount(ExpandableDisclosure, { props: props });

    // Get the header
    const header = disclosure.find(".title");

    // Check the header is rendered correctly
    expect(header.element.matches("h" + headingLevel)).toBe(true);
    expect(header.classes()).toContain("centred");
    expect(header.text()).toBe(headingText);
  });

  it("renders the expand button correctly", () => {
    // Mount the ExpandableDisclosure
    const disclosure = mount(ExpandableDisclosure, { props: props });

    // Get the button
    const expandButton = disclosure.find(".icon-button");
    const expandSVG = expandButton.find("svg");

    // Check the button is rendered correctly
    expect(expandSVG.find("title").text()).toBe(buttonTitle);
    expect(expandSVG.find("path").attributes().d).toBe(buttonSvgPath);
    expect(expandButton.attributes().role).toBe("button");
    expect(expandButton.attributes()["aria-expanded"]).toBe("false");
    expect(expandButton.classes()).toContain("rotate");
  });

  it("renders the content correctly", async () => {
    // Mount the ExpandableDisclosure
    const contentText = "CONTENT TEXT";
    const disclosure = mount(ExpandableDisclosure, {
      props: props,
      slots: { default: "<div>" + contentText + "</div>" },
    });

    // Click the expand button to show the content
    await disclosure.find(".icon-button").trigger("click");

    // Get the content container
    const contentContainer = disclosure.find(".disclosure-content");

    // Check the content is rendered correctly
    expect(contentContainer.text()).toBe(contentText);
  });
});

describe("Interactions", () => {
  beforeEach(() => {
    props = {
      headingCentred: headingCentred,
      headingLevel: headingLevel,
      headingText: headingText,
      buttonTitle: buttonTitle,
      buttonSvgPath: buttonSvgPath,
      rotateWhenExpand: rotateWhenExpand,
    };
  });

  it("displays the content when clicking on the expand button", async () => {
    // Mount the ExpandableDisclosure
    const disclosure = mount(ExpandableDisclosure, { props: props });

    // Get the DOM elements
    const expandButton = disclosure.find(".icon-button");
    const contentPanel = disclosure.find(".content-container");

    // Check the content is initially collapsed
    expect(expandButton.attributes()["aria-expanded"]).toBe("false");
    expect(contentPanel.attributes()["data-expanded"]).toBe("false");
    expect(contentPanel.find(".disclosure-content").exists()).toBe(false);

    // Click the content button
    await expandButton.trigger("click");

    // Check the info is now expanded
    expect(expandButton.attributes()["aria-expanded"]).toBe("true");
    expect(contentPanel.attributes()["data-expanded"]).toBe("true");
    expect(contentPanel.find(".disclosure-content").exists()).toBe(true);

    // Click the info button again
    await expandButton.trigger("click");

    // Check the info is collapsed again
    expect(expandButton.attributes()["aria-expanded"]).toBe("false");
    expect(contentPanel.attributes()["data-expanded"]).toBe("false");
    expect(contentPanel.find(".disclosure-content").exists()).toBe(false);
  });
});
