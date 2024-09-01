import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";

import AnimationOverlay from "@/components/AnimationOverlay.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      fps: 36,
    };
  });

  it("renders correctly", () => {
    // Mount the AnimationOverlay
    const animationOverlay = mount(AnimationOverlay, { props: props });

    // Get the DOM elements
    const metrics = animationOverlay.find(".metrics");
    const metricsButton = animationOverlay.find({ ref: "metricsButton" });
    const pauseButton = animationOverlay.find({ ref: "pauseButton" });
    const fullscreenButton = animationOverlay.find({ ref: "fullscreenButton" });

    // Check the FPS metric is not displayed
    expect(metrics.exists()).toBe(false);

    // Check the buttons are rendered correctly
    expect(metricsButton.text()).toBe("Show metrics");
    expect(pauseButton.text()).toBe("Pause");
    expect(fullscreenButton.text()).toBe("Fullscreen");
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    props = {
      fps: 36,
    };
  });

  it("shows fps when clicking metrics button", async () => {
    // Mount the AnimationOverlay
    const animationOverlay = mount(AnimationOverlay, { props: props });

    // Get the metric button
    const metricsButton = animationOverlay.find({ ref: "metricsButton" });

    // Click the metrics button and check the metrics are displayed
    await metricsButton.trigger("click");
    await animationOverlay.vm.$nextTick();
    let metrics = animationOverlay.find(".metrics");
    expect(metrics.exists()).toBe(true);
    expect(metrics.text()).toBe(props.fps.toString());
    expect(metricsButton.text()).toBe("Hide metrics");

    // Click the metrics button again and check the metrics are hidden
    await metricsButton.trigger("click");
    metrics = animationOverlay.find(".metrics");
    expect(metrics.exists()).toBe(false);
  });

  it("emits pause and unpause events when clicking the pause button", async () => {
    // Mount the AnimationOverlay
    const animationOverlay = mount(AnimationOverlay, { props: props });

    // Get the pause button
    const pauseButton = animationOverlay.find({ ref: "pauseButton" });

    // Click the pause button and check a pause event is emitted
    await pauseButton.trigger("click");
    expect(animationOverlay.emitted().pause).toBeDefined();
    expect(pauseButton.text()).toBe("Play");

    // Click the pause button again and check an unpause event is emitted
    await pauseButton.trigger("click");
    expect(animationOverlay.emitted().unpause).toBeDefined();
  });

  it("goes and leaves fullscreen when clicking fullscreen button", async () => {
    // Mount the AnimationOverlay
    const animationOverlay = mount(AnimationOverlay, { props: props });

    // Get the fullscreen button
    const fullscreenButton = animationOverlay.find({ ref: "fullscreenButton" });

    // Click the fullscreen button and check a fullscreen event is emitted
    await fullscreenButton.trigger("click");
    expect(animationOverlay.emitted().fullscreen).toBeDefined();
    document.dispatchEvent(new Event("fullscreenchange"));
    await animationOverlay.vm.$nextTick();
    expect(fullscreenButton.text()).toBe("Leave fullscreen");

    // Mock document exitFullscreen method
    const exitFullscreen = vi.fn();
    document.exitFullscreen = exitFullscreen;

    // Click the fullscreen button again and check the exitFullscreen is called
    await fullscreenButton.trigger("click");
    expect(exitFullscreen).toBeCalled();
  });

  it("goes and leaves fullscreen when pressing 'f' key", async () => {
    // Mount the AnimationOverlay
    const animationOverlay = mount(AnimationOverlay, { props: props });

    // Press 'f' key and check fullscreen is emitted
    const event = new KeyboardEvent("keyup", { key: "f" });
    Object.defineProperty(event, "target", { writable: false, value: { tagName: "" } });
    document.dispatchEvent(event);
    await animationOverlay.vm.$nextTick();
    expect(animationOverlay.emitted().fullscreen).toBeDefined();
    document.dispatchEvent(new Event("fullscreenchange"));
    await animationOverlay.vm.$nextTick();

    // Mock document exitFullscreen method
    const exitFullscreen = vi.fn();
    document.exitFullscreen = exitFullscreen;

    // Press 'f' key again and check the exitFullscreen is called
    document.dispatchEvent(event);
    await animationOverlay.vm.$nextTick();
    expect(exitFullscreen).toBeCalled();
  });

  it("does not trigger fullscreen when pressing 'f' key in an input", async () => {
    // Mount the AnimationOverlay
    const animationOverlay = mount(AnimationOverlay, { props: props });

    // Press 'f' key and check fullscreen is emitted
    const event = new KeyboardEvent("keyup", { key: "f" });
    Object.defineProperty(event, "target", { writable: false, value: { tagName: "input" } });
    document.dispatchEvent(event);
    await animationOverlay.vm.$nextTick();
    expect(animationOverlay.emitted().fullscreen).toBeUndefined();
  });

  it("displays the menu when the mouse moves", async () => {
    // Use fake timers to avoid waiting
    vi.useFakeTimers();

    // Mount the AnimationOverlay
    const animationOverlay = mount(AnimationOverlay, { props: props });

    // Get the elements
    const overlay = animationOverlay.find(".animation-overlay");
    const menu = animationOverlay.find(".animation-menu");

    // Moves the mouse and check the menu is displayed
    await overlay.trigger("mousemove");
    expect(menu.classes()).toContain("show");

    // Check the menu is not displayed anymore after a 3s
    vi.advanceTimersByTime(3000);
    await animationOverlay.vm.$nextTick();
    expect(menu.classes()).not.toContain("show");
  });

  it("hides the menu when the mouse leaves", async () => {
    // Mount the AnimationOverlay
    const animationOverlay = mount(AnimationOverlay, { props: props });

    // Get the elements
    const overlay = animationOverlay.find(".animation-overlay");
    const menu = animationOverlay.find(".animation-menu");

    // Moves the mouse to display the menu
    await overlay.trigger("mousemove");

    // Leaves the overlay with the mouse and check the menu is hidden
    await overlay.trigger("mouseleave");
    expect(menu.classes()).not.toContain("show");
  });
});
