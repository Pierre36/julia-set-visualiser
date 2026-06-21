import FunctionTypes from "@/constants/FunctionTypes";
import Complex, { type RandomComplexParameters } from "@/models/Complex";
import Configuration from "@/models/Configuration";
import FractalFunction, { type RandomFractalFunctionParameters } from "@/models/FractalFunction";
import Polynomial from "@/models/Polynomial";
import RandomUtils from "@/utils/RandomUtils";
import { describe, expect, it, vi } from "vitest";

describe("constructor", () => {
  it("properly constructs", () => {
    const id = "ID";
    const name = "Name";
    const resolutionScale = 1;
    const coordinatesScale = 1;
    const coordinatesCentre = new Complex(0, 0);
    const iterationsCount = 10;
    const epsilon = 0.1;
    const juliaBound = -4;
    const fractalFunction = new FractalFunction(
      new Polynomial({}),
      FunctionTypes.DEFAULT,
      new Polynomial({}),
      new Complex(0, 0),
    );
    const juliaHSV = [0, 0, 0];
    const fatouHue = 210;
    const fatouSaturationStrength = 3.6;
    const fatouSaturationOffset = 4.2;
    const fatouValueStrength = 3;
    const fatouValueOffset = 6;

    const configuration = new Configuration(
      id,
      name,
      resolutionScale,
      coordinatesScale,
      coordinatesCentre,
      iterationsCount,
      epsilon,
      juliaBound,
      fractalFunction,
      juliaHSV,
      fatouHue,
      fatouSaturationStrength,
      fatouSaturationOffset,
      fatouValueStrength,
      fatouValueOffset,
    );

    expect(configuration.id).toBe(id);
    expect(configuration.name).toBe(name);
    expect(configuration.resolutionScale).toBe(resolutionScale);
    expect(configuration.coordinatesScale).toBe(coordinatesScale);
    expect(configuration.coordinatesCentre).toBe(coordinatesCentre);
    expect(configuration.iterationsCount).toBe(iterationsCount);
    expect(configuration.epsilon).toBe(epsilon);
    expect(configuration.juliaBound).toBe(juliaBound);
    expect(configuration.fractalFunction).toBe(fractalFunction);
    expect(configuration.juliaHSV).toBe(juliaHSV);
    expect(configuration.fatouHue).toBe(fatouHue);
    expect(configuration.fatouSaturationStrength).toBe(fatouSaturationStrength);
    expect(configuration.fatouSaturationOffset).toBe(fatouSaturationOffset);
    expect(configuration.fatouValueStrength).toBe(fatouValueStrength);
    expect(configuration.fatouValueOffset).toBe(fatouValueOffset);
  });
});

describe("toString", () => {
  it("properly returns a string representation of the configuration", () => {
    expect(Configuration.defaultConfiguration("ID", "Name").toString()).toBe(
      "Configuration(ID, Name, 1, 2, 0, 20, 0.001, 1, FractalFunction(Polynomial(1z^2), Polynomial(1), DEFAULT, 0), [0, 0, 1], 210, 0.11, 0, 0.26, 1.4)",
    );
  });
});

describe("fromJSON", () => {
  const id = "ID";
  const name = "Name";
  const resolutionScale = 1;
  const coordinatesScale = 1;
  const coordinatesCentre = new Complex(1, 2);
  const iterationsCount = 10;
  const epsilon = 0.1;
  const juliaBound = 4;
  const fractalFunction = new FractalFunction(
    new Polynomial({ 0: new Complex(3, 4) }),
    FunctionTypes.DEFAULT,
  );
  const juliaHSV = [1, 2, 3];
  const fatouHue = 210;
  const fatouSaturationStrength = 3.6;
  const fatouSaturationOffset = 4.2;
  const fatouValueStrength = 3;
  const fatouValueOffset = 6;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validJson: any = {
    id,
    name,
    resolutionScale,
    coordinatesScale,
    coordinatesCentre: coordinatesCentre.toJSON(),
    iterationsCount,
    epsilon,
    juliaBound,
    fractalFunction: fractalFunction.toJSON(),
    juliaHSV,
    fatouHue,
    fatouSaturationStrength,
    fatouSaturationOffset,
    fatouValueStrength,
    fatouValueOffset,
  };

  const testCases = [
    {
      description: "reads JSON correctly",
      json: validJson,
      output: new Configuration(
        id,
        name,
        resolutionScale,
        coordinatesScale,
        coordinatesCentre,
        iterationsCount,
        epsilon,
        juliaBound,
        fractalFunction,
        juliaHSV,
        fatouHue,
        fatouSaturationStrength,
        fatouSaturationOffset,
        fatouValueStrength,
        fatouValueOffset,
      ),
    },
    { description: "does not accept undefined", json: undefined, output: undefined },
  ];

  for (const key of Object.keys(validJson)) {
    const value = validJson[key];
    validJson[key] = undefined;
    testCases.push({
      description: `rejects JSON missing ${key}`,
      json: { ...validJson },
      output: undefined,
    });
    if (key != "id" && key != "name") {
      validJson[key] = "invalid";
      testCases.push({
        description: `rejects JSON with invalid ${key}`,
        json: { ...validJson },
        output: undefined,
      });
    }
    if (key == "juliaHSV") {
      validJson[key] = [1, 2];
      testCases.push({
        description: `rejects JSON with invalid ${key}`,
        json: { ...validJson },
        output: undefined,
      });
      validJson[key] = ["1", "2", "3"];
      testCases.push({
        description: `rejects JSON with invalid ${key}`,
        json: { ...validJson },
        output: undefined,
      });
    }
    validJson[key] = value;
  }

  testCases.forEach(({ description, json, output }) =>
    it(`${description}`, () => expect(Configuration.fromJSON(json)).toEqual(output)),
  );
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const id = "ID";
    const name = "Name";
    const resolutionScale = 1;
    const coordinatesScale = 1;
    const coordinatesCentre = new Complex(0, 0);
    const iterationsCount = 10;
    const epsilon = 0.1;
    const juliaBound = -4;
    const fractalFunction = new FractalFunction(
      new Polynomial({}),
      FunctionTypes.DEFAULT,
      new Polynomial({}),
      new Complex(0, 0),
    );
    const juliaHSV = [0, 0, 0];
    const fatouHue = 210;
    const fatouSaturationStrength = 3.6;
    const fatouSaturationOffset = 4.2;
    const fatouValueStrength = 3;
    const fatouValueOffset = 6;

    const json = new Configuration(
      id,
      name,
      resolutionScale,
      coordinatesScale,
      coordinatesCentre,
      iterationsCount,
      epsilon,
      juliaBound,
      fractalFunction,
      juliaHSV,
      fatouHue,
      fatouSaturationStrength,
      fatouSaturationOffset,
      fatouValueStrength,
      fatouValueOffset,
    ).toJSON();

    expect(json).toEqual({
      id,
      name,
      resolutionScale,
      coordinatesScale,
      coordinatesCentre: coordinatesCentre.toJSON(),
      iterationsCount,
      epsilon,
      juliaBound,
      fractalFunction: fractalFunction.toJSON(),
      juliaHSV,
      fatouHue,
      fatouSaturationStrength,
      fatouSaturationOffset,
      fatouValueStrength,
      fatouValueOffset,
    });
  });
});

describe("copy", () => {
  it("creates a copy", () => {
    const configuration = new Configuration(
      "id",
      "name",
      1,
      1,
      new Complex(0, 0),
      20,
      0.00001,
      -4,
      new FractalFunction(
        new Polynomial({}),
        FunctionTypes.DEFAULT,
        new Polynomial({ 0: new Complex(1, 0) }),
        new Complex(1, 0),
      ),
      [0, 0, 0],
      5,
      6,
      7,
      8,
      9,
    );

    expect(configuration.copy()).toEqual(configuration);
    expect(configuration.copy()).not.toBe(configuration);
  });
});

describe("randomise", () => {
  it("properly randomises the configuration", () => {
    const id = "ID";
    const name = "Name";
    const resolutionScale = 1;
    const coordinatesScale = 1;
    const coordinatesCentre = new Complex(1, 0);
    const iterationsCount = 10;
    const epsilon = 0.1;
    const juliaBound = 1;
    const fractalFunction = new FractalFunction(new Polynomial({}), FunctionTypes.DEFAULT);
    const juliaHSV = [1, 1, 1];
    const fatouHue = 210;
    const fatouSaturationStrength = 3.6;
    const fatouSaturationOffset = 4.2;
    const fatouValueStrength = 3;
    const fatouValueOffset = 6;

    const configuration = new Configuration(
      id,
      name,
      resolutionScale,
      coordinatesScale,
      coordinatesCentre,
      iterationsCount,
      epsilon,
      juliaBound,
      fractalFunction,
      juliaHSV,
      fatouHue,
      fatouSaturationStrength,
      fatouSaturationOffset,
      fatouValueStrength,
      fatouValueOffset,
    );

    const randomFractalFunction = new FractalFunction(
      new Polynomial({ 0: new Complex(3, 6) }),
      FunctionTypes.DEFAULT,
    );
    FractalFunction.getRandomFractalFunction = vi.fn(() => randomFractalFunction);
    RandomUtils.floatBetween = vi.fn((min, _) => min);
    RandomUtils.integerBetween = vi.fn((min, _) => min);
    const randomComplex = new Complex(4, 2);
    Complex.getRandomComplex = vi.fn(() => randomComplex);

    const fractalFunctionParameters = {} as RandomFractalFunctionParameters;
    const viewportCentre = {} as RandomComplexParameters;
    const params = {
      fractalFunction: fractalFunctionParameters,
      minJuliaHue: 0,
      maxJuliaHue: 1,
      minJuliaSaturation: 2,
      maxJuliaSaturation: 3,
      minJuliaValue: 4,
      maxJuliaValue: 5,
      minFatouHue: 14,
      maxFatouHue: 15,
      minFatouSaturationStrength: 16,
      maxFatouSaturationStrength: 17,
      minFatouSaturationOffset: 18,
      maxFatouSaturationOffset: 19,
      minFatouValueStrength: 20,
      maxFatouValueStrength: 21,
      minFatouValueOffset: 22,
      maxFatouValueOffset: 23,
      minViewportScale: 6,
      maxViewportScale: 7,
      viewportCentre,
      minIterationsCount: 8,
      maxIterationsCount: 9,
      minEpsilon: 10,
      maxEpsilon: 11,
      minJuliaBound: 12,
      maxJuliaBound: 13,
    };

    configuration.randomise(params);

    expect(FractalFunction.getRandomFractalFunction).toHaveBeenCalledWith(
      fractalFunctionParameters,
    );
    expect(RandomUtils.integerBetween).toHaveBeenCalledWith(0, 1);
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(2, 3);
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(4, 5);
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(6, 7);
    expect(Complex.getRandomComplex).toHaveBeenCalledWith(viewportCentre);
    expect(RandomUtils.integerBetween).toHaveBeenCalledWith(8, 9);
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(10, 11);
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(12, 13);

    expect(configuration).toEqual(
      new Configuration(
        id,
        name,
        resolutionScale,
        6,
        randomComplex,
        8,
        10,
        12,
        randomFractalFunction,
        [0, 2, 4],
        14,
        16,
        18,
        20,
        22,
      ),
    );
  });
});
