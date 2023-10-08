import { describe, it, expect } from "vitest";

import { ComplexMultiplication } from "../ComplexMultiplication";
import { Complex } from "../Complex";
import { ComplexCircle } from "../ComplexCircle";
import { ComplexLine } from "../ComplexLine";

describe("constructor", () => {
  it("properly constructs", () => {
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 1, 2000);
    const coefficient2 = new Complex(2, 0);

    const product = new ComplexMultiplication(coefficient1, coefficient2);

    expect(product.coefficient1).toBe(coefficient1);
    expect(product.coefficient2).toBe(coefficient2);
  });
});

it("properly returns a complex number when given two complex numbers", () => {
  const coefficient1 = new Complex(1, 0);
  const coefficient2 = new Complex(2, 0);

  const product = new ComplexMultiplication(coefficient1, coefficient2);

  expect(product).toEqual(coefficient1.multipliedBy(coefficient2));
});

describe("getAtTime", () => {
  it("properly returns the product at time", () => {
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 1, 2000);
    const coefficient2 = new Complex(2, 0);

    const product = new ComplexMultiplication(coefficient1, coefficient2);

    expect(product.getAtTime(0)).toEqual(new Complex(4, 0));
  });
});

describe("toString", () => {
  it("properly returns a string representation of the multiplication", () => {
    expect(
      new ComplexMultiplication(
        new Complex(3, 6),
        new ComplexLine(new Complex(1, 0), new Complex(2, 0), 3)
      ).toString()
    ).toBe("ComplexMultiplication(3 + 6i, ComplexLine(1, 2, 3))");
  });
});
