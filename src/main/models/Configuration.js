import { Polynomial } from "./Polynomial";
import { Attractor } from "./Attractor";
import { Complex } from "./Complex";
import { FractalFunction } from "./FractalFunction";
import { RandomUtils } from "@/utils/RandomUtils";
import { FunctionTypes } from "@/constants/FunctionTypes";

export { Configuration };

/**
 * Configuration class for the Julia Set Visualizer configuration.
 */
class Configuration {
  /**
   * Configuration constructor
   * @param {String} id The id of the configuration.
   * @param {String} name The name of the configuration.
   * @param {Number} resolutionScale The scale of the resolution (if 1, use the resolution of the viewport).
   * @param {Number} coordinatesScale The scale of the coordinates.
   * @param {Complex} coordinatesCenter The center of the coordinates.
   * @param {Number} nbIterations The number of iterations.
   * @param {Number} epsilon The epsilon added to the complex number before to compute the divergence.
   * @param {Number} juliaBound The highest value of log-divergence in the Julia Set.
   * @param {FractalFunction} fractalFunction The function used for the fractal.
   * @param {Array} juliaHSV The hue, saturation and value of the Julia Set.
   * @param {Attractor} defaultAttractor The default attractor to use if no attractor is closer.
   * @param {Attractor} infinityAttractor The attractor for the infinity.
   * @param {Array} attractors The list of the attractors.
   */
  constructor(
    id,
    name,
    resolutionScale,
    coordinatesScale,
    coordinatesCenter,
    nbIterations,
    epsilon,
    juliaBound,
    fractalFunction,
    juliaHSV,
    defaultAttractor,
    infinityAttractor,
    attractors
  ) {
    this.id = id;
    this.name = name;
    this.resolutionScale = resolutionScale;
    this.coordinatesScale = coordinatesScale;
    this.coordinatesCenter = coordinatesCenter;
    this.nbIterations = nbIterations;
    this.epsilon = epsilon;
    this.juliaBound = juliaBound;
    this.fractalFunction = fractalFunction;
    this.juliaHSV = juliaHSV;
    this.defaultAttractor = defaultAttractor;
    this.infinityAttractor = infinityAttractor;
    this.attractors = attractors;
  }

  /**
   * Creates a configuration from a JSON.
   * @param {Object} configurationJSON A configuration JSON containing the configuration parameters.
   * @returns {Configuration} The configuration created from the JSON.
   */
  static fromJSON({
    id,
    name,
    resolutionScale,
    coordinatesScale,
    coordinatesCenter,
    nbIterations,
    epsilon,
    juliaBound,
    fractalFunction,
    juliaHSV,
    defaultAttractor,
    infinityAttractor,
    attractors,
  }) {
    return new Configuration(
      id,
      name,
      resolutionScale,
      coordinatesScale,
      Complex.fromJSON(coordinatesCenter),
      nbIterations,
      epsilon,
      juliaBound,
      FractalFunction.fromJSON(fractalFunction),
      juliaHSV,
      Attractor.fromJSON(defaultAttractor),
      Attractor.fromJSON(infinityAttractor),
      attractors.map((attractorJSON) => Attractor.fromJSON(attractorJSON))
    );
  }

  /**
   * Converts a configuration to a JSON object.
   * @returns {Object} The JSON object constructed from the configuration.
   */
  toJSON() {
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
   * Creates the default configuration.
   * @returns The default configuration to use.
   */
  static defaultConfiguration(id = "DEFAULT", name = "Default") {
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
      new Attractor(null, 210.0, 0.11, 0, 0.26, 1.4),
      new Attractor(null, 210.0, 0.11, 0, 0.26, 1.4),
      []
    );
  }

  /**
   * Creates an empty configuration.
   * @returns An empty configuration.
   */
  static emptyConfiguration(id, name) {
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
        new Polynomial(),
        new Polynomial({ 0: new Complex(1, 0) }),
        FunctionTypes.DEFAULT,
        new Complex(1, 0)
      ),
      [0, 0, 0],
      new Attractor(null, 0, 0, 0, 0, 0),
      new Attractor(null, 0, 0, 0, 0, 0),
      []
    );
  }

  /**
   * Fill this configuration with a copy of the information of another configuration.
   * @param {Configuration} configuration The configuration to fill with.
   */
  fillWith(configuration, exceptIdAndName = true) {
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
   * Randomize the configuration with the provided settings.
   * @param {Set} functionTypes A set of the function types.
   * @param {Set} coefficientTypes A set the available coefficient types.
   * @param {Object} nbCoefficients An object containing the min and max value of the number of coefficients.
   * @param {Object} complexModulus An object containing the min and max value of the modulus for constant coefficients.
   * @param {Object} circleCenterModulus An object containing the min and max value of the center modulus for circle coefficients.
   * @param {Object} radius An object containing the min and max value of the radius for circle coefficients.
   * @param {Object} circleDuration An object containing the min and max value of the duration for circle coefficients.
   * @param {Object} startEndModulus An object containing the min and max value of the start and end modulus for line coefficients.
   * @param {Object} lineDuration An object containing the min and max value of the duration for line coefficients.
   * @param {Object} ellipseCenterModulus An object containing the min and max value of the center modulus for ellipse coefficients.
   * @param {Object} halfWidth An object containing the min and max value of the half-width for ellipse coefficients.
   * @param {Object} halfHeight An object containing the min and max value of the half-height for ellipse coefficients.
   * @param {Object} rotationAngle An object containing the min and max value of the rotation angle for ellipse coefficients.
   * @param {Object} ellipseDuration An object containing the min and max value of the duration for ellipse coefficients.
   * @param {Object} juliaHue An object containing the min and max value of the Julia hue.
   * @param {Object} juliaSaturation An object containing the min and max value of the Julia saturation.
   * @param {Object} juliaValue An object containing the min and max value of the Julia value.
   * @param {Object} attractorsHue An object containing the min and max value of the attractors hue.
   * @param {Object} attractorsSaturationStrength An object containing the min and max value of the attractors saturation strength.
   * @param {Object} attractorsSaturationOffset An object containing the min and max value of the attractors saturation offset.
   * @param {Object} attractorsValueStrength An object containing the min and max value of the attractors value strength.
   * @param {Object} attractorsValueOffset An object containing the min and max value of the attractors value offset.
   * @param {Object} viewportScale An object containing the min and max value of the viewport scale.
   * @param {Object} viewportCenterModulus An object containing the min and max value of viewport center modulus.
   * @param {Object} nbIterations An object containing the min and max value of the number of iterations.
   * @param {Object} epsilon An object containing the min and max value of epsilon.
   * @param {Object} juliaBound An object containing the min and max value of the Julia bound.
   */
  randomize(
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
    ellipseDuration,
    juliaHue,
    juliaSaturation,
    juliaValue,
    attractorsHue,
    attractorsSaturationStrength,
    attractorsSaturationOffset,
    attractorsValueStrength,
    attractorsValueOffset,
    viewportScale,
    viewportCenterModulus,
    nbIterations,
    epsilon,
    juliaBound
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
   * Returns a String representation of the configuration.
   * @returns {String} The String representation.
   */
  toString() {
    return `Configuration(${this.id}, ${this.name}, ${this.resolutionScale}, ${
      this.coordinatesScale
    }, ${this.coordinatesCenter}, ${this.nbIterations}, ${this.epsilon}, ${this.juliaBound}, ${
      this.fractalFunction
    }, [${this.juliaHSV[0]}, ${this.juliaHSV[1]}, ${this.juliaHSV[2]}], ${this.defaultAttractor}, ${
      this.infinityAttractor
    }, [${this.attractors.join(", ")}])`;
  }
}
