import ComplexCircle from "@/models/ComplexCircle";
import ComplexEllipse from "@/models/ComplexEllipse";
import ComplexLine from "@/models/ComplexLine";
import Complex from "@/models/Complex";
import RandomUtils from "@/utils/RandomUtils";
import CoefficientTypes from "@/constants/CoefficientTypes";

/**
 * Utility class to create coefficients
 */
export default class Coefficient {
  // FIXME Returning undefined would be better than throwing an error
  /**
   * Create a coefficient from a JSON
   *
   * @param complexJSON object containing the JSON for a coefficient
   * @returns the coefficient made from the JSON
   * @throws an error if the coefficient type is incorrect
   */
  public static fromJSON(
    coefficientJSON: any
  ): ComplexCircle | ComplexLine | ComplexEllipse | Complex {
    if (coefficientJSON.type == CoefficientTypes.CIRCLE) {
      return ComplexCircle.fromJSON(coefficientJSON);
    } else if (coefficientJSON.type == CoefficientTypes.LINE) {
      return ComplexLine.fromJSON(coefficientJSON);
    } else if (coefficientJSON.type == CoefficientTypes.ELLIPSE) {
      return ComplexEllipse.fromJSON(coefficientJSON);
    } else if (coefficientJSON.type == CoefficientTypes.CONSTANT) {
      return Complex.fromJSON(coefficientJSON);
    } else {
      throw Error(
        `The type of the coefficient is incorrect! The type must be "${CoefficientTypes.CIRCLE}", "${CoefficientTypes.LINE}", "${CoefficientTypes.ELLIPSE}" or "${CoefficientTypes.CONSTANT}", got ${coefficientJSON["type"]}`
      );
    }
  }

  /**
   * Convert a coefficient to a JSON object
   *
   * @param coefficient coefficient to convert to JSON
   * @returns the JSON object constructed from the coefficient
   */
  public static toJSON(coefficient: ComplexCircle | ComplexLine | ComplexEllipse | Complex): any {
    const coefficientJSON = coefficient.toJSON();
    if (coefficient instanceof ComplexCircle) {
      coefficientJSON["type"] = CoefficientTypes.CIRCLE;
    } else if (coefficient instanceof ComplexLine) {
      coefficientJSON["type"] = CoefficientTypes.LINE;
    } else if (coefficient instanceof ComplexEllipse) {
      coefficientJSON["type"] = CoefficientTypes.ELLIPSE;
    } else if (coefficient instanceof Complex) {
      coefficientJSON["type"] = CoefficientTypes.CONSTANT;
    }
    return coefficientJSON;
  }

  /**
   * Return a random coefficient with the provided settings
   *
   * @param coefficientTypes set of available coefficient types
   * @param complexModulusMinMax min and max modulus for constant coefficients
   * @param circleCenterModulusMinMax min and max center modulus for circle coefficients
   * @param radiusMinMax min and max radius for circle coefficients
   * @param circleDurationMinMax min and max duration for circle coefficients
   * @param startEndModulusMinMax min and max start and end modulus for line coefficients
   * @param lineDurationMinMax min and max duration for line coefficients
   * @param ellipseCenterModulusMinMax min and max center modulus for ellipse coefficients
   * @param halfWidthMinMax min and max half-width for ellipse coefficients
   * @param halfHeightMinMax min and max half-height for ellipse coefficients
   * @param rotationAngleMinMax min and max rotation angle for ellipse coefficients
   * @param ellipseDurationMinMax min and max duration for ellipse coefficients
   * @returns the new random coefficient
   */
  public static getRandomCoefficient(
    coefficientTypes: Set<CoefficientTypes>,
    complexModulusMinMax: { min: number; max: number },
    circleCenterModulusMinMax: { min: number; max: number },
    radiusMinMax: { min: number; max: number },
    circleDurationMinMax: { min: number; max: number },
    startEndModulusMinMax: { min: number; max: number },
    lineDurationMinMax: { min: number; max: number },
    ellipseCenterModulusMinMax: { min: number; max: number },
    halfWidthMinMax: { min: number; max: number },
    halfHeightMinMax: { min: number; max: number },
    rotationAngleMinMax: { min: number; max: number },
    ellipseDurationMinMax: { min: number; max: number }
  ) {
    switch (RandomUtils.pickAmong(Array.from(coefficientTypes))) {
      case CoefficientTypes.CIRCLE:
        return ComplexCircle.getRandomComplexCircle(
          circleCenterModulusMinMax,
          radiusMinMax,
          circleDurationMinMax
        );
      case CoefficientTypes.LINE:
        return ComplexLine.getRandomComplexLine(startEndModulusMinMax, lineDurationMinMax);
      case CoefficientTypes.ELLIPSE:
        return ComplexEllipse.getRandomComplexEllipse(
          ellipseCenterModulusMinMax,
          halfWidthMinMax,
          halfHeightMinMax,
          rotationAngleMinMax,
          ellipseDurationMinMax
        );
      case CoefficientTypes.CONSTANT:
        return Complex.getRandomComplex(complexModulusMinMax);
    }
  }
}
