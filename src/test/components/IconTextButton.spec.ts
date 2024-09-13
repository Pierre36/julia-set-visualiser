import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import IconTextButton from "@/components/IconTextButton.vue";

describe("Render", () => {
  let props: { svgPath: string; text: string };

  beforeEach(() => {
    props = {
      svgPath: "svgPath",
      text: "text",
    };
  });

  it("renders correctly", () => {
    const iconTextButton = mount(IconTextButton, { props: props });
    const button = iconTextButton.find("button");
    const svg = button.find("svg");
    expect(button.find(".text").text()).toBe(props.text);
    expect(svg.find("title").text()).toBe(props.text);
    expect(svg.find("path").attributes().d).toBe(props.svgPath);
  });
});
