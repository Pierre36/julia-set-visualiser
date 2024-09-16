import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Toast, { type Props } from "@/components/Toast.vue";

let props: Props;

const text = "Toast text";
const animationDuration = 200;
const displayDuration = 1000;

describe("Render", () => {
  beforeEach(() => {
    // Prepare the props
    props = {
      text: text,
      animationDuration: animationDuration,
      displayDuration: displayDuration,
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
    expect(toast.text()).toBe(text);
    expect(toast.attributes().style).toBe("--duration: " + animationDuration + "ms;");
  });
});

describe("Interactions", () => {
  beforeEach(() => {
    // Prepare the props
    props = {
      text: text,
      animationDuration: animationDuration,
      displayDuration: displayDuration,
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
    vi.advanceTimersByTime(animationDuration + displayDuration);

    // Check the toast is not shown anymore
    const toast = wrapper.find("div");
    expect(toast.exists()).toBe(true);
  });
});
