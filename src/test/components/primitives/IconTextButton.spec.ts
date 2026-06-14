import IconTextButton, { type Props } from "@/components/primitives/IconTextButton.vue";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

let props: Props;

const svgPath = "svgPath";
const text = "text";

describe("Render", () => {
  beforeEach(() => {
    props = { svgPath: svgPath, text: text };
  });

  it("renders correctly", () => {
    const iconTextButton = mount(IconTextButton, { props: props });
    const button = iconTextButton.find("button");
    const svg = button.find("svg");
    expect(button.find(".text").text()).toBe(text);
    expect(svg.find("title").text()).toBe(text);
    expect(svg.find("path").attributes().d).toBe(svgPath);
  });
});
