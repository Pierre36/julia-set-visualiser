import { describe, it, expect } from "vitest";

import { Complex } from "../Complex";

describe("constructor", () => {
  it("properly constructs", () => {
    const re = 1;
    const im = 2;

    const complex = new Complex(re, im);

    expect(complex.re).toBe(re);
    expect(complex.im).toBe(im);
  });
});

describe("fromJSON", () => {
  it("properly constructs from null JSON", () => {
    const complex = Complex.fromJSON(null);

    expect(complex).toBeNull();
  });

  it("properly constructs from JSON", () => {
    const re = 3;
    const im = 6;

    const complex = Complex.fromJSON({ re: re, im: im });

    expect(complex).toEqual(new Complex(re, im));
  });
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const re = 3;
    const im = 6;

    const json = new Complex(re, im).toJSON();

    expect(json).toEqual({ re: re, im: im });
  });
});

describe("fromString", () => {
  it("throws an error when constructed from invalid String", () => {
    expect(() => Complex.fromString("a + 3i")).toThrowError();
  });

  it("throws an error when constructed from empty String", () => {
    expect(() => Complex.fromString("")).toThrowError();
  });

  it("works with 1", () => {
    const complex = Complex.fromString("1");

    expect(complex).toEqual(new Complex(1, 0));
  });

  it("works with 1i", () => {
    const complex = Complex.fromString("1i");

    expect(complex).toEqual(new Complex(0, 1));
  });

  it("works with 1 + i", () => {
    const complex = Complex.fromString("1 + i");

    expect(complex).toEqual(new Complex(1, 1));
  });

  it("works with 1 + 2i", () => {
    const complex = Complex.fromString("1 + 2i");

    expect(complex).toEqual(new Complex(1, 2));
  });

  it("works with 1 - i", () => {
    const complex = Complex.fromString("1 - i");

    expect(complex).toEqual(new Complex(1, -1));
  });

  it("works with 1 - 2i", () => {
    const complex = Complex.fromString("1 - 2i");

    expect(complex).toEqual(new Complex(1, -2));
  });

  it("works with 1.5", () => {
    const complex = Complex.fromString("1.5");

    expect(complex).toEqual(new Complex(1.5, 0));
  });

  it("works with 0.2i", () => {
    const complex = Complex.fromString("0.2i");

    expect(complex).toEqual(new Complex(0, 0.2));
  });

  it("works with 0.2 + 2.5676i", () => {
    const complex = Complex.fromString("0.2 + 2.5676i");

    expect(complex).toEqual(new Complex(0.2, 2.5676));
  });

  it("works with i", () => {
    const complex = Complex.fromString("i");

    expect(complex).toEqual(new Complex(0, 1));
  });

  it("works with -i", () => {
    const complex = Complex.fromString("-i");

    expect(complex).toEqual(new Complex(0, -1));
  });

  it("works with -1", () => {
    const complex = Complex.fromString("-1");

    expect(complex).toEqual(new Complex(-1, 0));
  });

  it("works with -3i", () => {
    const complex = Complex.fromString("-3i");

    expect(complex).toEqual(new Complex(0, -3));
  });

  it("works with -2 + 2i", () => {
    const complex = Complex.fromString("-3i");

    expect(complex).toEqual(new Complex(0, -3));
  });

  it("works with 2 - 4i", () => {
    const complex = Complex.fromString("-3i");

    expect(complex).toEqual(new Complex(0, -3));
  });
});

describe("mod", () => {
  it("returns 0 for 0 + 0i", () => {
    const complex = new Complex(0, 0);

    expect(complex.mod()).toBe(0);
  });

  it("returns sqrt(2) for 1 + 1i", () => {
    const complex = new Complex(1, 1);

    expect(complex.mod()).toBe(Math.sqrt(2));
  });
});

describe("arg", () => {
  it("returns 0 for 0 + 0i", () => {
    const complex = new Complex(0, 0);

    expect(complex.arg()).toBe(0);
  });

  it("returns pi/4 for 1 + 1i", () => {
    const complex = new Complex(1, 1);

    expect(complex.arg()).toBe(Math.PI / 4);
  });
});

describe("copy", () => {
  it("properly copies", () => {
    const complex = new Complex(3, 6);

    expect(complex.copy()).toEqual(complex);
    expect(complex.copy()).not.toBe(complex);
  });
});

describe("toMathML", () => {
  it("works with 1", () => {
    const complex = new Complex(1, 0);

    expect(complex.toMathML()).toEqual("<mn>1</mn>");
  });

  it("works with 1 when not showing 1", () => {
    const complex = new Complex(1, 0);

    expect(complex.toMathML(false)).toEqual("");
  });

  it("works with -1 when not showing 1", () => {
    const complex = new Complex(-1, 0);

    expect(complex.toMathML(false)).toEqual("");
  });

  it("works with -1", () => {
    const complex = new Complex(-1, 0);

    expect(complex.toMathML()).toEqual("<mn>1</mn>");
  });

  it("works with 3.6", () => {
    const complex = new Complex(3.6, 0);

    expect(complex.toMathML()).toEqual("<mn>3.6</mn>");
  });

  it("works with -3.6", () => {
    const complex = new Complex(-3.6, 0);

    expect(complex.toMathML()).toEqual("<mn>3.6</mn>");
  });

  it("works with i", () => {
    const complex = new Complex(0, 1);

    expect(complex.toMathML()).toEqual("<mi>i</mi>");
  });

  it("works with -i", () => {
    const complex = new Complex(0, -1);

    expect(complex.toMathML()).toEqual("<mi>i</mi>");
  });

  it("works with 3.6i", () => {
    const complex = new Complex(0, 3.6);

    expect(complex.toMathML()).toEqual("<mn>3.6</mn><mi>i</mi>");
  });

  it("works with -3.6i", () => {
    const complex = new Complex(0, -3.6);

    expect(complex.toMathML()).toEqual("<mn>3.6</mn><mi>i</mi>");
  });

  it("works with 1 + i", () => {
    const complex = new Complex(1, 1);

    expect(complex.toMathML()).toEqual(
      "<mo form='prefix' stretchy='false'>(</mo><mn>1</mn><mo>+</mo><mi>i</mi><mo form='prefix' stretchy='false'>)</mo>"
    );
  });

  it("works with 2 + 2i", () => {
    const complex = new Complex(2, 2);

    expect(complex.toMathML()).toEqual(
      "<mo form='prefix' stretchy='false'>(</mo><mn>2</mn><mo>+</mo><mn>2</mn><mi>i</mi><mo form='prefix' stretchy='false'>)</mo>"
    );
  });

  it("works with 3.6 + 4.2i", () => {
    const complex = new Complex(3.6, 4.2);

    expect(complex.toMathML()).toEqual(
      "<mo form='prefix' stretchy='false'>(</mo><mn>3.6</mn><mo>+</mo><mn>4.2</mn><mi>i</mi><mo form='prefix' stretchy='false'>)</mo>"
    );
  });

  it("works with -1 - i", () => {
    const complex = new Complex(-1, -1);

    expect(complex.toMathML()).toEqual(
      "<mo form='prefix' stretchy='false'>(</mo><mn>-1</mn><mo>-</mo><mi>i</mi><mo form='prefix' stretchy='false'>)</mo>"
    );
  });

  it("works with -2 - 2i", () => {
    const complex = new Complex(-2, -2);

    expect(complex.toMathML()).toEqual(
      "<mo form='prefix' stretchy='false'>(</mo><mn>-2</mn><mo>-</mo><mn>2</mn><mi>i</mi><mo form='prefix' stretchy='false'>)</mo>"
    );
  });

  it("works with -3.6 - 4.2i", () => {
    const complex = new Complex(-3.6, -4.2);

    expect(complex.toMathML()).toEqual(
      "<mo form='prefix' stretchy='false'>(</mo><mn>-3.6</mn><mo>-</mo><mn>4.2</mn><mi>i</mi><mo form='prefix' stretchy='false'>)</mo>"
    );
  });
});

describe("toString", () => {
  it("works with 1", () => {
    const complex = new Complex(1, 0);

    expect(complex.toString()).toEqual("1");
  });

  it("works with -1", () => {
    const complex = new Complex(-1, 0);

    expect(complex.toString()).toEqual("-1");
  });

  it("works with 3.6", () => {
    const complex = new Complex(3.6, 0);

    expect(complex.toString()).toEqual("3.6");
  });

  it("works with -3.6", () => {
    const complex = new Complex(-3.6, 0);

    expect(complex.toString()).toEqual("-3.6");
  });

  it("works with i", () => {
    const complex = new Complex(0, 1);

    expect(complex.toString()).toEqual("i");
  });

  it("works with -i", () => {
    const complex = new Complex(0, -1);

    expect(complex.toString()).toEqual("-i");
  });

  it("works with 3.6i", () => {
    const complex = new Complex(0, 3.6);

    expect(complex.toString()).toEqual("3.6i");
  });

  it("works with -3.6i", () => {
    const complex = new Complex(0, -3.6);

    expect(complex.toString()).toEqual("-3.6i");
  });

  it("works with 1 + i", () => {
    const complex = new Complex(1, 1);

    expect(complex.toString()).toEqual("1 + i");
  });

  it("works with 2 + 2i", () => {
    const complex = new Complex(2, 2);

    expect(complex.toString()).toEqual("2 + 2i");
  });

  it("works with 3.6 + 4.2i", () => {
    const complex = new Complex(3.6, 4.2);

    expect(complex.toString()).toEqual("3.6 + 4.2i");
  });

  it("works with -1 - i", () => {
    const complex = new Complex(-1, -1);

    expect(complex.toString()).toEqual("-1 - i");
  });

  it("works with -2 - 2i", () => {
    const complex = new Complex(-2, -2);

    expect(complex.toString()).toEqual("-2 - 2i");
  });

  it("works with -3.6 - 4.2i", () => {
    const complex = new Complex(-3.6, -4.2);

    expect(complex.toString()).toEqual("-3.6 - 4.2i");
  });
});

describe("isZero", () => {
  it("properly returns true for 0", () => {
    const complex = new Complex(0, 0);

    expect(complex.isZero()).toBe(true);
  });

  it("properly returns false for something different from 0", () => {
    const complex = new Complex(0.1, 0);

    expect(complex.isZero()).toBe(false);
  });
});

describe("showMinus", () => {
  it("properly returns true for -1", () => {
    const complex = new Complex(-1, 0);

    expect(complex.showMinus()).toBe(true);
  });

  it("properly returns true for -i", () => {
    const complex = new Complex(0, -1);

    expect(complex.showMinus()).toBe(true);
  });

  it("properly returns false for 1", () => {
    const complex = new Complex(1, 0);

    expect(complex.showMinus()).toBe(false);
  });

  it("properly returns false for i", () => {
    const complex = new Complex(0, 1);

    expect(complex.showMinus()).toBe(false);
  });

  it("properly returns false for 1 - i", () => {
    const complex = new Complex(1, -1);

    expect(complex.showMinus()).toBe(false);
  });
});

describe("multipliedBy", () => {
  it("properly multiplies by 0", () => {
    const complex = new Complex(3, 6);

    expect(complex.multipliedBy(0)).toEqual(new Complex(0, 0));
  });

  it("properly multiplies by positive", () => {
    const complex = new Complex(3, 6);

    expect(complex.multipliedBy(2)).toEqual(new Complex(6, 12));
  });

  it("properly multiplies by negative", () => {
    const complex = new Complex(3, 6);

    expect(complex.multipliedBy(-5)).toEqual(new Complex(-15, -30));
  });
});

describe("multipliedByComplex", () => {
  it("properly multiplies by 0", () => {
    const complex = new Complex(3, 6);

    expect(complex.multipliedByComplex(new Complex(0, 0))).toEqual(new Complex(0, 0));
  });

  it("properly multiplies by real", () => {
    const complex = new Complex(3, 6);

    expect(complex.multipliedByComplex(new Complex(-10, 0))).toEqual(new Complex(-30, -60));
  });

  it("properly multiplies by imaginary", () => {
    const complex = new Complex(3, 6);

    expect(complex.multipliedByComplex(new Complex(0, 2))).toEqual(new Complex(-12, 6));
  });

  it("properly multiplies by any complex", () => {
    const complex = new Complex(3, 6);

    expect(complex.multipliedByComplex(new Complex(4, 2))).toEqual(new Complex(0, 30));
  });
});

describe("plus", () => {
  it("properly adds 0", () => {
    const complex = new Complex(3, 6);

    expect(complex.plus(0)).toEqual(new Complex(3, 6));
  });

  it("properly adds positive", () => {
    const complex = new Complex(3, 6);

    expect(complex.plus(36)).toEqual(new Complex(39, 6));
  });

  it("properly adds negative", () => {
    const complex = new Complex(3, 6);

    expect(complex.plus(-42)).toEqual(new Complex(-39, 6));
  });
});

describe("getAtTime", () => {
  it("properly returns itself", () => {
    const complex = new Complex(3, 6);

    expect(complex.getAtTime(5)).toEqual(new Complex(3, 6));
  });
});
