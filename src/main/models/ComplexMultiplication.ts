import Complex from "@/models/Complex";
import ComplexCircle from "@/models/ComplexCircle";
import ComplexLine from "@/models/ComplexLine";
import ComplexEllipse from "@/models/ComplexEllipse";

/**
 * Representation of a multiplication of two coefficients.
 */
// FIXME The extends Complex part is temporary and should be removed once the time computation is
// done in the shaders
export default class ComplexMultiplication extends Complex {
  /**
   * Complex multiplication constructor
   *
   * @param coefficient1 first coefficient
   * @param coefficient2 second coefficient
   */
  private constructor(
    public coefficient1: Complex | ComplexCircle | ComplexLine | ComplexEllipse,
    public coefficient2: Complex | ComplexCircle | ComplexLine | ComplexEllipse
  ) {
    super(0, 0);
  }

  /**
   * Create a complex multiplication between two coefficients. It the two coefficients are complex
   * number, the returned value is also a complex number
   *
   * @param coefficient1 first coefficient
   * @param coefficient2 second coefficient
   * @returns the complex multiplication result
   */
  public static of(
    coefficient1: Complex | ComplexCircle | ComplexLine | ComplexEllipse,
    coefficient2: Complex | ComplexCircle | ComplexLine | ComplexEllipse
  ): ComplexMultiplication | Complex {
    if (coefficient1 instanceof Complex && coefficient2 instanceof Complex) {
      return coefficient1.multipliedByComplex(coefficient2);
    }
    return new ComplexMultiplication(coefficient1, coefficient2);
  }

  /**
   * Get the value of the multiplication at the given time
   *
   * @param time time in milliseconds
   * @returns the value of the multiplication at the given time
   */
  public getAtTime(time: number): Complex {
    return this.coefficient1.getAtTime(time).multipliedByComplex(this.coefficient2.getAtTime(time));
  }

  /**
   * Return a string representation of the multiplication
   *
   * @returns the string representation of the multiplication
   */
  public toString() {
    return `ComplexMultiplication(${this.coefficient1}, ${this.coefficient2})`;
  }
}
