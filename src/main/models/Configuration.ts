import Polynomial from "@/models/Polynomial";
import Attractor from "@/models/Attractor";
import Complex from "@/models/Complex";
import FractalFunction from "@/models/FractalFunction";
import RandomUtils from "@/utils/RandomUtils";
import FunctionTypes from "@/constants/FunctionTypes";
import type CoefficientTypes from "@/constants/CoefficientTypes";

/**
 * Configuration class for the Julia Set Visualizer configuration.
 */
export default class Configuration {
  /**
   * Configuration constructor
   *
   * @param id id of the configuration
   * @param name name of the configuration
   * @param resolutionScale scale of the resolution (if 1, use the resolution of the viewport)
   * @param coordinatesScale scale of the coordinates
   * @param coordinatesCenter center of the coordinates
   * @param nbIterations number of iterations
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
    public coordinatesCenter: Complex,
    public nbIterations: number,
    public epsilon: number,
    public juliaBound: number,
    public fractalFunction: FractalFunction,
    public juliaHSV: number[],
    public defaultAttractor: Attractor,
    public infinityAttractor: Attractor,
    public attractors: Attractor[]
  ) {}

  /**
   * Create a configuration from a JSON
   *
   * @param json configuration JSON containing the configuration parameters
   * @returns the configuration created from the JSON, or `undefined` if it could not be created
   */
  public static fromJSON(json: any): Configuration {
    return new Configuration(
      json.id,
      json.name,
      json.resolutionScale,
      json.coordinatesScale,
      Complex.fromJSON(json.coordinatesCenter),
      json.nbIterations,
      json.epsilon,
      json.juliaBound,
      FractalFunction.fromJSON(json.fractalFunction),
      json.juliaHSV,
      Attractor.fromJSON(json.defaultAttractor),
      Attractor.fromJSON(json.infinityAttractor),
      json.attractors.map(Attractor.fromJSON)
    );
  }

  /**
   * Convert a configuration to a JSON object
   *
   * @returns the JSON object constructed from the configuration
   */
  public toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      resolutionScale: this.resolutionScale,
      coordinatesScale: this.coordinatesScale,
      coordinatesCenter: this.coordinatesCenter.toJSON(),
      nbIterations: this.nbIterations,
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
   * Create the default configuration
   *
   * @returns the default configuration to use
   */
  public static defaultConfiguration(id = "DEFAULT", name = "Default"): Configuration {
    return new Configuration(
      id,
      name,
      1,
      2,
      new Complex(0, 0),
      20,
      0.00001,
      -4,
      new FractalFunction(
        new Polynomial({ 2: new Complex(1, 0) }),
        new Polynomial({ 0: new Complex(1, 0) }),
        FunctionTypes.DEFAULT,
        new Complex(1, 0)
      ),
      [0, 0, 1],
      new Attractor(undefined, 210.0, 0.11, 0, 0.26, 1.4),
      new Attractor(undefined, 210.0, 0.11, 0, 0.26, 1.4),
      []
    );
  }

  /**
   * Creates an empty configuration.
   * @returns An empty configuration.
   */
  public static emptyConfiguration(id: string, name: string): Configuration {
    return new Configuration(
      id,
      name,
      1,
      1,
      new Complex(0, 0),
      20,
      0.00001,
      -4,
      new FractalFunction(
        new Polynomial({}),
        new Polynomial({ 0: new Complex(1, 0) }),
        FunctionTypes.DEFAULT,
        new Complex(1, 0)
      ),
      [0, 0, 0],
      new Attractor(undefined, 0, 0, 0, 0, 0),
      new Attractor(undefined, 0, 0, 0, 0, 0),
      []
    );
  }

  /**
   * Fill this configuration with a copy of the information of another configuration
   *
   * @param configuration the configuration to fill with
   */
  public fillWith(configuration: Configuration, exceptIdAndName = true): void {
    if (!exceptIdAndName) {
      this.id = configuration.id;
      this.name = configuration.name;
    }
    this.resolutionScale = configuration.resolutionScale;
    this.coordinatesScale = configuration.coordinatesScale;
    this.coordinatesCenter = configuration.coordinatesCenter.copy();
    this.nbIterations = configuration.nbIterations;
    this.epsilon = configuration.epsilon;
    this.juliaBound = configuration.juliaBound;
    this.fractalFunction = configuration.fractalFunction.copy();
    this.juliaHSV = [
      configuration.juliaHSV[0],
      configuration.juliaHSV[1],
      configuration.juliaHSV[2],
    ];
    this.defaultAttractor = configuration.defaultAttractor.copy();
    this.infinityAttractor = configuration.infinityAttractor.copy();
    this.attractors = [];
    configuration.attractors.forEach((attractor) => {
      this.attractors.push(attractor.copy());
    });
  }

  /**
   * Randomize the configuration with the provided settings
   *
   * @param functionTypes set of the function types.
   * @param coefficientTypes set the available coefficient types
   * @param nbCoefficients min and max number of coefficients
   * @param complexModulus min and max modulus for constant coefficients
   * @param circleCenterModulus min and max center modulus for circle coefficients
   * @param radius min and max radius for circle coefficients
   * @param circleDuration min and max duration for circle coefficients
   * @param startEndModulus min and max start and end modulus for line coefficients
   * @param lineDuration min and max duration for line coefficients
   * @param ellipseCenterModulus min and max center modulus for ellipse coefficients
   * @param halfWidth min and max half-width for ellipse coefficients
   * @param halfHeight min and max half-height for ellipse coefficients
   * @param rotationAngle min and max rotation angle for ellipse coefficients
   * @param ellipseDuration min and max duration for ellipse coefficients
   * @param juliaHue min and max Julia hue
   * @param juliaSaturation min and max Julia saturation
   * @param juliaValue min and max Julia value
   * @param attractorsHue min and max attractors hue
   * @param attractorsSaturationStrength min and max attractors saturation strength
   * @param attractorsSaturationOffset min and max attractors saturation offset
   * @param attractorsValueStrength min and max attractors value strength
   * @param attractorsValueOffset min and max attractors value offset
   * @param viewportScale min and max value viewport scale
   * @param viewportCenterModulus min and max viewport center modulus
   * @param nbIterations min and max number of iterations
   * @param epsilon min and max epsilon
   * @param juliaBound min and max Julia bound
   */
  public randomize(
    functionTypes: Set<FunctionTypes>,
    coefficientTypes: Set<CoefficientTypes>,
    nbCoefficients: { min: number; max: number },
    complexModulus: { min: number; max: number },
    circleCenterModulus: { min: number; max: number },
    radius: { min: number; max: number },
    circleDuration: { min: number; max: number },
    startEndModulus: { min: number; max: number },
    lineDuration: { min: number; max: number },
    ellipseCenterModulus: { min: number; max: number },
    halfWidth: { min: number; max: number },
    halfHeight: { min: number; max: number },
    rotationAngle: { min: number; max: number },
    ellipseDuration: { min: number; max: number },
    juliaHue: { min: number; max: number },
    juliaSaturation: { min: number; max: number },
    juliaValue: { min: number; max: number },
    attractorsHue: { min: number; max: number },
    attractorsSaturationStrength: { min: number; max: number },
    attractorsSaturationOffset: { min: number; max: number },
    attractorsValueStrength: { min: number; max: number },
    attractorsValueOffset: { min: number; max: number },
    viewportScale: { min: number; max: number },
    viewportCenterModulus: { min: number; max: number },
    nbIterations: { min: number; max: number },
    epsilon: { min: number; max: number },
    juliaBound: { min: number; max: number }
  ) {
    this.coordinatesScale = RandomUtils.floatBetween(viewportScale.min, viewportScale.max);
    this.coordinatesCenter = Complex.getRandomComplex(viewportCenterModulus);
    this.nbIterations = RandomUtils.integerBetween(nbIterations.min, nbIterations.max);
    this.epsilon = RandomUtils.floatBetween(epsilon.min, epsilon.max);
    this.juliaBound = RandomUtils.floatBetween(juliaBound.min, juliaBound.max);
    this.fractalFunction = FractalFunction.getRandomFractalFunction(
      functionTypes,
      coefficientTypes,
      nbCoefficients,
      complexModulus,
      circleCenterModulus,
      radius,
      circleDuration,
      startEndModulus,
      lineDuration,
      ellipseCenterModulus,
      halfWidth,
      halfHeight,
      rotationAngle,
      ellipseDuration
    );
    this.juliaHSV[0] = RandomUtils.integerBetween(juliaHue.min, juliaHue.max);
    this.juliaHSV[1] = RandomUtils.floatBetween(juliaSaturation.min, juliaSaturation.max);
    this.juliaHSV[2] = RandomUtils.floatBetween(juliaValue.min, juliaValue.max);
    this.defaultAttractor = Attractor.getRandomAttractor(
      attractorsHue,
      attractorsSaturationStrength,
      attractorsSaturationOffset,
      attractorsValueStrength,
      attractorsValueOffset
    );
    this.infinityAttractor = Attractor.getRandomAttractor(
      attractorsHue,
      attractorsSaturationStrength,
      attractorsSaturationOffset,
      attractorsValueStrength,
      attractorsValueOffset
    );
    this.attractors = [];
  }

  /**
   * Return a string representation of the configuration
   *
   * @returns the String representation
   */
  public toString(): string {
    return `Configuration(${this.id}, ${this.name}, ${this.resolutionScale}, ${
      this.coordinatesScale
    }, ${this.coordinatesCenter}, ${this.nbIterations}, ${this.epsilon}, ${this.juliaBound}, ${
      this.fractalFunction
    }, [${this.juliaHSV[0]}, ${this.juliaHSV[1]}, ${this.juliaHSV[2]}], ${this.defaultAttractor}, ${
      this.infinityAttractor
    }, [${this.attractors.join(", ")}])`;
  }
}
