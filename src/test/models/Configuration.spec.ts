import { describe, it, expect, vi } from "vitest";
import Configuration from "@/models/Configuration";
import Complex from "@/models/Complex";
import FractalFunction from "@/models/FractalFunction";
import Polynomial from "@/models/Polynomial";
import Attractor from "@/models/Attractor";
import RandomUtils from "@/utils/RandomUtils";
import FunctionTypes from "@/constants/FunctionTypes";
import CoefficientTypes from "@/constants/CoefficientTypes";

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
      new Polynomial({}),
      FunctionTypes.DEFAULT,
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

describe("fromJSON", () => {
  it("properly constructs from JSON", () => {
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
      new Polynomial({}),
      FunctionTypes.DEFAULT,
      new Complex(0, 0)
    );
    const juliaHSV = [0, 0, 0];
    const defaultAttractor = new Attractor(undefined, 210, 1, 1, 0.5, 1.5);
    const infinityAttractor = new Attractor(undefined, 80, 1, 1, 0.5, 1.5);
    const attractor = new Attractor(new Complex(1, 0), 50, 3, 6, 4, 2);
    const attractors = [attractor];

    const configuration = Configuration.fromJSON({
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

    expect(configuration).toEqual(
      new Configuration(
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
      )
    );
  });
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
      new Polynomial({}),
      FunctionTypes.DEFAULT,
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

describe("defaultConfiguration", () => {
  it("properly returns the default configuration", () => {
    expect(Configuration.defaultConfiguration()).toEqual(
      new Configuration(
        FunctionTypes.DEFAULT,
        "Default",
        1,
        2,
        new Complex(0, 0),
        20,
        0.00001,
        -4,
        new FractalFunction(
          new Polynomial({ 2: new Complex(1, 0) }),
          new Polynomial({ 0: new Complex(1, 0) }),
          FunctionTypes.DEFAULT,
          new Complex(1, 0)
        ),
        [0, 0, 1],
        new Attractor(undefined, 210.0, 0.11, 0.0, 0.26, 1.4),
        new Attractor(undefined, 210.0, 0.11, 0.0, 0.26, 1.4),
        []
      )
    );
  });
});

describe("emptyConfiguration", () => {
  it("properly returns an empty configuration", () => {
    const id = "ID";
    const name = "Name";

    expect(Configuration.emptyConfiguration(id, name)).toEqual(
      new Configuration(
        id,
        name,
        1,
        1,
        new Complex(0, 0),
        20,
        0.00001,
        -4,
        new FractalFunction(
          new Polynomial({}),
          new Polynomial({ 0: new Complex(1, 0) }),
          FunctionTypes.DEFAULT,
          new Complex(1, 0)
        ),
        [0, 0, 0],
        new Attractor(undefined, 0, 0, 0, 0, 0),
        new Attractor(undefined, 0, 0, 0, 0, 0),
        []
      )
    );
  });
});

describe("fillWith", () => {
  it("properly fills with the other configuration with id and name", () => {
    const id1 = "ID1";
    const name1 = "Name1";
    const resolutionScale1 = 1;
    const coordinatesScale1 = 1;
    const coordinatesCentre1 = new Complex(1, 0);
    const iterationsCount1 = 10;
    const epsilon1 = 0.1;
    const juliaBound1 = 1;
    const fractalFunction1 = new FractalFunction(
      new Polynomial({}),
      new Polynomial({}),
      FunctionTypes.DEFAULT,
      new Complex(1, 0)
    );
    const juliaHSV1 = [1, 1, 1];
    const defaultAttractor1 = new Attractor(undefined, 1, 1, 1, 0.5, 1.5);
    const infinityAttractor1 = new Attractor(undefined, 1, 1, 1, 0.5, 1.5);
    const attractor1 = new Attractor(new Complex(1, 0), 1, 3, 6, 4, 2);
    const attractors1 = [attractor1];

    const configuration1 = new Configuration(
      id1,
      name1,
      resolutionScale1,
      coordinatesScale1,
      coordinatesCentre1,
      iterationsCount1,
      epsilon1,
      juliaBound1,
      fractalFunction1,
      juliaHSV1,
      defaultAttractor1,
      infinityAttractor1,
      attractors1
    );

    const id2 = "ID2";
    const name2 = "Name2";
    const resolutionScale2 = 2;
    const coordinatesScale2 = 2;
    const coordinatesCentre2 = new Complex(2, 0);
    const iterationsCount2 = 20;
    const epsilon2 = 0.2;
    const juliaBound2 = 2;
    const fractalFunction2 = new FractalFunction(
      new Polynomial({}),
      new Polynomial({}),
      FunctionTypes.DEFAULT,
      new Complex(2, 0)
    );
    const juliaHSV2 = [2, 2, 2];
    const defaultAttractor2 = new Attractor(undefined, 2, 1, 1, 0.5, 1.5);
    const infinityAttractor2 = new Attractor(undefined, 2, 1, 1, 0.5, 1.5);
    const attractor2 = new Attractor(new Complex(2, 0), 2, 3, 6, 4, 2);
    const attractors2 = [attractor2];

    const configuration2 = new Configuration(
      id2,
      name2,
      resolutionScale2,
      coordinatesScale2,
      coordinatesCentre2,
      iterationsCount2,
      epsilon2,
      juliaBound2,
      fractalFunction2,
      juliaHSV2,
      defaultAttractor2,
      infinityAttractor2,
      attractors2
    );

    configuration1.fillWith(configuration2, false);

    expect(configuration1).toEqual(configuration2);
  });

  it("properly fills with the other configuration without id and name", () => {
    const id1 = "ID1";
    const name1 = "Name1";
    const resolutionScale1 = 1;
    const coordinatesScale1 = 1;
    const coordinatesCentre1 = new Complex(1, 0);
    const iterationsCount1 = 10;
    const epsilon1 = 0.1;
    const juliaBound1 = 1;
    const fractalFunction1 = new FractalFunction(
      new Polynomial({}),
      new Polynomial({}),
      FunctionTypes.DEFAULT,
      new Complex(1, 0)
    );
    const juliaHSV1 = [1, 1, 1];
    const defaultAttractor1 = new Attractor(undefined, 1, 1, 1, 0.5, 1.5);
    const infinityAttractor1 = new Attractor(undefined, 1, 1, 1, 0.5, 1.5);
    const attractor1 = new Attractor(new Complex(1, 0), 1, 3, 6, 4, 2);
    const attractors1 = [attractor1];

    const configuration1 = new Configuration(
      id1,
      name1,
      resolutionScale1,
      coordinatesScale1,
      coordinatesCentre1,
      iterationsCount1,
      epsilon1,
      juliaBound1,
      fractalFunction1,
      juliaHSV1,
      defaultAttractor1,
      infinityAttractor1,
      attractors1
    );

    const id2 = "ID2";
    const name2 = "Name2";
    const resolutionScale2 = 2;
    const coordinatesScale2 = 2;
    const coordinatesCentre2 = new Complex(2, 0);
    const iterationsCount2 = 20;
    const epsilon2 = 0.2;
    const juliaBound2 = 2;
    const fractalFunction2 = new FractalFunction(
      new Polynomial({}),
      new Polynomial({}),
      FunctionTypes.DEFAULT,
      new Complex(2, 0)
    );
    const juliaHSV2 = [2, 2, 2];
    const defaultAttractor2 = new Attractor(undefined, 2, 1, 1, 0.5, 1.5);
    const infinityAttractor2 = new Attractor(undefined, 2, 1, 1, 0.5, 1.5);
    const attractor2 = new Attractor(new Complex(2, 0), 2, 3, 6, 4, 2);
    const attractors2 = [attractor2];

    const configuration2 = new Configuration(
      id2,
      name2,
      resolutionScale2,
      coordinatesScale2,
      coordinatesCentre2,
      iterationsCount2,
      epsilon2,
      juliaBound2,
      fractalFunction2,
      juliaHSV2,
      defaultAttractor2,
      infinityAttractor2,
      attractors2
    );

    configuration1.fillWith(configuration2);

    expect(configuration1).toEqual(
      new Configuration(
        id1,
        name1,
        resolutionScale2,
        coordinatesScale2,
        coordinatesCentre2,
        iterationsCount2,
        epsilon2,
        juliaBound2,
        fractalFunction2,
        juliaHSV2,
        defaultAttractor2,
        infinityAttractor2,
        attractors2
      )
    );
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
    const fractalFunction = new FractalFunction(
      new Polynomial({}),
      new Polynomial({}),
      FunctionTypes.DEFAULT,
      new Complex(1, 0)
    );
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
      new Polynomial({}),
      new Polynomial({}),
      FunctionTypes.NEWTON,
      new Complex(3, 6)
    );
    FractalFunction.getRandomFractalFunction = vi.fn(() => randomFractalFunction);
    RandomUtils.floatBetween = vi.fn((min, max) => (min + max) / 2);
    RandomUtils.integerBetween = vi.fn((min, max) => (min + max) / 2);
    const randomComplex = new Complex(4, 2);
    Complex.getRandomComplex = vi.fn(() => randomComplex);
    const randomAttractor = new Attractor(undefined, 0, 1, 2, 3, 4);
    Attractor.getRandomAttractor = vi.fn(() => randomAttractor);

    const functionTypes = new Set([FunctionTypes.DEFAULT, FunctionTypes.FRACTION]);
    const coefficientTypes = new Set([CoefficientTypes.CIRCLE, CoefficientTypes.CONSTANT]);
    const coefficientsCountMinMax = { min: 0, max: 1 };
    const complexModulusMinMax = { min: 1, max: 2 };
    const circleCentreModulusMinMax = { min: 2, max: 3 };
    const radiusMinMax = { min: 3, max: 4 };
    const circleDurationMinMax = { min: 4, max: 5 };
    const startEndModulusMinMax = { min: 5, max: 6 };
    const lineDurationMinMax = { min: 6, max: 7 };
    const ellipseCentreModulusMinMax = { min: 7, max: 8 };
    const halfWidthMinMax = { min: 8, max: 9 };
    const halfHeightMinMax = { min: 9, max: 10 };
    const rotationAngleMinMax = { min: 10, max: 11 };
    const ellipseDurationMinMax = { min: 11, max: 12 };
    const juliaHueMinMax = { min: 12, max: 13 };
    const juliaSaturationMinMax = { min: 13, max: 14 };
    const juliaValueMinMax = { min: 14, max: 15 };
    const attractorsHueMinMax = { min: 15, max: 16 };
    const attractorsSaturationStrengthMinMax = { min: 16, max: 17 };
    const attractorsSaturationOffsetMinMax = { min: 17, max: 18 };
    const attractorsValueStrengthMinMax = { min: 18, max: 19 };
    const attractorsValueOffsetMinMax = { min: 19, max: 20 };
    const viewportScaleMinMax = { min: 20, max: 21 };
    const viewportCentreModulusMinMax = { min: 21, max: 22 };
    const iterationsCountMinMax = { min: 22, max: 23 };
    const epsilonMinMax = { min: 23, max: 24 };
    const juliaBoundMinMax = { min: 24, max: 25 };

    configuration.randomize(
      functionTypes,
      coefficientTypes,
      coefficientsCountMinMax,
      complexModulusMinMax,
      circleCentreModulusMinMax,
      radiusMinMax,
      circleDurationMinMax,
      startEndModulusMinMax,
      lineDurationMinMax,
      ellipseCentreModulusMinMax,
      halfWidthMinMax,
      halfHeightMinMax,
      rotationAngleMinMax,
      ellipseDurationMinMax,
      juliaHueMinMax,
      juliaSaturationMinMax,
      juliaValueMinMax,
      attractorsHueMinMax,
      attractorsSaturationStrengthMinMax,
      attractorsSaturationOffsetMinMax,
      attractorsValueStrengthMinMax,
      attractorsValueOffsetMinMax,
      viewportScaleMinMax,
      viewportCentreModulusMinMax,
      iterationsCountMinMax,
      epsilonMinMax,
      juliaBoundMinMax
    );

    expect(FractalFunction.getRandomFractalFunction).toHaveBeenCalledWith(
      functionTypes,
      coefficientTypes,
      coefficientsCountMinMax,
      complexModulusMinMax,
      circleCentreModulusMinMax,
      radiusMinMax,
      circleDurationMinMax,
      startEndModulusMinMax,
      lineDurationMinMax,
      ellipseCentreModulusMinMax,
      halfWidthMinMax,
      halfHeightMinMax,
      rotationAngleMinMax,
      ellipseDurationMinMax
    );
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(
      viewportScaleMinMax.min,
      viewportScaleMinMax.max
    );
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(epsilonMinMax.min, epsilonMinMax.max);
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(
      juliaBoundMinMax.min,
      juliaBoundMinMax.max
    );
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(
      juliaSaturationMinMax.min,
      juliaSaturationMinMax.max
    );
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(
      juliaValueMinMax.min,
      juliaValueMinMax.max
    );
    expect(Complex.getRandomComplex).toHaveBeenCalledWith(viewportCentreModulusMinMax);
    expect(RandomUtils.integerBetween).toHaveBeenCalledWith(
      iterationsCountMinMax.min,
      iterationsCountMinMax.max
    );
    expect(RandomUtils.integerBetween).toHaveBeenCalledWith(juliaHueMinMax.min, juliaHueMinMax.max);
    expect(Attractor.getRandomAttractor).toHaveBeenCalledWith(
      attractorsHueMinMax,
      attractorsSaturationStrengthMinMax,
      attractorsSaturationOffsetMinMax,
      attractorsValueStrengthMinMax,
      attractorsValueOffsetMinMax
    );
    expect(Attractor.getRandomAttractor).toBeCalledTimes(2);

    expect(configuration).toEqual(
      new Configuration(
        id,
        name,
        resolutionScale,
        (viewportScaleMinMax.min + viewportScaleMinMax.max) / 2,
        randomComplex,
        (iterationsCountMinMax.min + iterationsCountMinMax.max) / 2,
        (epsilonMinMax.min + epsilonMinMax.max) / 2,
        (juliaBoundMinMax.min + juliaBoundMinMax.max) / 2,
        randomFractalFunction,
        [
          (juliaHueMinMax.min + juliaHueMinMax.max) / 2,
          (juliaSaturationMinMax.min + juliaSaturationMinMax.max) / 2,
          (juliaValueMinMax.min + juliaValueMinMax.max) / 2,
        ],
        randomAttractor,
        randomAttractor,
        []
      )
    );
  });
});

describe("toString", () => {
  it("properly returns a string representation of the configuration", () => {
    expect(
      new Configuration(
        "ID",
        "Name",
        1,
        1,
        new Complex(1, 0),
        10,
        0.1,
        1,
        new FractalFunction(
          new Polynomial({}),
          new Polynomial({}),
          FunctionTypes.DEFAULT,
          new Complex(1, 0)
        ),
        [1, 1, 1],
        new Attractor(undefined, 1, 1, 1, 0.5, 1.5),
        new Attractor(undefined, 2, 2, 2, 1, 3),
        []
      ).toString()
    ).toBe(
      "Configuration(ID, Name, 1, 1, 1, 10, 0.1, 1, FractalFunction(Polynomial(0), Polynomial(0), DEFAULT, 1), [1, 1, 1], Attractor(undefined, 1, 1, 1, 0.5, 1.5), Attractor(undefined, 2, 2, 2, 1, 3), [])"
    );
  });
});
