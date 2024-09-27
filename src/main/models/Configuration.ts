import Polynomial from "@/models/Polynomial";
import Attractor, { type RandomAttractorParameters } from "@/models/Attractor";
import Complex, { type RandomComplexParameters } from "@/models/Complex";
import FractalFunction, { type RandomFractalFunctionParameters } from "@/models/FractalFunction";
import RandomUtils from "@/utils/RandomUtils";
import FunctionTypes from "@/constants/FunctionTypes";
import type { JsonSerialisable } from "@/models/JsonSerialisable";

export interface RandomConfigurationParameters {
  fractalFunction: RandomFractalFunctionParameters;
  minJuliaHue: number;
  maxJuliaHue: number;
  minJuliaSaturation: number;
  maxJuliaSaturation: number;
  minJuliaValue: number;
  maxJuliaValue: number;
  attractors: RandomAttractorParameters;
  minViewportScale: number;
  maxViewportScale: number;
  viewportCentre: RandomComplexParameters;
  minIterationsCount: number;
  maxIterationsCount: number;
  minEpsilon: number;
  maxEpsilon: number;
  minJuliaBound: number;
  maxJuliaBound: number;
}

/** Julia Set Visualizer configuration */
export default class Configuration implements JsonSerialisable {
  /**
   * Configuration constructor
   *
   * @param id id of the configuration
   * @param name name of the configuration
   * @param resolutionScale scale of the resolution (if 1, use the resolution of the viewport)
   * @param coordinatesScale scale of the coordinates
   * @param coordinatesCentre centre of the coordinates
   * @param iterationsCount number of iterations
   * @param epsilon epsilon added to the complex number before computing the divergence
   * @param juliaBound highest value of log-divergence in the Fatou Set
   * @param fractalFunction function used for the fractal
   * @param juliaHSV hue, saturation and value of the Julia Set
   * @param defaultAttractor default attractor to use if no attractor is closer
   * @param infinityAttractor attractor for the infinity
   * @param attractors list of the attractors
   */
  public constructor(
    public id: string,
    public name: string,
    public resolutionScale: number,
    public coordinatesScale: number,
    public coordinatesCentre: Complex,
    public iterationsCount: number,
    public epsilon: number,
    public juliaBound: number,
    public fractalFunction: FractalFunction,
    public juliaHSV: number[],
    public defaultAttractor: Attractor,
    public infinityAttractor: Attractor,
    public attractors: Attractor[]
  ) {}

  /**
   * Create a default configuration
   *
   * @returns the default configuration
   */
  public static defaultConfiguration(id = "DEFAULT", name = "Default"): Configuration {
    return new Configuration(
      id,
      name,
      1,
      2,
      new Complex(0, 0),
      20,
      0.01,
      3,
      new FractalFunction(new Polynomial({ 2: new Complex(1, 0) }), FunctionTypes.DEFAULT),
      [0, 0, 1],
      new Attractor(undefined, 210.0, 0.11, 0, 0.26, 1.4),
      new Attractor(undefined, 210.0, 0.11, 0, 0.26, 1.4),
      []
    );
  }

  /**
   * Create an empty configuration
   *
   * @returns an empty configuration
   */
  public static emptyConfiguration(id: string, name: string): Configuration {
    return new Configuration(
      id,
      name,
      1,
      1,
      new Complex(0, 0),
      20,
      0.01,
      3,
      new FractalFunction(new Polynomial({}), FunctionTypes.DEFAULT),
      [0, 0, 0],
      new Attractor(undefined, 0, 0, 0, 0, 0),
      new Attractor(undefined, 0, 0, 0, 0, 0),
      []
    );
  }

  /**
   * Return a string representation of the configuration
   *
   * @returns the String representation
   */
  public toString(): string {
    return `Configuration(${this.id}, ${this.name}, ${this.resolutionScale}, ${
      this.coordinatesScale
    }, ${this.coordinatesCentre}, ${this.iterationsCount}, ${this.epsilon}, ${this.juliaBound}, ${
      this.fractalFunction
    }, [${this.juliaHSV[0]}, ${this.juliaHSV[1]}, ${this.juliaHSV[2]}], ${this.defaultAttractor}, ${
      this.infinityAttractor
    }, [${this.attractors.join(", ")}])`;
  }

  /**
   * Create a configuration from its JSON representation
   *
   * @param json the JSON to deserialise
   * @returns the configuration or `undefined` if the JSON is invalid
   */
  public static fromJSON(json: any): Configuration | undefined {
    if (json === undefined) return undefined;

    if (json.id === undefined) return undefined;
    if (json.name === undefined) return undefined;
    if (json.resolutionScale === undefined || !Number.isFinite(json.resolutionScale))
      return undefined;
    if (json.coordinatesScale === undefined || !Number.isFinite(json.coordinatesScale))
      return undefined;

    const coordinatesCentre = Complex.fromJSON(json.coordinatesCentre);
    if (coordinatesCentre === undefined) return undefined;

    if (json.iterationsCount === undefined || !Number.isFinite(json.iterationsCount))
      return undefined;
    if (json.epsilon === undefined || !Number.isFinite(json.epsilon)) return undefined;
    if (json.juliaBound === undefined || !Number.isFinite(json.juliaBound)) return undefined;

    const fractalFunction = FractalFunction.fromJSON(json.fractalFunction);
    if (fractalFunction === undefined) return undefined;

    if (json.juliaHSV === undefined || !Array.isArray(json.juliaHSV)) return undefined;
    if (json.juliaHSV.length !== 3 || !json.juliaHSV.every(Number.isFinite)) return undefined;

    const defaultAttractor = Attractor.fromJSON(json.defaultAttractor);
    if (defaultAttractor === undefined) return undefined;

    const infinityAttractor = Attractor.fromJSON(json.infinityAttractor);
    if (infinityAttractor === undefined) return undefined;

    if (json.attractors === undefined || !Array.isArray(json.attractors)) return undefined;
    const attractors = json.attractors.map(Attractor.fromJSON);
    if (attractors.some((a: Attractor | undefined) => a === undefined)) return undefined;

    return new Configuration(
      json.id,
      json.name,
      json.resolutionScale,
      json.coordinatesScale,
      coordinatesCentre,
      json.iterationsCount,
      json.epsilon,
      json.juliaBound,
      fractalFunction,
      json.juliaHSV,
      defaultAttractor,
      infinityAttractor,
      attractors
    );
  }

  public toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      resolutionScale: this.resolutionScale,
      coordinatesScale: this.coordinatesScale,
      coordinatesCentre: this.coordinatesCentre.toJSON(),
      iterationsCount: this.iterationsCount,
      epsilon: this.epsilon,
      juliaBound: this.juliaBound,
      fractalFunction: this.fractalFunction.toJSON(),
      juliaHSV: this.juliaHSV,
      defaultAttractor: this.defaultAttractor.toJSON(),
      infinityAttractor: this.infinityAttractor.toJSON(),
      attractors: this.attractors.map((attractor) => attractor.toJSON()),
    };
  }

  /**
   * Create a copy of the configuration
   *
   * @returns a copy of the configuration
   */
  public copy() {
    return new Configuration(
      this.id,
      this.name,
      this.resolutionScale,
      this.coordinatesScale,
      this.coordinatesCentre.copy(),
      this.iterationsCount,
      this.epsilon,
      this.juliaBound,
      this.fractalFunction.copy(),
      this.juliaHSV.slice(),
      this.defaultAttractor.copy(),
      this.infinityAttractor.copy(),
      this.attractors.map((a) => a.copy())
    );
  }

  /**
   * Randomise the configuration with the provided settings
   *
   * @param params parameters of the random configuration
   */
  public randomise(params: RandomConfigurationParameters) {
    this.coordinatesScale = RandomUtils.floatBetween(
      params.minViewportScale,
      params.maxViewportScale
    );
    this.coordinatesCentre = Complex.getRandomComplex(params.viewportCentre);
    this.iterationsCount = RandomUtils.integerBetween(
      params.minIterationsCount,
      params.maxIterationsCount
    );
    this.epsilon = RandomUtils.floatBetween(params.minEpsilon, params.maxEpsilon);
    this.juliaBound = RandomUtils.floatBetween(params.minJuliaBound, params.maxJuliaBound);
    this.fractalFunction = FractalFunction.getRandomFractalFunction(params.fractalFunction);
    this.juliaHSV[0] = RandomUtils.integerBetween(params.minJuliaHue, params.maxJuliaHue);
    this.juliaHSV[1] = RandomUtils.floatBetween(
      params.minJuliaSaturation,
      params.maxJuliaSaturation
    );
    this.juliaHSV[2] = RandomUtils.floatBetween(params.minJuliaValue, params.maxJuliaValue);
    this.defaultAttractor = Attractor.getRandomAttractor(params.attractors);
    this.infinityAttractor = Attractor.getRandomAttractor(params.attractors);
    this.attractors = [];
  }
}
