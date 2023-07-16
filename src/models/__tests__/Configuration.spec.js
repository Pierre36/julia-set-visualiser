import { describe, it, expect } from "vitest";

import { Configuration } from "../Configuration";
import { Complex } from "../Complex";
import { FractalFunction } from "../FractalFunction";
import { Polynomial } from "../Polynomial";
import { Attractor } from "../Attractor";

describe("constructor", () => {
  it("properly constructs", () => {
    const id = "ID";
    const name = "Name";
    const resolutionScale = 1;
    const coordinatesScale = 1;
    const coordinatesCenter = new Complex(0, 0);
    const nbIterations = 10;
    const epsilon = 0.1;
    const juliaBound = -4;
    const fractalFunction = new FractalFunction(
      new Polynomial(),
      new Polynomial(),
      "DEFAULT",
      new Complex(0, 0)
    );
    const juliaHSV = [0, 0, 0];
    const defaultAttractor = new Attractor(null, 210, 1, 1, 0.5, 1.5);
    const infinityAttractor = new Attractor(null, 80, 1, 1, 0.5, 1.5);
    const attractors = [];

    const configuration = new Configuration(
      id,
      name,
      resolutionScale,
      coordinatesScale,
      coordinatesCenter,
      nbIterations,
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
    expect(configuration.coordinatesCenter).toBe(coordinatesCenter);
    expect(configuration.nbIterations).toBe(nbIterations);
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
    const coordinatesCenter = new Complex(0, 0);
    const nbIterations = 10;
    const epsilon = 0.1;
    const juliaBound = -4;
    const fractalFunction = new FractalFunction(
      new Polynomial(),
      new Polynomial(),
      "DEFAULT",
      new Complex(0, 0)
    );
    const juliaHSV = [0, 0, 0];
    const defaultAttractor = new Attractor(null, 210, 1, 1, 0.5, 1.5);
    const infinityAttractor = new Attractor(null, 80, 1, 1, 0.5, 1.5);
    const attractor = new Attractor(new Complex(1, 0), 50, 3, 6, 4, 2);
    const attractors = [attractor];

    const configuration = Configuration.fromJSON({
      id: id,
      name: name,
      resolutionScale: resolutionScale,
      coordinatesScale: coordinatesScale,
      coordinatesCenter: coordinatesCenter.toJSON(),
      nbIterations: nbIterations,
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
        coordinatesCenter,
        nbIterations,
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
    const coordinatesCenter = new Complex(0, 0);
    const nbIterations = 10;
    const epsilon = 0.1;
    const juliaBound = -4;
    const fractalFunction = new FractalFunction(
      new Polynomial(),
      new Polynomial(),
      "DEFAULT",
      new Complex(0, 0)
    );
    const juliaHSV = [0, 0, 0];
    const defaultAttractor = new Attractor(null, 210, 1, 1, 0.5, 1.5);
    const infinityAttractor = new Attractor(null, 80, 1, 1, 0.5, 1.5);
    const attractor = new Attractor(new Complex(1, 0), 50, 3, 6, 4, 2);
    const attractors = [attractor];

    const json = new Configuration(
      id,
      name,
      resolutionScale,
      coordinatesScale,
      coordinatesCenter,
      nbIterations,
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
      coordinatesCenter: coordinatesCenter.toJSON(),
      nbIterations: nbIterations,
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
        "DEFAULT",
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
          "DEFAULT",
          new Complex(1, 0)
        ),
        [0, 0, 1],
        new Attractor(null, 210.0, 0.11, 0.0, 0.26, 1.4),
        new Attractor(null, 210.0, 0.11, 0.0, 0.26, 1.4),
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
          new Polynomial(),
          new Polynomial({ 0: new Complex(1, 0) }),
          "DEFAULT",
          new Complex(1, 0)
        ),
        [0, 0, 0],
        new Attractor(null, 0, 0, 0, 0, 0),
        new Attractor(null, 0, 0, 0, 0, 0),
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
    const coordinatesCenter1 = new Complex(1, 0);
    const nbIterations1 = 10;
    const epsilon1 = 0.1;
    const juliaBound1 = 1;
    const fractalFunction1 = new FractalFunction(
      new Polynomial(),
      new Polynomial(),
      "DEFAULT",
      new Complex(1, 0)
    );
    const juliaHSV1 = [1, 1, 1];
    const defaultAttractor1 = new Attractor(null, 1, 1, 1, 0.5, 1.5);
    const infinityAttractor1 = new Attractor(null, 1, 1, 1, 0.5, 1.5);
    const attractor1 = new Attractor(new Complex(1, 0), 1, 3, 6, 4, 2);
    const attractors1 = [attractor1];

    const configuration1 = new Configuration(
      id1,
      name1,
      resolutionScale1,
      coordinatesScale1,
      coordinatesCenter1,
      nbIterations1,
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
    const coordinatesCenter2 = new Complex(2, 0);
    const nbIterations2 = 20;
    const epsilon2 = 0.2;
    const juliaBound2 = 2;
    const fractalFunction2 = new FractalFunction(
      new Polynomial(),
      new Polynomial(),
      "DEFAULT",
      new Complex(2, 0)
    );
    const juliaHSV2 = [2, 2, 2];
    const defaultAttractor2 = new Attractor(null, 2, 1, 1, 0.5, 1.5);
    const infinityAttractor2 = new Attractor(null, 2, 1, 1, 0.5, 1.5);
    const attractor2 = new Attractor(new Complex(2, 0), 2, 3, 6, 4, 2);
    const attractors2 = [attractor2];

    const configuration2 = new Configuration(
      id2,
      name2,
      resolutionScale2,
      coordinatesScale2,
      coordinatesCenter2,
      nbIterations2,
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
    const coordinatesCenter1 = new Complex(1, 0);
    const nbIterations1 = 10;
    const epsilon1 = 0.1;
    const juliaBound1 = 1;
    const fractalFunction1 = new FractalFunction(
      new Polynomial(),
      new Polynomial(),
      "DEFAULT",
      new Complex(1, 0)
    );
    const juliaHSV1 = [1, 1, 1];
    const defaultAttractor1 = new Attractor(null, 1, 1, 1, 0.5, 1.5);
    const infinityAttractor1 = new Attractor(null, 1, 1, 1, 0.5, 1.5);
    const attractor1 = new Attractor(new Complex(1, 0), 1, 3, 6, 4, 2);
    const attractors1 = [attractor1];

    const configuration1 = new Configuration(
      id1,
      name1,
      resolutionScale1,
      coordinatesScale1,
      coordinatesCenter1,
      nbIterations1,
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
    const coordinatesCenter2 = new Complex(2, 0);
    const nbIterations2 = 20;
    const epsilon2 = 0.2;
    const juliaBound2 = 2;
    const fractalFunction2 = new FractalFunction(
      new Polynomial(),
      new Polynomial(),
      "DEFAULT",
      new Complex(2, 0)
    );
    const juliaHSV2 = [2, 2, 2];
    const defaultAttractor2 = new Attractor(null, 2, 1, 1, 0.5, 1.5);
    const infinityAttractor2 = new Attractor(null, 2, 1, 1, 0.5, 1.5);
    const attractor2 = new Attractor(new Complex(2, 0), 2, 3, 6, 4, 2);
    const attractors2 = [attractor2];

    const configuration2 = new Configuration(
      id2,
      name2,
      resolutionScale2,
      coordinatesScale2,
      coordinatesCenter2,
      nbIterations2,
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
        coordinatesCenter2,
        nbIterations2,
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
