/**
 * Load WebGL2 from the provided canvas.
 * @param {Canvas} canvas The canvas.
 * @returns {WebGL2RenderingContext} The webGL2 rendering context.
 * @throws An exception if it is unable to load WebGL2.
 */
function loadWebGL(canvas) {
  const gl = canvas.getContext("webgl2");
  if (gl === null) {
    throw new Error('Unable to initialize WebGL. Your browser or machine may not support it.');
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
    throw new Error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
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
    const error = new Error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]), gl.STATIC_DRAW);
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
  gl.uniform1f(uniformLocations.resolution, canvas.clientWidth / canvas.clientHeight);
}


/**
 * Render the current frame.
 * @param {WebGL2RenderingContext} gl The WebGL rendering context.
 * @param {Object} uniformLocations The location of the uniforms.
 * @param {Object} parameters The parameters of the animation.
 * @param {Object} canvas The canvas of the animation.
 * @param {Number} time The animation time in milliseconds.
 */
function render(gl, uniformLocations, parameters, canvas, time) {

  // Set uniforms
  setUniformValues(gl, uniformLocations, parameters, canvas, time)

  // Draw the scene
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // Render next frame
  requestAnimationFrame(time => render(gl, uniformLocations, parameters, canvas, time));
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
  const uniformLocations = getUniformLocations(gl, shaderProgram);
  createViewport(gl, canvas, parameters);
  setPositionAttributes(gl, shaderProgram);
  gl.useProgram(shaderProgram);
  requestAnimationFrame(time => render(gl, uniformLocations, parameters, canvas, time));
}

export { displayScene }