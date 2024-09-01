import { describe, it, expect, vi } from "vitest";

import { Polynomial } from "@/models/Polynomial";
import { ComplexCircle } from "@/models/ComplexCircle";
import { Complex } from "@/models/Complex";
import { Coefficient } from "@/models/Coefficient";
import { ComplexLine } from "@/models/ComplexLine";
import { ComplexMultiplication } from "@/models/ComplexMultiplication";
import { RandomUtils } from "@/utils/RandomUtils";

describe("constructor", () => {
  it("properly constructs", () => {
    const coefficients = {
      0: new ComplexCircle(new Complex(0, 0), 1, 2000),
      2: new Complex(1, 0),
      36: new Complex(3, 6),
    };
    const expectedCoefficients = {
      0: new ComplexCircle(new Complex(0, 0), 1, 2000),
      1: null,
      2: new Complex(1, 0),
      3: null,
      4: null,
      5: null,
      6: null,
      7: null,
      8: null,
      9: null,
      10: null,
      11: null,
      12: null,
      13: null,
      14: null,
      15: null,
    };

    const polynomial = new Polynomial(coefficients);

    expect(polynomial.degree).toBe(2);
    expect(polynomial.coefficients).toEqual(expectedCoefficients);
    expect(polynomial._nbCoefficients).toEqual(2);
    expect(polynomial.arrayRepresentation).toEqual([
      0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});

describe("fromJSON", () => {
  it("properly constructs from JSON", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = Polynomial.fromJSON({
      0: Coefficient.toJSON(coefficient0),
      3: Coefficient.toJSON(coefficient1),
      6: Coefficient.toJSON(coefficient2),
    });

    expect(polynomial).toEqual(
      new Polynomial({ 0: coefficient0, 3: coefficient1, 6: coefficient2 })
    );
  });
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const json = new Polynomial({ 0: coefficient0, 3: coefficient1, 6: coefficient2 }).toJSON();

    expect(json).toEqual({
      0: Coefficient.toJSON(coefficient0),
      3: Coefficient.toJSON(coefficient1),
      6: Coefficient.toJSON(coefficient2),
    });
  });
});

describe("MAX_DEGREE", () => {
  it("is 15", () => {
    expect(Polynomial.MAX_DEGREE).toBe(15);
  });
});

describe("getCoefficient", () => {
  it("properly get coefficients", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    expect(polynomial.getCoefficient(0)).toEqual(coefficient0);
    expect(polynomial.getCoefficient(1)).toEqual(coefficient1);
    expect(polynomial.getCoefficient(2)).toEqual(coefficient2);
  });

  it("properly throws error when power too high", () => {
    const polynomial = new Polynomial();

    expect(() => polynomial.getCoefficient(36)).toThrowError();
  });
});

describe("setCoefficient", () => {
  it("properly sets coefficients", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    const newCoefficient0 = new Complex(0, 0);
    polynomial.setCoefficient(0, newCoefficient0);

    expect(polynomial).toEqual(
      new Polynomial({ 0: newCoefficient0, 1: coefficient1, 2: coefficient2 })
    );
    expect(polynomial.degree).toBe(2);
    expect(polynomial._nbCoefficients).toBe(3);
    expect(polynomial.arrayRepresentation).toEqual([
      0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    const newCoefficient5 = new Complex(0, 0);
    polynomial.setCoefficient(5, newCoefficient5);

    expect(polynomial).toEqual(
      new Polynomial({ 0: newCoefficient0, 1: coefficient1, 2: coefficient2, 5: newCoefficient5 })
    );
    expect(polynomial.degree).toBe(5);
    expect(polynomial._nbCoefficients).toBe(4);
    expect(polynomial.arrayRepresentation).toEqual([
      0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it("properly throws error when power too high", () => {
    const polynomial = new Polynomial();

    expect(() => polynomial.setCoefficient(36, new Complex(0, 0))).toThrowError();
  });

  it("properly throws error when coefficient undefined", () => {
    const polynomial = new Polynomial();

    expect(() => polynomial.setCoefficient(0)).toThrowError();
  });
});

describe("removeCoefficient", () => {
  it("properly removes coefficients", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    polynomial.removeCoefficient(0);

    expect(polynomial).toEqual(new Polynomial({ 1: coefficient1, 2: coefficient2 }));
    expect(polynomial.degree).toBe(2);
    expect(polynomial._nbCoefficients).toBe(2);
    expect(polynomial.arrayRepresentation).toEqual([
      0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    polynomial.removeCoefficient(2);

    expect(polynomial).toEqual(new Polynomial({ 1: coefficient1 }));
    expect(polynomial.degree).toBe(1);
    expect(polynomial._nbCoefficients).toBe(1);
    expect(polynomial.arrayRepresentation).toEqual([
      0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it("properly removes coefficient on full polynomial", () => {
    const coefficient = new Complex(3, 6);

    const polynomial = new Polynomial({
      0: coefficient,
      1: coefficient,
      2: coefficient,
      3: coefficient,
      4: coefficient,
      5: coefficient,
      6: coefficient,
      7: coefficient,
      8: coefficient,
      9: coefficient,
      10: coefficient,
      11: coefficient,
      12: coefficient,
      13: coefficient,
      14: coefficient,
      15: coefficient,
    });

    polynomial.removeCoefficient(15);

    expect(polynomial).toEqual(
      new Polynomial({
        0: coefficient,
        1: coefficient,
        2: coefficient,
        3: coefficient,
        4: coefficient,
        5: coefficient,
        6: coefficient,
        7: coefficient,
        8: coefficient,
        9: coefficient,
        10: coefficient,
        11: coefficient,
        12: coefficient,
        13: coefficient,
        14: coefficient,
      })
    );
    expect(polynomial.degree).toBe(14);
    expect(polynomial._nbCoefficients).toBe(15);
    expect(polynomial.arrayRepresentation).toEqual([
      0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 4, 0, 0, 5, 0, 0, 6, 0, 0, 7, 0, 0, 8, 0, 0, 9, 0,
      0, 10, 0, 0, 11, 0, 0, 12, 0, 0, 13, 0, 0, 14, 0, 0, 0,
    ]);
  });

  it("properly throws error when power too high", () => {
    const polynomial = new Polynomial();

    expect(() => polynomial.removeCoefficient(36)).toThrowError();
  });

  it("properly throws error when removing an inexistent coefficient", () => {
    const polynomial = new Polynomial();

    expect(() => polynomial.removeCoefficient(0)).toThrowError();
  });
});

describe("recalculateDegree", () => {
  it("properly recalculates degree", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    polynomial.removeCoefficient(0);
    polynomial.recalculateDegree();

    expect(polynomial.degree).toBe(2);

    polynomial.removeCoefficient(2);
    polynomial.recalculateDegree();

    expect(polynomial.degree).toBe(1);
  });

  it("properly recalculates degree on empty polynomial", () => {
    const polynomial = new Polynomial();

    polynomial.recalculateDegree();

    expect(polynomial.degree).toBe(0);
  });
});

describe("descendingPowers", () => {
  it("properly returns the powers in descending order", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 2: coefficient2, 1: coefficient1 });

    expect(polynomial.descendingPowers()).toEqual(["2", "1", "0"]);
  });
});

describe("toMathML", () => {
  it("properly returns the corresponding mathML", () => {
    const coefficient0 = new Complex(-3, 0);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);
    const coefficient3 = new Complex(0, 0);

    const polynomial = new Polynomial({
      0: coefficient0,
      2: coefficient2,
      1: coefficient1,
      3: coefficient3,
    });

    expect(polynomial.toMathML()).toBe(
      `<mrow>${coefficient2.toMathML(
        2
      )}<msup><mi>z</mi><mn>2</mn></msup></mrow><mrow><mo>+</mo></mrow><mrow>${coefficient1.toMathML(
        1
      )}<mi>z</mi></mrow><mrow><mo>-</mo></mrow><mrow>${coefficient0.toMathML()}</mrow>`
    );
  });

  it("properly returns the corresponding mathML for empty polynomial", () => {
    const polynomial = new Polynomial();

    expect(polynomial.toMathML()).toBe("<mrow><mn>0</mn></mrow>");
  });
});

describe("updateWithTime", () => {
  it("properly updates", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });
    const time = 1000;
    polynomial.updateWithTime(time);

    const coefficient0AtTime = coefficient0.getAtTime(time);
    const coefficient1AtTime = coefficient1.getAtTime(time);
    const coefficient2AtTime = coefficient2.getAtTime(time);

    expect(polynomial.arrayRepresentation).toEqual([
      coefficient0AtTime.mod(),
      coefficient0AtTime.arg(),
      0,
      coefficient1AtTime.mod(),
      coefficient1AtTime.arg(),
      1,
      coefficient2AtTime.mod(),
      coefficient2AtTime.arg(),
      2,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]);
  });
});

describe("getDerivative", () => {
  it("properly computes derivative", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    expect(polynomial.getDerivative()).toEqual(
      new Polynomial({ 0: coefficient1, 1: coefficient2.multipliedBy(2) })
    );
  });
});

describe("getNewtonNumerator", () => {
  it("properly computes derivative", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);
    const newtonCoefficient = new Complex(2, 0);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    expect(polynomial.getNewtonNumerator(newtonCoefficient)).toEqual(
      new Polynomial({
        0: new ComplexMultiplication(coefficient0, newtonCoefficient.multipliedBy(-1)),
        1: new ComplexMultiplication(coefficient1, newtonCoefficient.multipliedBy(-1).plus(1)),
        2: new ComplexMultiplication(coefficient2, newtonCoefficient.multipliedBy(-1).plus(2)),
      })
    );
  });
});

describe("getAvailablePowers", () => {
  it("properly gets available powers", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient10 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient4 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 10: coefficient10, 4: coefficient4 });

    expect(polynomial.getAvailablePowers()).toEqual([
      "1",
      "2",
      "3",
      "5",
      "6",
      "7",
      "8",
      "9",
      "11",
      "12",
      "13",
      "14",
      "15",
    ]);
  });
});

describe("getCoefficientPowers", () => {
  it("properly gets unavailable powers", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient10 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient4 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 10: coefficient10, 4: coefficient4 });

    expect(polynomial.getCoefficientPowers()).toEqual(["0", "4", "10"]);
  });
});

describe("copy", () => {
  it("properly copies", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    expect(polynomial.copy()).toEqual(polynomial);
    expect(polynomial.copy()).not.toBe(polynomial);
  });
});

describe("getArrayRepresentation", () => {
  it("properly gets array representation", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    expect(polynomial.getArrayRepresentation()).toEqual(polynomial.arrayRepresentation);
  });
});

describe("getNbCoefficients", () => {
  it("properly gets the number of coefficients", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    expect(polynomial.getNbCoefficients()).toEqual(polynomial._nbCoefficients);
  });
});

describe("getRandomPolynomial", () => {
  it("properly returns a random polynomial", () => {
    const randomCoefficient = new Complex(2, 4);
    Coefficient.getRandomCoefficient = vi.fn(() => randomCoefficient);
    RandomUtils.distinctIntegersBetween = vi.fn(() => [0, 1]);

    const nbCoefficients = 2;
    const coefficientTypes = new Set(["coefficientType1", "coefficientType2"]);
    const complexModulusMinMax = { min: 1, max: 2 };
    const circleCenterModulusMinMax = { min: 2, max: 3 };
    const radiusMinMax = { min: 3, max: 4 };
    const circleDurationMinMax = { min: 4, max: 5 };
    const startEndModulusMinMax = { min: 5, max: 6 };
    const lineDurationMinMax = { min: 6, max: 7 };
    const ellipseCenterModulusMinMax = { min: 8, max: 9 };
    const halfWidthMinMax = { min: 10, max: 11 };
    const halfHeightMinMax = { min: 12, max: 13 };
    const rotationAngleMinMax = { min: 14, max: 15 };
    const ellipseDurationMinMax = { min: 16, max: 17 };

    const randomPolynomial = Polynomial.getRandomPolynomial(
      nbCoefficients,
      coefficientTypes,
      complexModulusMinMax,
      circleCenterModulusMinMax,
      radiusMinMax,
      circleDurationMinMax,
      startEndModulusMinMax,
      lineDurationMinMax,
      ellipseCenterModulusMinMax,
      halfWidthMinMax,
      halfHeightMinMax,
      rotationAngleMinMax,
      ellipseDurationMinMax
    );

    expect(RandomUtils.distinctIntegersBetween).toHaveBeenCalledWith(
      0,
      Polynomial.MAX_DEGREE,
      nbCoefficients
    );
    expect(Coefficient.getRandomCoefficient).toHaveBeenCalledWith(
      coefficientTypes,
      complexModulusMinMax,
      circleCenterModulusMinMax,
      radiusMinMax,
      circleDurationMinMax,
      startEndModulusMinMax,
      lineDurationMinMax,
      ellipseCenterModulusMinMax,
      halfWidthMinMax,
      halfHeightMinMax,
      rotationAngleMinMax,
      ellipseDurationMinMax
    );
    expect(Coefficient.getRandomCoefficient).toHaveBeenCalledTimes(2);

    expect(randomPolynomial).toEqual(
      new Polynomial({ 0: randomCoefficient, 1: randomCoefficient })
    );
  });
});

describe("toString", () => {
  it("properly returns a string representation of the polynomial", () => {
    expect(
      new Polynomial({
        0: new Complex(0, 0),
        1: new Complex(1, 0),
        2: new Complex(2, 0),
      }).toString()
    ).toBe("Polynomial(2z^2 + 1z + 0)");
  });

  it("properly returns a string representation of the polynomial when it is empty", () => {
    expect(new Polynomial().toString()).toBe("Polynomial(0)");
  });
});
