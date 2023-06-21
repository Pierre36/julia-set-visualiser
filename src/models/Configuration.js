import { Polynomial } from "./Polynomial";
import { Attractor } from "./Attractor";
import { Complex } from "./Complex";

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
   * @param {Number} coordinatesScale The scale of the coordinates (if 1, the width of the viewport is 2).
   * @param {Polynomial} polynomial The polynomial used for the fractal.
   * @param {String} functionType The type a function, can be DEFAULT or NEWTON.
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
    polynomial,
    functionType,
    juliaHSV,
    defaultAttractor,
    infinityAttractor,
    attractors
  ) {
    this.id = id;
    this.name = name;
    this.resolutionScale = resolutionScale;
    this.coordinatesScale = coordinatesScale;
    this.polynomial = polynomial;
    this.functionType = functionType;
    this.juliaHSV = juliaHSV;
    this.defaultAttractor = defaultAttractor;
    this.infinityAttractor = infinityAttractor;
    this.attractors = attractors;
  }

  /**
   * Creates a configuration from a JSON.
   * @param {Object} configurationJSON A configuration JSON containing the configuration parameters.
   */
  static fromJSON({
    id,
    name,
    resolutionScale,
    coordinatesScale,
    polynomial,
    functionType,
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
      Polynomial.fromJSON(polynomial),
      functionType,
      juliaHSV,
      Attractor.fromJSON(defaultAttractor),
      Attractor.fromJSON(infinityAttractor),
      attractors.map((attractorJSON) => Attractor.fromJSON(attractorJSON))
    );
  }

  /**
   * Creates the default configuration.
   * @returns The default configuration to use.
   */
  static defaultConfiguration() {
    return new Configuration(
      "0",
      "Default",
      1,
      2,
      new Polynomial({ 2: new Complex(1, 0) }),
      "DEFAULT",
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
  fillWith(configuration) {
    this.id = configuration.id;
    this.name = configuration.name;
    this.resolutionScale = configuration.resolutionScale;
    this.coordinatesScale = configuration.coordinatesScale;
    this.polynomial = configuration.polynomial.copy();
    this.functionType = configuration.functionType;
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
