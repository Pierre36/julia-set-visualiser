import { Complex } from "./models/Complex";
import { Polynomial } from "./models/Polynomial";

/**
 * Reads the animation parameters and builds the numerator and denominator of the function.
 * @param {Object} parameters The parameters of the animation.
 * @param {Number} time The animation time in milliseconds.
 * @returns The function parameters in terms of numerator and denominator.
 */
function getFunctionParameters(parameters, time) {
  // Gets the polynomial at the time
  const polynomial = parameters.polynomial.getAtTime(time);

  // Initialize the return values
  var numeratorDegree = polynomial.degree;
  var numeratorCoefficients;
  var denominatorDegree;
  var denominatorCoefficients;

  // Depending on the function type, computes the numerator and denominator
  if (parameters.functionType == "DEFAULT") {
    numeratorCoefficients = polynomial.toFloat32Array();
    denominatorDegree = 1;
    denominatorCoefficients = new Polynomial({
      0: new Complex(1, 0),
    }).toFloat32Array();
  } else if (parameters.functionType == "NEWTON") {
    const derivative = polynomial.getDerivative();
    numeratorCoefficients = polynomial.getNewtonNumerator().toFloat32Array();
    denominatorDegree = derivative.degree;
    denominatorCoefficients = derivative.toFloat32Array();
  } else {
    throw new Error(
      `The function type is incorrect. It must be either "DEFAULT" or "NEWTON", but received ${parameters.functionType}`
    );
  }

  return [numeratorDegree, numeratorCoefficients, denominatorDegree, denominatorCoefficients];
}

function getAttractorParameters(parameters) {
  const attractors = parameters.attractors;
  const attractorsComplex = [];
  const attractorsHue = [];
  const attractorsColorParameters = [];
  for (let a = 0; a < 16; a++) {
    const attractor = attractors[a];
    if (attractor != undefined) {
      attractorsComplex.push(attractor.complex.re, attractor.complex.im);
      attractorsHue.push(attractor.hue);
      attractorsColorParameters.push(
        attractor.saturationStrength,
        attractor.saturationOffset,
        attractor.valueStrength,
        attractor.valueOffset
      );
    } else {
      attractorsComplex.push(0, 0);
      attractorsHue.push(0);
      attractorsColorParameters.push(0, 0, 0, 0);
    }
  }
  return [
    attractors.length,
    new Float32Array(attractorsComplex),
    new Float32Array(attractorsHue),
    new Float32Array(attractorsColorParameters),
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
    throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
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
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, shaderSources.fragment);

  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // Check for compilation or linking errors
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`
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
    coordinatesScale: gl.getUniformLocation(shaderProgram, "coordinatesScale"),
    time: gl.getUniformLocation(shaderProgram, "time"),
    numeratorDegree: gl.getUniformLocation(shaderProgram, "numeratorDegree"),
    numeratorCoefficients: gl.getUniformLocation(shaderProgram, "numeratorCoefficients"),
    denominatorDegree: gl.getUniformLocation(shaderProgram, "denominatorDegree"),
    denominatorCoefficients: gl.getUniformLocation(shaderProgram, "denominatorCoefficients"),
    juliaHSV: gl.getUniformLocation(shaderProgram, "juliaHSV"),
    defaultHue: gl.getUniformLocation(shaderProgram, "defaultHue"),
    defaultColorParameters: gl.getUniformLocation(shaderProgram, "defaultColorParameters"),
    infinityHue: gl.getUniformLocation(shaderProgram, "infinityHue"),
    infinityColorParameters: gl.getUniformLocation(shaderProgram, "infinityColorParameters"),
    nbAttractors: gl.getUniformLocation(shaderProgram, "nbAttractors"),
    attractors: gl.getUniformLocation(shaderProgram, "attractors"),
    attractorsHue: gl.getUniformLocation(shaderProgram, "attractorsHue"),
    attractorsColorParameters: gl.getUniformLocation(shaderProgram, "attractorsColorParameters"),
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
  const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
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
  gl.uniform1f(uniformLocations.coordinatesScale, parameters.coordinatesScale);
  gl.uniform1f(uniformLocations.resolution, canvas.clientWidth / canvas.clientHeight);
  const [numeratorDegree, numeratorCoefficients, denominatorDegree, denominatorCoefficients] =
    getFunctionParameters(parameters, time);
  gl.uniform1i(uniformLocations.numeratorDegree, numeratorDegree);
  gl.uniform2fv(uniformLocations.numeratorCoefficients, numeratorCoefficients);
  gl.uniform1i(uniformLocations.denominatorDegree, denominatorDegree);
  gl.uniform2fv(uniformLocations.denominatorCoefficients, denominatorCoefficients);
  gl.uniform3fv(uniformLocations.juliaHSV, parameters.juliaHSV);
  gl.uniform1f(uniformLocations.defaultHue, parameters.defaultAttractor.hue);
  gl.uniform4fv(
    uniformLocations.defaultColorParameters,
    new Float32Array([
      parameters.defaultAttractor.saturationStrength,
      parameters.defaultAttractor.saturationOffset,
      parameters.defaultAttractor.valueStrength,
      parameters.defaultAttractor.valueOffset,
    ])
  );
  gl.uniform1f(uniformLocations.infinityHue, parameters.infinityAttractor.hue);
  gl.uniform4fv(
    uniformLocations.infinityColorParameters,
    new Float32Array([
      parameters.infinityAttractor.saturationStrength,
      parameters.infinityAttractor.saturationOffset,
      parameters.infinityAttractor.valueStrength,
      parameters.infinityAttractor.valueOffset,
    ])
  );
  const [nbAttractors, attractorsComplex, attractorsHue, attractorsColorParameters] =
    getAttractorParameters(parameters);
  gl.uniform1i(uniformLocations.nbAttractors, nbAttractors);
  gl.uniform2fv(uniformLocations.attractors, attractorsComplex);
  gl.uniform1fv(uniformLocations.attractorsHue, attractorsHue);
  gl.uniform4fv(uniformLocations.attractorsColorParameters, attractorsColorParameters);
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
      render(gl, uniformLocations, parameters, canvas, newTime, delay + newTime - time)
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
  requestAnimationFrame((time) => render(gl, uniformLocations, parameters, canvas, time, 0));
}

export { displayScene };
