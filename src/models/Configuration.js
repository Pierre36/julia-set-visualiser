import { Polynomial } from "./Polynomial";
import { Attractor } from "./Attractor";
import { Complex } from "./Complex";
import { ComplexCircle } from "./ComplexCircle";
import { ComplexLine } from "./ComplexLine";
import { Coefficient } from "./Coefficient";

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
   * @param {Polynomial} polynomial The polynomial used for the fractal.
   * @param {String} functionType The type a function, can be DEFAULT or NEWTON.
   * @param {Complex | ComplexCircle | ComplexLine} newtonCoefficient The newton coefficient (a).
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
    polynomial,
    functionType,
    newtonCoefficient,
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
    this.polynomial = polynomial;
    this.functionType = functionType;
    this.newtonCoefficient = newtonCoefficient;
    this.juliaHSV = juliaHSV;
    this.defaultAttractor = defaultAttractor;
    this.infinityAttractor = infinityAttractor;
    this.attractors = attractors;
  }

  /**
   * Creates a configuration from a JSON.
   * @param {Object} configurationJSON A configuration JSON containing the configuration parameters.
   * @returns {Configuration} the configuration created from the JSON.
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
    polynomial,
    functionType,
    newtonCoefficient,
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
      Polynomial.fromJSON(polynomial),
      functionType,
      Coefficient.fromJSON(newtonCoefficient),
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
      polynomial: this.polynomial.toJSON(),
      functionType: this.functionType,
      newtonCoefficient: Coefficient.toJSON(this.newtonCoefficient),
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
      new Polynomial({ 2: new Complex(1, 0) }),
      "DEFAULT",
      new Complex(1, 0),
      [0, 0, 1],
      new Attractor(null, 210.0, 0.11, 0.0, 0.26, 1.4),
      new Attractor(null, 210.0, 0.11, 0.0, 0.26, 1.4),
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
    this.polynomial = configuration.polynomial.copy();
    this.functionType = configuration.functionType;
    this.newtonCoefficient = configuration.newtonCoefficient.copy();
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
}
