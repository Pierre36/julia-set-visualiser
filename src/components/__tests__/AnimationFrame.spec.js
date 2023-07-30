import { describe, it, expect, beforeEach, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { Configuration } from "../../models/Configuration";
import { FractalEngine } from "../../models/FractalEngine";

import AnimationFrame from "../AnimationFrame.vue";
import AnimationOverlay from "../AnimationOverlay.vue";
import { Complex } from "../../models/Complex";
import { Attractor } from "../../models/Attractor";

describe("Render", () => {
  let props;

  beforeEach(() => {
    // Prepare the props
    props = {
      configuration: Configuration.defaultConfiguration(),
    };

    // Mock the FractalEngine displayScene method
    vi.spyOn(FractalEngine.prototype, "displayScene").mockImplementation(vi.fn());

    // Mock the ResizeObserver
    vi.stubGlobal(
      "ResizeObserver",
      vi.fn(() => ({ observe: vi.fn() }))
    );
  });

  it("renders properly", () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Get the elements
    const canvas = animationFrame.find("canvas");
    const animationOverlay = animationFrame.findComponent(AnimationOverlay);
    const errorMessage = animationFrame.find("#errorMessage");

    // Check the AnimationFrame is rendered properly
    expect(canvas.exists()).toBe(true);
    expect(animationOverlay.vm.$props.fps).toBe(0);
    expect(errorMessage.exists()).toBe(false);
  });

  it("shows an error message when fails to display the scene", async () => {
    // Make displayScene throw an error
    const error = new Error("error message");
    vi.spyOn(FractalEngine.prototype, "displayScene").mockImplementation(() => {
      throw error;
    });

    // Mock console.error
    console.error = vi.fn();

    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await animationFrame.vm.$nextTick();

    // Get the errorMessage
    const errorMessage = animationFrame.find("#errorMessage");

    // Check the errorMessage renders correctly
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.find("p").text()).toBe(error.toString());

    // Check console.error is called correctly
    expect(console.error).toBeCalledWith(error);
  });
});

describe("Interactions", () => {
  let props;
  let displayScene;
  let createViewport;
  let updateDimensionRatio;
  let pause;
  let unpause;
  let setCoordinatesScale;
  let setCoordinatesCenter;
  let setNbIterations;
  let setEpsilon;
  let setJuliaBound;
  let setFractalFunction;
  let setJuliaHSV;
  let setDefaultAttractor;
  let setInfinityAttractor;
  let setAttractors;

  beforeEach(() => {
    // Prepare the props
    props = {
      configuration: Configuration.defaultConfiguration(),
    };

    // Mock the FractalEngine methods
    displayScene = vi.spyOn(FractalEngine.prototype, "displayScene").mockImplementation(vi.fn());
    createViewport = vi
      .spyOn(FractalEngine.prototype, "createViewport")
      .mockImplementation(vi.fn());
    updateDimensionRatio = vi
      .spyOn(FractalEngine.prototype, "updateDimensionRatio")
      .mockImplementation(vi.fn());
    pause = vi.spyOn(FractalEngine.prototype, "pause").mockImplementation(vi.fn());
    unpause = vi.spyOn(FractalEngine.prototype, "unpause").mockImplementation(vi.fn());
    setCoordinatesScale = vi
      .spyOn(FractalEngine.prototype, "setCoordinatesScale")
      .mockImplementation(vi.fn());
    setCoordinatesCenter = vi
      .spyOn(FractalEngine.prototype, "setCoordinatesCenter")
      .mockImplementation(vi.fn());
    setNbIterations = vi
      .spyOn(FractalEngine.prototype, "setNbIterations")
      .mockImplementation(vi.fn());
    setEpsilon = vi.spyOn(FractalEngine.prototype, "setEpsilon").mockImplementation(vi.fn());
    setJuliaBound = vi.spyOn(FractalEngine.prototype, "setJuliaBound").mockImplementation(vi.fn());
    setFractalFunction = vi
      .spyOn(FractalEngine.prototype, "setFractalFunction")
      .mockImplementation(vi.fn());
    setJuliaHSV = vi.spyOn(FractalEngine.prototype, "setJuliaHSV").mockImplementation(vi.fn());
    setDefaultAttractor = vi
      .spyOn(FractalEngine.prototype, "setDefaultAttractor")
      .mockImplementation(vi.fn());
    setInfinityAttractor = vi
      .spyOn(FractalEngine.prototype, "setInfinityAttractor")
      .mockImplementation(vi.fn());
    setAttractors = vi.spyOn(FractalEngine.prototype, "setAttractors").mockImplementation(vi.fn());

    // Mock the ResizeObserver
    vi.stubGlobal(
      "ResizeObserver",
      vi.fn(() => ({ observe: vi.fn() }))
    );
  });

  it("displays the scene correctly", () => {
    // Mount the AnimationFrame
    mount(AnimationFrame, { props: props, shallow: true });

    // Check displayScene is called correctly
    const expectedConfiguration = new Configuration();
    expectedConfiguration.fillWith(props.configuration);
    expect(displayScene).toBeCalledWith(expectedConfiguration);
  });

  it("recreates the viewport when the window size changes", () => {
    // Mount the AnimationFrame
    mount(AnimationFrame, { props: props, shallow: true });

    // Trigger the window resize and check createViewport is called
    window.dispatchEvent(new Event("resize"));
    expect(createViewport).toBeCalledWith(props.configuration.resolutionScale);
  });

  it("observes the canvas size correctly", () => {
    // Mock the ResizeObserver to directly call its callback
    const observe = vi.fn();
    const resizeObserver = vi.fn((callback) => {
      callback();
      return { observe: observe };
    });
    vi.stubGlobal("ResizeObserver", resizeObserver);

    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Check the ResizeObserver has been created correctly
    expect(updateDimensionRatio).toBeCalled();
    expect(observe).toBeCalledWith(animationFrame.find("canvas").element);
  });

  it("requests full screen when animation overlay emits fullscreen event", () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Mock requestFullscreen
    const frame = animationFrame.find({ ref: "animationFrame" });
    const requestFullscreen = vi.fn();
    frame.element.requestFullscreen = requestFullscreen;

    // Make the animation overlay emit fullscreen event
    const animationOverlay = animationFrame.findComponent(AnimationOverlay);
    animationOverlay.vm.$emit("fullscreen");

    // Check requestFullscreen is called
    expect(requestFullscreen).toBeCalled();
  });

  it("pauses the animation when animation overlay emits pause event", () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Make the animation overlay emit pause event
    const animationOverlay = animationFrame.findComponent(AnimationOverlay);
    animationOverlay.vm.$emit("pause");

    // Check pause is called
    expect(pause).toBeCalled();
  });

  it("unpauses the animation when animation overlay emits unpause event", () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Make the animation overlay emit unpause event
    const animationOverlay = animationFrame.findComponent(AnimationOverlay);
    animationOverlay.vm.$emit("unpause");

    // Check unpause is called
    expect(unpause).toBeCalled();
  });

  it("updates the fractal engine when the resolution scale changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Change the resolution scale
    const newResolutionScale = 0.36;
    animationFrame.vm.$props.configuration.resolutionScale = newResolutionScale;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(createViewport).toBeCalledWith(newResolutionScale);
  });

  it("updates the fractal engine when the coordinates scale changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Change the coordinates scale
    const newCoordinatesScale = 0.36;
    animationFrame.vm.$props.configuration.coordinatesScale = newCoordinatesScale;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(setCoordinatesScale).toBeCalledWith(newCoordinatesScale);
  });

  it("updates the fractal engine when the coordinates center changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Change the coordinates center
    const newCoordinatesCenter = new Complex(3, 6);
    animationFrame.vm.$props.configuration.coordinatesCenter = newCoordinatesCenter;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(setCoordinatesCenter).toBeCalledWith(newCoordinatesCenter);
  });

  it("updates the fractal engine when the number of iterations changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Change the number of iterations
    const newNbIterations = 36;
    animationFrame.vm.$props.configuration.nbIterations = newNbIterations;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(setNbIterations).toBeCalledWith(newNbIterations);
  });

  it("updates the fractal engine when epsilon changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Change epsilon
    const newEpsilon = 36;
    animationFrame.vm.$props.configuration.epsilon = newEpsilon;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(setEpsilon).toBeCalledWith(newEpsilon);
  });

  it("updates the fractal engine when the Julia bound changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Change the Julia bound
    const newJuliaBound = -36;
    animationFrame.vm.$props.configuration.juliaBound = newJuliaBound;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(setJuliaBound).toBeCalledWith(newJuliaBound);
  });

  it("updates the fractal engine when the fractal function changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Change the fractal function
    animationFrame.vm.$props.configuration.fractalFunction.setFunctionType("NEWTON");
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(setFractalFunction).toBeCalledWith(props.configuration.fractalFunction);
  });

  it("updates the fractal engine when the Julia HSV changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Change the Julia HSV
    animationFrame.vm.$props.configuration.juliaHSV[0] = 36;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(setJuliaHSV).toBeCalledWith(props.configuration.juliaHSV);
  });

  it("updates the fractal engine when the default attractor changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Change the default attractor
    animationFrame.vm.$props.configuration.defaultAttractor.hue = 36;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(setDefaultAttractor).toBeCalledWith(props.configuration.defaultAttractor);
  });

  it("updates the fractal engine when the infinity attractor changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Change the infinity attractor
    animationFrame.vm.$props.configuration.infinityAttractor.hue = 36;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(setInfinityAttractor).toBeCalledWith(props.configuration.infinityAttractor);
  });

  it("updates the fractal engine when an attractor changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Add an attractor
    animationFrame.vm.$props.configuration.attractors.push(
      new Attractor(new Complex(0, 0), 36, 0.1, 0.2, 0.3, 0.4)
    );
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(setAttractors).toBeCalledWith(props.configuration.attractors);
  });

  it("updates the fps when the fractal engine fps changes", async () => {
    // Use fake timers to avoid waiting
    vi.useFakeTimers();

    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Change the fps
    const newFPS = 36;
    animationFrame.vm.$data.fractalEngine.fps = newFPS;
    vi.advanceTimersByTime(300);
    await animationFrame.vm.$nextTick();

    // Check the fps is updated
    const animationOverlay = animationFrame.findComponent(AnimationOverlay);
    expect(animationOverlay.vm.$props.fps).toBe(newFPS);
  });
});
