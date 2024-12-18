import { describe, it, expect, beforeEach, vi, type MockInstance } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Configuration from "@/models/Configuration";
import WebGpuFractalGenerator from "@/generators/WebGpuFractalGenerator";
import AnimationFrame from "@/components/animation/AnimationFrame.vue";
import AnimationOverlay from "@/components/animation/AnimationOverlay.vue";
import Complex from "@/models/Complex";
import Attractor from "@/models/Attractor";
import FunctionTypes from "@/constants/FunctionTypes";
import FractalGeneratorParameters from "@/generators/FractalGeneratorParameters";
import type FractalFunction from "@/models/FractalFunction";

interface TestProps {
  configuration: Configuration;
}

let props: TestProps;

const configuration = Configuration.defaultConfiguration();

describe("Render", () => {
  beforeEach(() => {
    // Prepare the props
    props = { configuration: configuration.copy() };

    // Mock the WebGpuFractalGenerator initialise method
    const mockedFractalGenerator = vi.mocked(WebGpuFractalGenerator.prototype, true);
    vi.spyOn(WebGpuFractalGenerator, "initialise").mockReturnValue(mockedFractalGenerator as any);
    mockedFractalGenerator.startAnimation = vi.fn();

    // Mock the ResizeObserver
    vi.stubGlobal(
      "ResizeObserver",
      vi.fn(() => ({ observe: vi.fn() }))
    );
  });

  it("renders properly", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Get the elements
    const canvas = animationFrame.find("canvas");
    const animationOverlay = animationFrame.findComponent(AnimationOverlay);
    const errorMessage = animationFrame.find("#error-message");

    // Check the AnimationFrame is rendered properly
    expect(canvas.exists()).toBe(true);
    expect(animationOverlay.vm.$props.metrics).toEqual({
      fps: 0,
      javascriptTime: 0,
      computeTime: 0,
      renderTime: 0,
    });
    expect(errorMessage.exists()).toBe(false);
  });

  it("shows an error message when fails to initialise the fractal generator", async () => {
    // Make initialise throw an error
    const error = new Error("error message");
    vi.spyOn(WebGpuFractalGenerator, "initialise").mockReturnValue(error as any);

    // Mock console.error
    console.error = vi.fn();

    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Get the errorMessage
    const errorMessage = animationFrame.find("#error-message");

    // Check the errorMessage renders correctly
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.find("p").text()).toBe(error.toString());

    // Check console.error is called correctly
    expect(console.error).toBeCalledWith(error);
  });
});

describe("Interactions", () => {
  let initialise: MockInstance<
    (
      canvas: HTMLCanvasElement,
      fractalFunction: FractalFunction
    ) => Promise<Error | WebGpuFractalGenerator>
  >;
  let mockedFractalGenerator: WebGpuFractalGenerator;

  beforeEach(() => {
    // Prepare the props
    props = { configuration: configuration.copy() };

    // Mock the WebGpuFractalGenerator methods
    mockedFractalGenerator = vi.mocked(WebGpuFractalGenerator.prototype, true);
    mockedFractalGenerator.startAnimation = vi.fn();
    mockedFractalGenerator.updateCanvasResolution = vi.fn();
    mockedFractalGenerator.updateViewportDimensionRatio = vi.fn();
    mockedFractalGenerator.pause = vi.fn();
    mockedFractalGenerator.unpause = vi.fn();
    mockedFractalGenerator.updateParameter = vi.fn();
    initialise = vi
      .spyOn(WebGpuFractalGenerator, "initialise")
      .mockReturnValue(mockedFractalGenerator as any);
    mockedFractalGenerator.destroy = vi.fn();

    // Mock the ResizeObserver
    vi.stubGlobal(
      "ResizeObserver",
      vi.fn(() => ({ observe: vi.fn() }))
    );
  });

  it("initialise the animation correctly", () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Check initialisation is called correctly
    expect(initialise).toBeCalledWith(animationFrame.find("canvas").element);
  });

  it("recreates the viewport when the window size changes", async () => {
    // Mount the AnimationFrame
    mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Trigger the window resize and check createViewport is called
    window.dispatchEvent(new Event("resize"));
    expect(mockedFractalGenerator.updateCanvasResolution).toBeCalledWith(
      props.configuration.resolutionScale
    );
  });

  it("observes the canvas size correctly", async () => {
    // Mock the ResizeObserver to directly call its callback
    const observe = vi.fn();
    const resizeObserver = vi.fn((callback) => {
      callback();
      return { observe: observe };
    });
    vi.stubGlobal("ResizeObserver", resizeObserver);

    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Check the ResizeObserver has been created correctly
    expect(mockedFractalGenerator.updateViewportDimensionRatio).toBeCalled();
    expect(observe).toBeCalledWith(animationFrame.find("canvas").element);
  });

  it("requests full screen when animation overlay emits fullscreen event", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Mock requestFullscreen
    const frame = animationFrame.find({ ref: "animationFrame" });
    const requestFullscreen = vi.fn();
    (frame.element as HTMLElement).requestFullscreen = requestFullscreen;

    // Make the animation overlay emit fullscreen event
    const animationOverlay = animationFrame.findComponent(AnimationOverlay);
    animationOverlay.vm.$emit("fullscreen");

    // Check requestFullscreen is called
    expect(requestFullscreen).toBeCalled();
  });

  it("pauses the animation when animation overlay emits pause event", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Make the animation overlay emit pause event
    const animationOverlay = animationFrame.findComponent(AnimationOverlay);
    animationOverlay.vm.$emit("pause");

    // Check pause is called
    expect(mockedFractalGenerator.pause).toBeCalled();
  });

  it("unpauses the animation when animation overlay emits unpause event", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Make the animation overlay emit unpause event
    const animationOverlay = animationFrame.findComponent(AnimationOverlay);
    animationOverlay.vm.$emit("unpause");

    // Check unpause is called
    expect(mockedFractalGenerator.unpause).toBeCalled();
  });

  it("updates the fractal engine when the resolution scale changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the resolution scale
    const newResolutionScale = 0.36;
    animationFrame.vm.$props.configuration.resolutionScale = newResolutionScale;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateCanvasResolution).toBeCalledWith(newResolutionScale);
  });

  it("updates the fractal engine when the coordinates scale changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the coordinates scale
    const newCoordinatesScale = 0.36;
    animationFrame.vm.$props.configuration.coordinatesScale = newCoordinatesScale;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.COORDINATES_SCALE,
      newCoordinatesScale
    );
  });

  it("updates the fractal engine when the coordinates centre changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the coordinates centre
    const newCoordinatesCentre = new Complex(3, 6);
    animationFrame.vm.$props.configuration.coordinatesCentre = newCoordinatesCentre;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.COORDINATES_CENTRE,
      [newCoordinatesCentre.re, newCoordinatesCentre.im]
    );
  });

  it("updates the fractal engine when the number of iterations changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the number of iterations
    const newIterationsCount = 36;
    animationFrame.vm.$props.configuration.iterationsCount = newIterationsCount;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.ITERATIONS_COUNT,
      newIterationsCount
    );
  });

  it("updates the fractal engine when epsilon changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change epsilon
    const newEpsilon = 36;
    animationFrame.vm.$props.configuration.epsilon = newEpsilon;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.EPSILON,
      newEpsilon
    );
  });

  it("updates the fractal engine when the Julia bound changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the Julia bound
    const newJuliaBound = -36;
    animationFrame.vm.$props.configuration.juliaBound = newJuliaBound;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.JULIA_BOUND,
      newJuliaBound
    );
  });

  it("updates the fractal engine when the fractal function changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the fractal function
    animationFrame.vm.$props.configuration.fractalFunction.setFunctionType(FunctionTypes.NEWTON);
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.IS_NEWTON,
      1
    );
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.NEWTON_COEFFICIENT,
      props.configuration.fractalFunction.newtonCoefficient.getEllipseParameters()
    );
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.NUMERATOR,
      props.configuration.fractalFunction.getNumeratorCoefficientsEllipseParameters()
    );
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.DENOMINATOR,
      props.configuration.fractalFunction.getDenominatorCoefficientsEllipseParameters()
    );
  });

  it("updates the fractal engine when the fractal function changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the fractal function
    animationFrame.vm.$props.configuration.fractalFunction.setFunctionType(FunctionTypes.DEFAULT);
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.IS_NEWTON,
      0
    );
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.NEWTON_COEFFICIENT,
      props.configuration.fractalFunction.newtonCoefficient.getEllipseParameters()
    );
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.NUMERATOR,
      props.configuration.fractalFunction.getNumeratorCoefficientsEllipseParameters()
    );
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.DENOMINATOR,
      props.configuration.fractalFunction.getDenominatorCoefficientsEllipseParameters()
    );
  });

  it("updates the fractal engine when the Julia HSV changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the Julia HSV
    animationFrame.vm.$props.configuration.juliaHSV[0] = 36;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.JULIA_HSV,
      props.configuration.juliaHSV
    );
  });

  it("updates the fractal engine when the default attractor changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the default attractor
    const newHue = 36;
    animationFrame.vm.$props.configuration.defaultAttractor.hue = newHue;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.DEFAULT_COLOUR,
      [
        newHue,
        props.configuration.defaultAttractor.saturationStrength,
        props.configuration.defaultAttractor.saturationOffset,
        props.configuration.defaultAttractor.valueStrength,
        props.configuration.defaultAttractor.valueOffset,
      ]
    );
  });

  it("updates the fractal engine when the infinity attractor changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the infinity attractor
    const newHue = 36;
    animationFrame.vm.$props.configuration.infinityAttractor.hue = newHue;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.INFINITY_COLOUR,
      [
        newHue,
        props.configuration.infinityAttractor.saturationStrength,
        props.configuration.infinityAttractor.saturationOffset,
        props.configuration.infinityAttractor.valueStrength,
        props.configuration.infinityAttractor.valueOffset,
      ]
    );
  });

  it("updates the fractal engine when an attractor changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Add an attractor
    animationFrame.vm.$props.configuration.attractors.push(
      new Attractor(new Complex(0, 0), 36, 0.1, 0.2, 0.3, 0.4)
    );
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.ATTRACTORS,
      [0, 0, 0, 0, 36, 0.1, 0.2, 0.3, 0.4]
    );
    expect(mockedFractalGenerator.updateParameter).toBeCalledWith(
      FractalGeneratorParameters.ATTRACTORS_COUNT,
      props.configuration.attractors.length
    );
  });

  it("updates the metrics when the fractal engine metrics changes", async () => {
    // Use fake timers to avoid waiting
    vi.useFakeTimers();

    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the fps
    const newMetrics = { fps: 5, javascriptTime: 6, computeTime: 7, renderTime: 8 };
    mockedFractalGenerator.getTimingMeasurements = vi.fn(() => newMetrics);
    vi.advanceTimersByTime(300);
    await animationFrame.vm.$nextTick();

    // Check the fps is updated
    const animationOverlay = animationFrame.findComponent(AnimationOverlay);
    expect(animationOverlay.vm.$props.metrics).toEqual(newMetrics);
  });

  it("destroys the fractal generator when unmounted", async () => {
    // Mount and unmount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();
    animationFrame.unmount();
    await flushPromises();

    // Check the fractal generator has been destroyed
    expect(mockedFractalGenerator.destroy).toBeCalled();
  });
});
