import { describe, it, expect, vi } from "vitest";
import Configuration from "@/models/Configuration";
import Complex, { type RandomComplexParameters } from "@/models/Complex";
import FractalFunction, { type RandomFractalFunctionParameters } from "@/models/FractalFunction";
import Polynomial from "@/models/Polynomial";
import Attractor, { type RandomAttractorParameters } from "@/models/Attractor";
import RandomUtils from "@/utils/RandomUtils";
import FunctionTypes from "@/constants/FunctionTypes";

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
      new Complex(0, 0)
    );
    const juliaHSV = [0, 0, 0];
    const defaultAttractor = new Attractor(undefined, 210, 1, 1, 0.5, 1.5);
    const infinityAttractor = new Attractor(undefined, 80, 1, 1, 0.5, 1.5);
    const attractors: Attractor[] = [];

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
      defaultAttractor,
      infinityAttractor,
      attractors
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
    expect(configuration.defaultAttractor).toBe(defaultAttractor);
    expect(configuration.infinityAttractor).toBe(infinityAttractor);
    expect(configuration.attractors).toBe(attractors);
  });
});

describe("toString", () => {
  it("properly returns a string representation of the configuration", () => {
    expect(Configuration.defaultConfiguration("ID", "Name").toString()).toBe(
      "Configuration(ID, Name, 1, 2, 0, 20, 0.00001, -4, FractalFunction(Polynomial(1z^2), Polynomial(1), DEFAULT, 0), [0, 0, 1], Attractor(undefined, 210, 0.11, 0, 0.26, 1.4), Attractor(undefined, 210, 0.11, 0, 0.26, 1.4), [])"
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
    FunctionTypes.DEFAULT
  );
  const juliaHSV = [1, 2, 3];
  const defaultAttractor = new Attractor(undefined, 210, 1, 1, 0.5, 1.5);
  const infinityAttractor = new Attractor(undefined, 80, 1, 1, 0.5, 1.5);
  const attractor = new Attractor(new Complex(1, 0), 50, 3, 6, 4, 2);

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
    defaultAttractor: defaultAttractor.toJSON(),
    infinityAttractor: infinityAttractor.toJSON(),
    attractors: [attractor.toJSON()],
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
        defaultAttractor,
        infinityAttractor,
        [attractor]
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
    if (key == "attractors") {
      validJson[key] = [attractor.toJSON(), "invalid"];
      testCases.push({
        description: `rejects JSON with invalid ${key}`,
        json: { ...validJson },
        output: undefined,
      });
    }
    validJson[key] = value;
  }

  testCases.forEach(({ description, json, output }) =>
    it(`${description}`, () => expect(Configuration.fromJSON(json)).toEqual(output))
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
      new Complex(0, 0)
    );
    const juliaHSV = [0, 0, 0];
    const defaultAttractor = new Attractor(undefined, 210, 1, 1, 0.5, 1.5);
    const infinityAttractor = new Attractor(undefined, 80, 1, 1, 0.5, 1.5);
    const attractor = new Attractor(new Complex(1, 0), 50, 3, 6, 4, 2);
    const attractors = [attractor];

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
      defaultAttractor,
      infinityAttractor,
      attractors
    ).toJSON();

    expect(json).toEqual({
      id: id,
      name: name,
      resolutionScale: resolutionScale,
      coordinatesScale: coordinatesScale,
      coordinatesCentre: coordinatesCentre.toJSON(),
      iterationsCount: iterationsCount,
      epsilon: epsilon,
      juliaBound: juliaBound,
      fractalFunction: fractalFunction.toJSON(),
      juliaHSV: juliaHSV,
      defaultAttractor: defaultAttractor.toJSON(),
      infinityAttractor: infinityAttractor.toJSON(),
      attractors: [attractor.toJSON()],
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
        new Complex(1, 0)
      ),
      [0, 0, 0],
      new Attractor(undefined, 0, 0, 0, 0, 0),
      new Attractor(undefined, 0, 0, 0, 0, 0),
      [new Attractor(new Complex(3, 6), 5, 6, 7, 8, 9)]
    );

    expect(configuration.copy()).toEqual(configuration);
    expect(configuration.copy()).not.toBe(configuration);
  });
});

describe("randomize", () => {
  it("properly randomizes the configuration", () => {
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
    const defaultAttractor = new Attractor(undefined, 1, 1, 1, 0.5, 1.5);
    const infinityAttractor = new Attractor(undefined, 1, 1, 1, 0.5, 1.5);
    const attractors = [new Attractor(new Complex(1, 0), 1, 3, 6, 4, 2)];

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
      defaultAttractor,
      infinityAttractor,
      attractors
    );

    const randomFractalFunction = new FractalFunction(
      new Polynomial({ 0: new Complex(3, 6) }),
      FunctionTypes.DEFAULT
    );
    FractalFunction.getRandomFractalFunction = vi.fn(() => randomFractalFunction);
    RandomUtils.floatBetween = vi.fn((min, _) => min);
    RandomUtils.integerBetween = vi.fn((min, _) => min);
    const randomComplex = new Complex(4, 2);
    Complex.getRandomComplex = vi.fn(() => randomComplex);
    const randomAttractor = new Attractor(undefined, 0, 1, 2, 3, 4);
    Attractor.getRandomAttractor = vi.fn(() => randomAttractor);

    const functionParameters = {} as RandomFractalFunctionParameters;
    const attractorsParameters = {} as RandomAttractorParameters;
    const viewportCentreParameters = {} as RandomComplexParameters;
    const params = {
      functionParameters,
      minJuliaHue: 0,
      maxJuliaHue: 1,
      minJuliaSaturation: 2,
      maxJuliaSaturation: 3,
      minJuliaValue: 4,
      maxJuliaValue: 5,
      attractorsParameters,
      minViewportScale: 6,
      maxViewportScale: 7,
      viewportCentreParameters,
      minIterationsCount: 8,
      maxIterationsCount: 9,
      minEpsilon: 10,
      maxEpsilon: 11,
      minJuliaBound: 12,
      maxJuliaBound: 13,
    };

    configuration.randomize(params);

    expect(FractalFunction.getRandomFractalFunction).toHaveBeenCalledWith(functionParameters);
    expect(RandomUtils.integerBetween).toHaveBeenCalledWith(0, 1);
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(2, 3);
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(4, 5);
    expect(Attractor.getRandomAttractor).toHaveBeenCalledWith(attractorsParameters);
    expect(Attractor.getRandomAttractor).toBeCalledTimes(2);
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(6, 7);
    expect(Complex.getRandomComplex).toHaveBeenCalledWith(viewportCentreParameters);
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
        randomAttractor,
        randomAttractor,
        []
      )
    );
  });
});
