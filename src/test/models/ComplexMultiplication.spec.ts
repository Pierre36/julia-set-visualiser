import { describe, it, expect } from "vitest";
import ComplexMultiplication from "@/models/ComplexMultiplication";
import Complex from "@/models/Complex";
import ComplexCircle from "@/models/ComplexCircle";
import ComplexLine from "@/models/ComplexLine";

describe("constructor", () => {
  it("properly constructs", () => {
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 1, 2000);
    const coefficient2 = new Complex(2, 0);

    const product = ComplexMultiplication.of(coefficient1, coefficient2);

    expect(product).toBeInstanceOf(ComplexMultiplication);
    expect((product as ComplexMultiplication).coefficient1).toBe(coefficient1);
    expect((product as ComplexMultiplication).coefficient2).toBe(coefficient2);
  });
});

it("properly returns a complex number when given two complex numbers", () => {
  const coefficient1 = new Complex(1, 0);
  const coefficient2 = new Complex(2, 0);

  const product = ComplexMultiplication.of(coefficient1, coefficient2);

  expect(product).toEqual(coefficient1.multipliedByComplex(coefficient2));
});

describe("getAtTime", () => {
  it("properly returns the product at time", () => {
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 1, 2000);
    const coefficient2 = new Complex(2, 0);

    const product = ComplexMultiplication.of(coefficient1, coefficient2);

    expect(product.getAtTime(0)).toEqual(new Complex(4, 0));
  });
});

describe("toString", () => {
  it("properly returns a string representation of the multiplication", () => {
    expect(
      ComplexMultiplication.of(
        new Complex(3, 6),
        new ComplexLine(new Complex(1, 0), new Complex(2, 0), 3)
      ).toString()
    ).toBe("ComplexMultiplication(3 + 6i, ComplexLine(1, 2, 3))");
  });
});
