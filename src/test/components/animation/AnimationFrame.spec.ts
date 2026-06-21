import AnimationFrame from "@/components/animation/AnimationFrame.vue";
import AnimationOverlay from "@/components/animation/AnimationOverlay.vue";
import FunctionTypes from "@/constants/FunctionTypes";
import {
  COORDINATES_CENTRE,
  COORDINATES_SCALE,
  DENOMINATOR,
  EPSILON,
  FATOU_HUE,
  FATOU_SATURATION_OFFSET,
  FATOU_SATURATION_STRENGTH,
  FATOU_VALUE_OFFSET,
  FATOU_VALUE_STRENGTH,
  IS_NEWTON,
  ITERATIONS_COUNT,
  JULIA_BOUND,
  JULIA_HSV,
  NEWTON_COEFFICIENT,
  NUMERATOR,
} from "@/generators/FractalGeneratorParameter";
import WebGpuFractalGenerator from "@/generators/WebGpuFractalGenerator";
import Complex from "@/models/Complex";
import Configuration from "@/models/Configuration";
import type FractalFunction from "@/models/FractalFunction";
import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";

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
    vi.spyOn(WebGpuFractalGenerator, "initialise").mockReturnValue(mockedFractalGenerator as never);
    mockedFractalGenerator.startAnimation = vi.fn();

    // Mock the ResizeObserver
    vi.stubGlobal(
      "ResizeObserver",
      vi.fn(() => ({ observe: vi.fn() })),
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
    vi.spyOn(WebGpuFractalGenerator, "initialise").mockReturnValue(error as never);

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
    expect(console.error).toHaveBeenCalledWith(error);
  });
});

describe("Interactions", () => {
  let initialise: MockInstance<
    (
      canvas: HTMLCanvasElement,
      fractalFunction: FractalFunction,
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
      .mockReturnValue(mockedFractalGenerator as never);
    mockedFractalGenerator.destroy = vi.fn();

    // Mock the ResizeObserver
    vi.stubGlobal(
      "ResizeObserver",
      vi.fn().mockImplementation(function (
        this: ResizeObserver & { callback: ResizeObserverCallback },
        callback: ResizeObserverCallback,
      ) {
        this.observe = vi.fn();
        this.unobserve = vi.fn();
        this.disconnect = vi.fn();
        this.callback = callback;
      }),
    );
  });

  it("initialise the animation correctly", () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });

    // Check initialisation is called correctly
    expect(initialise).toHaveBeenCalledWith(animationFrame.find("canvas").element);
  });

  it("recreates the viewport when the window size changes", async () => {
    // Mount the AnimationFrame
    mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Trigger the window resize and check createViewport is called
    window.dispatchEvent(new Event("resize"));
    expect(mockedFractalGenerator.updateCanvasResolution).toHaveBeenCalledWith(
      props.configuration.resolutionScale,
    );
  });

  it("observes the canvas size correctly", async () => {
    // Mock the ResizeObserver to directly call its callback
    const observe = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      vi.fn().mockImplementation(function (
        this: ResizeObserver & { callback: ResizeObserverCallback },
        callback: ResizeObserverCallback,
      ) {
        callback([], this);
        this.observe = observe;
        this.unobserve = vi.fn();
        this.disconnect = vi.fn();
        this.callback = callback;
      }),
    );

    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Check the ResizeObserver has been created correctly
    expect(mockedFractalGenerator.updateViewportDimensionRatio).toHaveBeenCalled();
    expect(observe).toHaveBeenCalledWith(animationFrame.find("canvas").element);
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
    expect(mockedFractalGenerator.updateCanvasResolution).toHaveBeenCalledWith(newResolutionScale);
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
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(
      COORDINATES_SCALE,
      newCoordinatesScale,
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
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(COORDINATES_CENTRE, [
      newCoordinatesCentre.re,
      newCoordinatesCentre.im,
    ]);
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
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(
      ITERATIONS_COUNT,
      newIterationsCount,
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
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(EPSILON, newEpsilon);
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
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(JULIA_BOUND, newJuliaBound);
  });

  it("updates the fractal engine when the fractal function changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the fractal function
    animationFrame.vm.$props.configuration.fractalFunction.setFunctionType(FunctionTypes.NEWTON);
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(IS_NEWTON, 1);
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(
      NEWTON_COEFFICIENT,
      props.configuration.fractalFunction.newtonCoefficient.getEllipseParameters(),
    );
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(
      NUMERATOR,
      props.configuration.fractalFunction.getNumeratorCoefficientsEllipseParameters(),
    );
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(
      DENOMINATOR,
      props.configuration.fractalFunction.getDenominatorCoefficientsEllipseParameters(),
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
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(IS_NEWTON, 0);
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(
      NEWTON_COEFFICIENT,
      props.configuration.fractalFunction.newtonCoefficient.getEllipseParameters(),
    );
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(
      NUMERATOR,
      props.configuration.fractalFunction.getNumeratorCoefficientsEllipseParameters(),
    );
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(
      DENOMINATOR,
      props.configuration.fractalFunction.getDenominatorCoefficientsEllipseParameters(),
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
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(
      JULIA_HSV,
      props.configuration.juliaHSV,
    );
  });

  it("updates the fractal engine when the Fatou hue changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the Fatou hue
    const newFatouHue = 180;
    animationFrame.vm.$props.configuration.fatouHue = newFatouHue;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(FATOU_HUE, newFatouHue);
  });

  it("updates the fractal engine when the Fatou saturation strength changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the Fatou saturation strength
    const newFatouSaturationStrength = 0.3;
    animationFrame.vm.$props.configuration.fatouSaturationStrength = newFatouSaturationStrength;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(
      FATOU_SATURATION_STRENGTH,
      newFatouSaturationStrength,
    );
  });

  it("updates the fractal engine when the Fatou saturation offset changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the Fatou saturation offset
    const newFatouSaturationOffset = 0.3;
    animationFrame.vm.$props.configuration.fatouSaturationOffset = newFatouSaturationOffset;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(
      FATOU_SATURATION_OFFSET,
      newFatouSaturationOffset,
    );
  });

  it("updates the fractal engine when the Fatou value strength changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the Fatou value strength
    const newFatouValueStrength = 0.3;
    animationFrame.vm.$props.configuration.fatouValueStrength = newFatouValueStrength;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(
      FATOU_VALUE_STRENGTH,
      newFatouValueStrength,
    );
  });

  it("updates the fractal engine when the Fatou value offset changes", async () => {
    // Mount the AnimationFrame
    const animationFrame = mount(AnimationFrame, { props: props, shallow: true });
    await flushPromises();

    // Change the Fatou value offset
    const newFatouValueOffset = 0.3;
    animationFrame.vm.$props.configuration.fatouValueOffset = newFatouValueOffset;
    await animationFrame.vm.$nextTick();

    // Check the fractal engine is updated
    expect(mockedFractalGenerator.updateParameter).toHaveBeenCalledWith(
      FATOU_VALUE_OFFSET,
      newFatouValueOffset,
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
