import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import InfoHeader from "../InfoHeader.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      headingCentered: true,
      headingLevel: 2,
      headingText: "heading text",
    };
  });

  it("renders the header correctly", () => {
    // Mount the InfoHeader
    const infoHeader = mount(InfoHeader, { props: props });

    // Get the header
    const header = infoHeader.find(".title");

    // Check the header is rendered correctly
    expect(header.element.matches("h" + props.headingLevel)).toBe(true);
    expect(header.classes()).toContain("centered");
    expect(header.text()).toBe(props.headingText);
  });

  it("renders the info button correctly", () => {
    // Mount the InfoHeader
    const infoHeader = mount(InfoHeader, { props: props });

    // Get the button
    const infoButton = infoHeader.find(".icon-button");

    // Check the button is rendered correctly
    expect(infoButton.attributes().role).toBe("button");
    expect(infoButton.attributes()["aria-expanded"]).toBe("false");
  });

  it("renders the info correctly", async () => {
    // Mount the InfoHeader
    const infoText = "INFO TEXT";
    const infoHeader = mount(InfoHeader, {
      props: props,
      slots: { default: "<div>" + infoText + "</div>" },
    });

    // Click the info button to show the info
    await infoHeader.find(".icon-button").trigger("click");

    // Get the info container
    const infoContainer = infoHeader.find(".info-container");

    // Check the info is rendered correctly
    expect(infoContainer.text()).toBe(infoText);
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    props = {
      headingCentered: true,
      headingLevel: 2,
      headingText: "heading text",
    };
  });

  it("displays the info when clicking on info button", async () => {
    // Mount the InfoHeader
    const infoHeader = mount(InfoHeader, { props: props });

    // Get the DOM elements
    const infoButton = infoHeader.find(".icon-button");
    const infoPanel = infoHeader.find(".info-panel");

    // Check the info is initially collapsed
    expect(infoButton.attributes()["aria-expanded"]).toBe("false");
    expect(infoPanel.attributes()["data-expanded"]).toBe("false");
    expect(infoPanel.find(".info-container").exists()).toBe(false);

    // Click the info button
    await infoButton.trigger("click");

    // Check the info is now expanded
    expect(infoButton.attributes()["aria-expanded"]).toBe("true");
    expect(infoPanel.attributes()["data-expanded"]).toBe("true");
    expect(infoPanel.find(".info-container").exists()).toBe(true);

    // Click the info button again
    await infoButton.trigger("click");

    // Check the info is collapsed again
    expect(infoButton.attributes()["aria-expanded"]).toBe("false");
    expect(infoPanel.attributes()["data-expanded"]).toBe("false");
    expect(infoPanel.find(".info-container").exists()).toBe(false);
  });
});
