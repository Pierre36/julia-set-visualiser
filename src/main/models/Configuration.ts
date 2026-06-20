import FunctionTypes from "@/constants/FunctionTypes";
import Complex, { type RandomComplexParameters } from "@/models/Complex";
import FractalFunction, { type RandomFractalFunctionParameters } from "@/models/FractalFunction";
import type { JsonSerialisable } from "@/models/JsonSerialisable";
import Polynomial from "@/models/Polynomial";
import RandomUtils from "@/utils/RandomUtils";

export interface RandomConfigurationParameters {
  fractalFunction: RandomFractalFunctionParameters;
  minJuliaHue: number;
  maxJuliaHue: number;
  minJuliaSaturation: number;
  maxJuliaSaturation: number;
  minJuliaValue: number;
  maxJuliaValue: number;
  minViewportScale: number;
  maxViewportScale: number;
  viewportCentre: RandomComplexParameters;
  minIterationsCount: number;
  maxIterationsCount: number;
  minEpsilon: number;
  maxEpsilon: number;
  minJuliaBound: number;
  maxJuliaBound: number;
  minFatouHue: number;
  maxFatouHue: number;
  minFatouSaturationStrength: number;
  maxFatouSaturationStrength: number;
  minFatouSaturationOffset: number;
  maxFatouSaturationOffset: number;
  minFatouValueStrength: number;
  maxFatouValueStrength: number;
  minFatouValueOffset: number;
  maxFatouValueOffset: number;
}

/** Julia Set Visualiser configuration */
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
    public fatouHue: number,
    public fatouSaturationStrength: number,
    public fatouSaturationOffset: number,
    public fatouValueStrength: number,
    public fatouValueOffset: number,
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
      0.001,
      1,
      new FractalFunction(new Polynomial({ 2: new Complex(1, 0) }), FunctionTypes.DEFAULT),
      [0, 0, 1],
      210.0,
      0.11,
      0,
      0.26,
      1.4,
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
      0,
      0,
      0,
      0,
      0,
    );
  }

  /**
   * Return a string representation of the configuration
   *
   * @returns the String representation
   */
  public toString(): string {
    return `Configuration(${this.id}, ${this.name}, ${this.resolutionScale}, ${this.coordinatesScale}, ${this.coordinatesCentre}, ${this.iterationsCount}, ${this.epsilon}, ${this.juliaBound}, ${this.fractalFunction}, [${this.juliaHSV[0]}, ${this.juliaHSV[1]}, ${this.juliaHSV[2]}], ${this.fatouHue}, ${this.fatouSaturationStrength}, ${this.fatouSaturationOffset}, ${this.fatouValueStrength}, ${this.fatouValueOffset})`;
  }

  /**
   * Create a configuration from its JSON representation
   *
   * @param json the JSON to deserialise
   * @returns the configuration or `undefined` if the JSON is invalid
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    if (json.fatouHue === undefined || !Number.isFinite(json.fatouHue)) return undefined;
    if (
      json.fatouSaturationStrength === undefined ||
      !Number.isFinite(json.fatouSaturationStrength)
    )
      return undefined;
    if (json.fatouSaturationOffset === undefined || !Number.isFinite(json.fatouSaturationOffset))
      return undefined;
    if (json.fatouValueStrength === undefined || !Number.isFinite(json.fatouValueStrength))
      return undefined;
    if (json.fatouValueOffset === undefined || !Number.isFinite(json.fatouValueOffset))
      return undefined;

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
      json.fatouHue,
      json.fatouSaturationStrength,
      json.fatouSaturationOffset,
      json.fatouValueStrength,
      json.fatouValueOffset,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      fatouHue: this.fatouHue,
      fatouSaturationStrength: this.fatouSaturationStrength,
      fatouSaturationOffset: this.fatouSaturationOffset,
      fatouValueStrength: this.fatouValueStrength,
      fatouValueOffset: this.fatouValueOffset,
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
      this.fatouHue,
      this.fatouSaturationStrength,
      this.fatouSaturationOffset,
      this.fatouValueStrength,
      this.fatouValueOffset,
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
      params.maxViewportScale,
    );
    this.coordinatesCentre = Complex.getRandomComplex(params.viewportCentre);
    this.iterationsCount = RandomUtils.integerBetween(
      params.minIterationsCount,
      params.maxIterationsCount,
    );
    this.epsilon = RandomUtils.floatBetween(params.minEpsilon, params.maxEpsilon);
    this.juliaBound = RandomUtils.floatBetween(params.minJuliaBound, params.maxJuliaBound);
    this.fractalFunction = FractalFunction.getRandomFractalFunction(params.fractalFunction);
    this.juliaHSV[0] = RandomUtils.integerBetween(params.minJuliaHue, params.maxJuliaHue);
    this.juliaHSV[1] = RandomUtils.floatBetween(
      params.minJuliaSaturation,
      params.maxJuliaSaturation,
    );
    this.juliaHSV[2] = RandomUtils.floatBetween(params.minJuliaValue, params.maxJuliaValue);
    this.fatouHue = RandomUtils.integerBetween(params.minFatouHue, params.maxFatouHue);
    this.fatouSaturationStrength = RandomUtils.floatBetween(
      params.minFatouSaturationStrength,
      params.maxFatouSaturationStrength,
    );
    this.fatouSaturationOffset = RandomUtils.floatBetween(
      params.minFatouSaturationOffset,
      params.maxFatouSaturationOffset,
    );
    this.fatouValueStrength = RandomUtils.floatBetween(
      params.minFatouValueStrength,
      params.maxFatouValueStrength,
    );
    this.fatouValueOffset = RandomUtils.floatBetween(
      params.minFatouValueOffset,
      params.maxFatouValueOffset,
    );
  }
}
