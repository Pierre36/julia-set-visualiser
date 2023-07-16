import { describe, it, expect } from "vitest";

import { FractalFunction } from "../FractalFunction";
import { Polynomial } from "../Polynomial";
import { Complex } from "../Complex";
import { Coefficient } from "../Coefficient";
import { ComplexMultiplication } from "../ComplexMultiplication";

describe("constructor", () => {
  it("properly constructs default functions", () => {
    const numerator = new Polynomial();
    const denominator = new Polynomial();
    const functionType = "DEFAULT";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.numerator).toBe(numerator);
    expect(fractalFunction.denominator).toBe(denominator);
    expect(fractalFunction.functionType).toBe(functionType);
    expect(fractalFunction.newtonCoefficient).toBe(newtonCoefficient);
    expect(fractalFunction.newtonNumerator).toEqual(new Polynomial());
  });

  it("properly constructs newton functions", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient2 = new Complex(4, 2);
    const numerator = new Polynomial({ 0: coefficient0, 2: coefficient2 });
    const denominator = new Polynomial();
    const functionType = "NEWTON";
    const newtonCoefficient = new Complex(1, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.numerator).toBe(numerator);
    expect(fractalFunction.denominator).toBe(denominator);
    expect(fractalFunction.functionType).toBe(functionType);
    expect(fractalFunction.newtonCoefficient).toBe(newtonCoefficient);
    expect(fractalFunction.newtonNumerator).toEqual(
      new Polynomial({
        0: new ComplexMultiplication(coefficient0, newtonCoefficient.multipliedBy(-1)),
        2: new ComplexMultiplication(coefficient2, newtonCoefficient.multipliedBy(-1).plus(2)),
      })
    );
  });
});

describe("fromJSON", () => {
  it("properly constructs from JSON", () => {
    const numerator = new Polynomial();
    const denominator = new Polynomial();
    const functionType = "DEFAULT";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = FractalFunction.fromJSON({
      numerator: numerator.toJSON(),
      denominator: denominator.toJSON(),
      functionType: functionType,
      newtonCoefficient: Coefficient.toJSON(newtonCoefficient),
    });

    expect(fractalFunction).toEqual(
      new FractalFunction(numerator, denominator, functionType, newtonCoefficient)
    );
  });
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const numerator = new Polynomial();
    const denominator = new Polynomial();
    const functionType = "DEFAULT";
    const newtonCoefficient = new Complex(0, 0);

    const json = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    ).toJSON();

    expect(json).toEqual({
      numerator: numerator.toJSON(),
      denominator: denominator.toJSON(),
      functionType: functionType,
      newtonCoefficient: Coefficient.toJSON(newtonCoefficient),
    });
  });
});

describe("getCoefficient", () => {
  it("properly gets coefficients from numerator", () => {
    const coefficient = new Complex(3, 6);
    const numerator = new Polynomial({ 1: coefficient });
    const denominator = new Polynomial();
    const functionType = "DEFAULT";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.getCoefficient(1, true)).toEqual(coefficient);
  });

  it("properly gets coefficients from denominator", () => {
    const coefficient = new Complex(3, 6);
    const numerator = new Polynomial();
    const denominator = new Polynomial({ 1: coefficient });
    const functionType = "DEFAULT";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.getCoefficient(1, false)).toEqual(coefficient);
  });
});

describe("setCoefficient", () => {
  it("properly sets coefficients in numerator", () => {
    const numerator = new Polynomial();
    const denominator = new Polynomial();
    const functionType = "DEFAULT";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    const coefficient = new Complex(3, 6);
    fractalFunction.setCoefficient(2, true, coefficient);

    expect(fractalFunction).toEqual(
      new FractalFunction(
        new Polynomial({ 2: coefficient }),
        denominator,
        functionType,
        newtonCoefficient
      )
    );
  });

  it("properly throws errors when setting coefficients in the denominator", () => {
    const fractalFunction = new FractalFunction();

    expect(() => fractalFunction.setCoefficient(2, false, new Complex(3, 6))).toThrowError();
  });

  it("properly sets coefficients in numerator in Newton function", () => {
    const numerator = new Polynomial();
    const denominator = new Polynomial();
    const functionType = "NEWTON";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    const coefficient = new Complex(3, 6);
    fractalFunction.setCoefficient(2, true, coefficient);

    expect(fractalFunction).toEqual(
      new FractalFunction(
        new Polynomial({ 2: coefficient }),
        new Polynomial({ 1: coefficient.multipliedBy(2) }),
        functionType,
        newtonCoefficient
      )
    );
  });

  it("properly sets coefficients in numerator in Newton function wth power 0", () => {
    const numerator = new Polynomial();
    const denominator = new Polynomial();
    const functionType = "NEWTON";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    const coefficient = new Complex(3, 6);
    fractalFunction.setCoefficient(0, true, coefficient);

    expect(fractalFunction).toEqual(
      new FractalFunction(
        new Polynomial({ 0: coefficient }),
        new Polynomial(),
        functionType,
        newtonCoefficient
      )
    );
  });
});

describe("removeCoefficient", () => {
  it("properly removes coefficients in numerator", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial();
    const functionType = "DEFAULT";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    fractalFunction.removeCoefficient(2, true);

    expect(fractalFunction).toEqual(
      new FractalFunction(new Polynomial(), denominator, functionType, newtonCoefficient)
    );
  });

  it("properly throws errors when removing coefficients from the denominator", () => {
    const fractalFunction = new FractalFunction();

    expect(() => fractalFunction.removeCoefficient(2, false)).toThrowError();
  });

  it("properly removes coefficients from numerator in Newton function", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({ 1: new Complex(6, 12) });
    const functionType = "NEWTON";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    fractalFunction.removeCoefficient(2, true);

    expect(fractalFunction).toEqual(
      new FractalFunction(new Polynomial(), new Polynomial(), functionType, newtonCoefficient)
    );
  });

  it("properly removes coefficients from numerator in Newton function with power 0", () => {
    const numerator = new Polynomial({ 0: new Complex(3, 6) });
    const denominator = new Polynomial();
    const functionType = "NEWTON";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    fractalFunction.removeCoefficient(0, true);

    expect(fractalFunction).toEqual(
      new FractalFunction(new Polynomial(), new Polynomial(), functionType, newtonCoefficient)
    );
  });
});

describe("updateWithTime", () => {
  it("properly updates default function", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial();
    const functionType = "DEFAULT";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator.copy(),
      denominator.copy(),
      functionType,
      newtonCoefficient
    );

    const time = 1000;
    fractalFunction.updateWithTime(time);
    numerator.updateWithTime(time);
    denominator.updateWithTime(time);

    expect(fractalFunction.numerator).toEqual(numerator);
    expect(fractalFunction.denominator).toEqual(denominator);
  });

  it("properly updates Newton function", () => {
    const coefficient2 = new Complex(3, 6);
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({ 1: new Complex(6, 12) });
    const functionType = "NEWTON";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator.copy(),
      denominator.copy(),
      functionType,
      newtonCoefficient
    );

    const time = 1000;
    fractalFunction.updateWithTime(time);
    numerator.updateWithTime(time);
    denominator.updateWithTime(time);
    const newtonNumerator = new Polynomial({
      2: new ComplexMultiplication(coefficient2, newtonCoefficient.multipliedBy(-1).plus(2)),
    });
    newtonNumerator.updateWithTime(time);

    expect(fractalFunction.numerator).toEqual(numerator);
    expect(fractalFunction.denominator).toEqual(denominator);
    expect(fractalFunction.newtonNumerator).toEqual(newtonNumerator);
  });
});

describe("getNumeratorNbCoefficients", () => {
  it("properly gets the number of coefficients of the numerator", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial();
    const functionType = "DEFAULT";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.getNumeratorNbCoefficients()).toEqual(numerator.getNbCoefficients());
  });
});

describe("getDenominatorNbCoefficients", () => {
  it("properly gets the number of coefficients of the denominator", () => {
    const numerator = new Polynomial();
    const denominator = new Polynomial({ 2: new Complex(3, 6) });
    const functionType = "DEFAULT";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.getDenominatorNbCoefficients()).toEqual(denominator.getNbCoefficients());
  });
});

describe("getNumeratorArray", () => {
  it("properly gets an array representing the numerator in default function", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial();
    const functionType = "DEFAULT";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.getNumeratorArray()).toEqual(numerator.getArrayRepresentation());
  });

  it("properly gets an array representing the numerator in Newton function", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({ 1: new Complex(6, 12) });
    const functionType = "NEWTON";
    const newtonCoefficient = new Complex(1, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.getNumeratorArray()).toEqual(
      fractalFunction.newtonNumerator.getArrayRepresentation()
    );
  });
});

describe("getDenominatorArray", () => {
  it("properly gets an array representing the denominator", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial();
    const functionType = "DEFAULT";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.getDenominatorArray()).toEqual(denominator.getArrayRepresentation());
  });
});

describe("setFunctionType", () => {
  it("properly sets the function type from DEFAULT to NEWTON", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial();
    const functionType = "DEFAULT";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    fractalFunction.setFunctionType("NEWTON");

    expect(fractalFunction).toEqual(
      new FractalFunction(
        numerator,
        new Polynomial({ 1: new Complex(6, 12) }),
        "NEWTON",
        new Complex(1, 0)
      )
    );
  });

  it("properly sets the function type from NEWTON to DEFAULT", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({ 1: new Complex(6, 12) });
    const functionType = "NEWTON";
    const newtonCoefficient = new Complex(1, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    fractalFunction.setFunctionType("DEFAULT");

    expect(fractalFunction).toEqual(
      new FractalFunction(
        numerator,
        new Polynomial({ 0: new Complex(1, 0) }),
        "DEFAULT",
        new Complex(0, 0)
      )
    );
  });

  it("properly throws an error if the function type is incorrect", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial();
    const functionType = "DEAULT";
    const newtonCoefficient = new Complex(1, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(() => fractalFunction.setFunctionType("WRONG_FUNCTION_TYPE")).toThrowError();
  });
});

describe("setNewtonCoefficient", () => {
  it("properly sets the newton coefficient on default function", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial();
    const functionType = "DEFAULT";
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    const newNewtonCoefficient = new Complex(2, 0);
    fractalFunction.setNewtonCoefficient(newNewtonCoefficient);

    expect(fractalFunction).toEqual(
      new FractalFunction(numerator, denominator, "DEFAULT", newNewtonCoefficient)
    );
  });

  it("properly sets the newton coefficient on Newton function", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({ 1: new Complex(6, 12) });
    const functionType = "NEWTON";
    const newtonCoefficient = new Complex(1, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    const newNewtonCoefficient = new Complex(2, 0);
    fractalFunction.setNewtonCoefficient(newNewtonCoefficient);

    expect(fractalFunction).toEqual(
      new FractalFunction(numerator, denominator, "NEWTON", newNewtonCoefficient)
    );
  });
});

describe("copy", () => {
  it("properly copies", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({ 1: new Complex(6, 12) });
    const functionType = "NEWTON";
    const newtonCoefficient = new Complex(1, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.copy()).toEqual(fractalFunction);
    expect(fractalFunction.copy()).not.toBe(fractalFunction);
  });
});
