import { Complex } from "./models/Complex";
import { ComplexCircle } from "./models/ComplexCircle";
import { ComplexLine } from "./models/ComplexLine";

const MAX_DEGREE = 15;

/**
 * Converts an object representing a polynomial to an array.
 * @param {Object} polynomial The polynomial to convert.
 * @param {Number} time The animation time in milliseconds.
 * @returns {Array} The polynomial converted into an array of complex numbers.
 */
function polynomialObjectToArray(polynomial, time) {
  const polynomialArray = [];
  for (let [degree, coefficient] of Object.entries(polynomial)) {
    if (coefficient instanceof Complex) {
      polynomialArray[degree] = coefficient.copy();
    } else if (
      coefficient instanceof ComplexCircle ||
      coefficient instanceof ComplexLine
    ) {
      polynomialArray[degree] = coefficient.getAtTime(time);
    }
  }
  return polynomialArray;
}

/**
 * Derivates a polynomial.
 * @param {Array} polynomial The polynomial to derivate.
 * @returns {Array} The derivated polynomial.
 */
function derivate(polynomial) {
  const derivative = [];
  for (let p = 1; p < polynomial.length; p++) {
    let complex = polynomial[p];
    if (complex) {
      derivative[p - 1] = new Complex(complex.re * p, complex.im * p);
    }
  }
  return derivative;
}

/**
 * Computes the Newton numerator of a polynomial.
 * @param {Array} polynomial The polynomial for which the Newton numerator is computed.
 * @returns {Array} The Newton numerator.
 */
function getNewtonNumerator(polynomial) {
  const numerator = [];
  for (let p = 0; p < polynomial.length; p++) {
    let complex = polynomial[p];
    if (complex) {
      numerator[p] = new Complex((p - 1) * complex.re, (p - 1) * complex.im);
    }
  }
  return numerator;
}

/**
 * Convert an array of complex numbers in classical notation into a flattened
 * array of complex number in Euler's notation.
 * @param {Array} complexArray The array of complex number in classical notation.
 * @returns {Array} The flattened array of complex number in Euler's notation.
 */
function complexArrayToFloat32Array(complexArray) {
  const flattenedArray = [];
  for (let p = 0; p <= MAX_DEGREE; p++) {
    let complex = complexArray[p];
    if (complex) {
      flattenedArray.push(complex.mod(), complex.arg());
    } else {
      flattenedArray.push(0, 0);
    }
  }
  return new Float32Array(flattenedArray);
}

/**
 * Reads the animation parameters and builds the numerator and denominator of the function.
 * @param {Object} parameters The parameters of the animation.
 * @param {Number} time The animation time in milliseconds.
 * @returns The function parameters in terms of numerator and denominator.
 */
function getFunctionParameters(parameters, time) {
  // Converts the polynomial into an array
  const polynomialArray = polynomialObjectToArray(parameters.polynomial, time);
  const polynomialDegree = polynomialArray.length - 1;

  // Initialize the return values
  var numeratorDegree;
  var numeratorCoefficients;
  var denominatorDegree;
  var denominatorCoefficients;

  // Depending on the function type, computes the numerator and denominator
  if (parameters.functionType == "DEFAULT") {
    numeratorDegree = polynomialDegree;
    numeratorCoefficients = complexArrayToFloat32Array(polynomialArray);
    denominatorDegree = 1;
    denominatorCoefficients = complexArrayToFloat32Array([new Complex(1, 0)]);
  } else if (parameters.functionType == "NEWTON") {
    const derivative = derivate(polynomialArray);
    numeratorDegree = polynomialDegree;
    numeratorCoefficients = complexArrayToFloat32Array(
      getNewtonNumerator(polynomialArray)
    );
    denominatorDegree = derivative.length - 1;
    denominatorCoefficients = complexArrayToFloat32Array(derivative);
  } else {
    throw new Error(
      `The function type is incorrect. It must be either "DEFAULT" or "NEWTON", but received ${parameters.functionType}`
    );
  }

  return [
    numeratorDegree,
    numeratorCoefficients,
    denominatorDegree,
    denominatorCoefficients,
  ];
}

/**
 * Load WebGL2 from the provided canvas.
 * @param {Canvas} canvas The canvas.
 * @returns {WebGL2RenderingContext} The webGL2 rendering context.
 * @throws An exception if it is unable to load WebGL2.
 */
function loadWebGL(canvas) {
  const gl = canvas.getContext("webgl2");
  if (gl === null) {
    throw new Error(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
  }
  return gl;
}

/**
 * Initializes the shader program with the provided shader sources.
 * @param {WebGL2RenderingContext} gl The WebGL rendering context.
 * @param {Object} shaderSources The sources of the vertex and fragment shaders.
 * @returns {WebGLProgram} The shader program.
 * @throws An exception if it is unable to create the program.
 */
function initShaderProgram(gl, shaderSources) {
  // Load the shaders
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, shaderSources.vertex);
  const fragmentShader = loadShader(
    gl,
    gl.FRAGMENT_SHADER,
    shaderSources.fragment
  );

  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // Check for compilation or linking errors
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
  }

  return shaderProgram;
}

/**
 * Load a shader from its source.
 * @param {WebGL2RenderingContext} gl The WebGL rendering context.
 * @param {Number} type The type of shader.
 * @param {String} source The shader program.
 * @returns {WebGLShader} The shader.
 * @throws An exception if it is unable to compile the shader.
 */
function loadShader(gl, type, source) {
  // Load the source in a shader
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // Check for compilation errors
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = new Error(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    throw error;
  }

  return shader;
}

/**
 * Get the uniform locations in the shader program.
 * @param {WebGL2RenderingContext} gl The WebGL rendering context.
 * @param {WebGLProgram} shaderProgram The shader program.
 * @returns {Object} An object containing the location of each uniform.
 */
function getUniformLocations(gl, shaderProgram) {
  return {
    resolution: gl.getUniformLocation(shaderProgram, "resolution"),
    time: gl.getUniformLocation(shaderProgram, "time"),
    numeratorDegree: gl.getUniformLocation(shaderProgram, "numeratorDegree"),
    numeratorCoefficients: gl.getUniformLocation(
      shaderProgram,
      "numeratorCoefficients"
    ),
    denominatorDegree: gl.getUniformLocation(
      shaderProgram,
      "denominatorDegree"
    ),
    denominatorCoefficients: gl.getUniformLocation(
      shaderProgram,
      "denominatorCoefficients"
    ),
  };
}

/**
 * Initialize the viewport for the animation.
 * @param {WebGL2RenderingContext} gl The WebGL rendering context.
 * @param {Object} canvas The canvas of the animation.
 * @param {Object} parameters The parameters of the animation.
 */
function createViewport(gl, canvas, parameters) {
  canvas.width = canvas.clientWidth * parameters.resolutionScale;
  canvas.height = canvas.clientHeight * parameters.resolutionScale;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

/**
 * Set the position attributes in the shader program.
 * @param {WebGL2RenderingContext} gl The WebGL rendering context.
 * @param {WebGLProgram} shaderProgram The shader program.
 */
function setPositionAttributes(gl, shaderProgram) {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]),
    gl.STATIC_DRAW
  );
  const vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    "vertexPosition"
  );
  gl.vertexAttribPointer(vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPositionAttribute);
}

/**
 * Sets the values of the uniforms.
 * @param {WebGL2RenderingContext} gl The WebGL rendering context.
 * @param {Object} uniformLocations The location of the uniforms.
 * @param {Object} parameters The parameters of the animation.
 * @param {Object} canvas The canvas of the animation.
 * @param {Number} time The animation time in milliseconds.
 */
function setUniformValues(gl, uniformLocations, parameters, canvas, time) {
  gl.uniform1f(uniformLocations.time, time / 1000);
  gl.uniform1f(
    uniformLocations.resolution,
    canvas.clientWidth / canvas.clientHeight
  );
  const [
    numeratorDegree,
    numeratorCoefficients,
    denominatorDegree,
    denominatorCoefficients,
  ] = getFunctionParameters(parameters, time);
  gl.uniform1i(uniformLocations.numeratorDegree, numeratorDegree);
  gl.uniform2fv(uniformLocations.numeratorCoefficients, numeratorCoefficients);
  gl.uniform1i(uniformLocations.denominatorDegree, denominatorDegree);
  gl.uniform2fv(
    uniformLocations.denominatorCoefficients,
    denominatorCoefficients
  );
}

/**
 * Render the current frame.
 * @param {WebGL2RenderingContext} gl The WebGL rendering context.
 * @param {Object} uniformLocations The location of the uniforms.
 * @param {Object} parameters The parameters of the animation.
 * @param {Object} canvas The canvas of the animation.
 * @param {Number} time The animation time in milliseconds.
 */
function render(gl, uniformLocations, parameters, canvas, time, delay) {
  // Set uniforms
  setUniformValues(gl, uniformLocations, parameters, canvas, time - delay);

  // Draw the scene
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // Render next frame
  if (parameters.paused) {
    requestAnimationFrame((newTime) =>
      render(
        gl,
        uniformLocations,
        parameters,
        canvas,
        newTime,
        delay + newTime - time
      )
    );
  } else {
    requestAnimationFrame((newTime) =>
      render(gl, uniformLocations, parameters, canvas, newTime, delay)
    );
  }
}

/**
 * Display a scene in the provided canvas using WebGL2 with the provided shader sources and parameters.
 * @param {Object} canvas The canvas of the animation.
 * @param {Object} shaderSources The sources of the vertex and fragment shaders.
 * @param {Object} parameters The parameters of the animation.
 */
function displayScene(canvas, shaderSources, parameters) {
  const gl = loadWebGL(canvas);
  const shaderProgram = initShaderProgram(gl, shaderSources);
  createViewport(gl, canvas, parameters);
  setPositionAttributes(gl, shaderProgram);
  gl.useProgram(shaderProgram);
  const uniformLocations = getUniformLocations(gl, shaderProgram);
  requestAnimationFrame((time) =>
    render(gl, uniformLocations, parameters, canvas, time, 0)
  );
}

export { displayScene };
