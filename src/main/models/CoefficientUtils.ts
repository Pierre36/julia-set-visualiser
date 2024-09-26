import ComplexCircle, { type RandomCircleParameters } from "@/models/ComplexCircle";
import ComplexEllipse, { type RandomEllipseParameters } from "@/models/ComplexEllipse";
import ComplexLine, { type RandomLineParameters } from "@/models/ComplexLine";
import Complex, { type RandomComplexParameters } from "@/models/Complex";
import RandomUtils from "@/utils/RandomUtils";
import CoefficientTypes from "@/constants/CoefficientTypes";
import type Coefficient from "@/models/Coefficient";

export interface RandomCoefficientParameters {
  types: Set<CoefficientTypes>;
  constant: RandomComplexParameters;
  circle: RandomCircleParameters;
  line: RandomLineParameters;
  ellipse: RandomEllipseParameters;
}

/** Utility class to create coefficients */
export default class CoefficientUtils {
  /**
   * Create a coefficient from a JSON
   *
   * @param json object containing the JSON for a coefficient
   * @returns the coefficient made from the JSON if it is valid, undefined otherwise
   */
  public static fromJSON(json: any): Coefficient | undefined {
    if (json === undefined) return undefined;

    if (json.type === CoefficientTypes.CIRCLE) return ComplexCircle.fromJSON(json);
    if (json.type == CoefficientTypes.LINE) return ComplexLine.fromJSON(json);
    if (json.type == CoefficientTypes.ELLIPSE) return ComplexEllipse.fromJSON(json);
    if (json.type == CoefficientTypes.CONSTANT) return Complex.fromJSON(json);

    const types = Object.keys(CoefficientTypes);
    console.error(`[KO] Invalid coefficient type: expected one of ${types}, got ${json.type}`);
    return undefined;
  }

  /**
   * Return a random coefficient with the provided settings
   *
   * @param params parameters of the random coefficient
   * @returns the new random coefficient
   */
  public static getRandomCoefficient(params: RandomCoefficientParameters) {
    switch (RandomUtils.pickAmong(Array.from(params.types))) {
      case CoefficientTypes.CIRCLE:
        return ComplexCircle.getRandomComplexCircle(params.circle);
      case CoefficientTypes.LINE:
        return ComplexLine.getRandomComplexLine(params.line);
      case CoefficientTypes.ELLIPSE:
        return ComplexEllipse.getRandomComplexEllipse(params.ellipse);
      case CoefficientTypes.CONSTANT:
        return Complex.getRandomComplex(params.constant);
    }
  }
}
