import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import Disclosure from "../Disclosure.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      headingCentered: true,
      headingLevel: 2,
      headingText: "heading text",
      buttonTitle: "button title",
      buttonSvgPath: "button svg path",
      rotateWhenExpand: true,
    };
  });

  it("renders the header correctly", () => {
    // Mount the Disclosure
    const disclosure = mount(Disclosure, { props: props });

    // Get the header
    const header = disclosure.find(".title");

    // Check the header is rendered correctly
    expect(header.element.matches("h" + props.headingLevel)).toBe(true);
    expect(header.classes()).toContain("centered");
    expect(header.text()).toBe(props.headingText);
  });

  it("renders the expand button correctly", () => {
    // Mount the Disclosure
    const disclosure = mount(Disclosure, { props: props });

    // Get the button
    const expandButton = disclosure.find(".icon-button");
    const expandSVG = expandButton.find("svg");

    // Check the button is rendered correctly
    expect(expandSVG.find("title").text()).toBe(props.buttonTitle);
    expect(expandSVG.find("path").attributes().d).toBe(props.buttonSvgPath);
    expect(expandButton.attributes().role).toBe("button");
    expect(expandButton.attributes()["aria-expanded"]).toBe("false");
    expect(expandButton.classes()).toContain("rotate");
  });

  it("renders the content correctly", async () => {
    // Mount the Disclosure
    const contentText = "CONTENT TEXT";
    const disclosure = mount(Disclosure, {
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
  let props;

  beforeEach(() => {
    props = {
      headingCentered: true,
      headingLevel: 2,
      headingText: "heading text",
      buttonSvgPath: "button svg path",
      rotateWhenExpand: true,
    };
  });

  it("displays the content when clicking on the expand button", async () => {
    // Mount the Disclosure
    const disclosure = mount(Disclosure, { props: props });

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
