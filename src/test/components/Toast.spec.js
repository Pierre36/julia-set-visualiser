import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";

import Toast from "@/components/Toast.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    // Prepare the props
    props = {
      text: "Toast text",
      animationDuration: 200,
      displayDuration: 1000,
    };

    // Use fake timers
    vi.useFakeTimers();
  });

  it("renders correctly", async () => {
    // Mount the Toast
    const wrapper = mount(Toast, { props: props, shallow: true });

    // Show the toast
    wrapper.vm.show();
    await wrapper.vm.$nextTick();

    // Check the toast is rendered correctly
    const toast = wrapper.find("div");
    expect(toast.attributes().role).toBe("alert");
    expect(toast.text()).toBe(props.text);
    expect(toast.attributes().style).toBe("--duration: " + props.animationDuration + "ms;");
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    // Prepare the props
    props = {
      text: "Toast text",
      animationDuration: 200,
      displayDuration: 1000,
    };

    // Use fake timers
    vi.useFakeTimers();
  });

  it("shows the toast when using show method", async () => {
    // Mount the Toast
    const wrapper = mount(Toast, { props: props, shallow: true });

    // Show the toast
    wrapper.vm.show();
    await wrapper.vm.$nextTick();

    // Check the toast is shown
    const toast = wrapper.find("div");
    expect(toast.exists()).toBe(true);
  });

  it("hides the toast after the display duration", async () => {
    // Mount the Toast
    const wrapper = mount(Toast, { props: props, shallow: true });

    // Show the toast
    wrapper.vm.show();
    await wrapper.vm.$nextTick();
    vi.advanceTimersByTime(props.animationDuration + props.displayDuration);

    // Check the toast is not shown anymore
    const toast = wrapper.find("div");
    expect(toast.exists()).toBe(true);
  });
});
