#version 300 es
precision highp float;

// CONSTANTS

const float PI = 3.1415926538;
const float ZERO = 0.00000000001;
const float INFINITY = 10000000000.0;


// INPUT AND OUTPUT

in vec2 coordinates;

out vec4 fragColor;


// UNIFORMS

uniform int nbIterations;
uniform float epsilon;
uniform float juliaBound;
uniform int numeratorNbCoefficients;
uniform vec3 numeratorCoefficients[16];
uniform int denominatorNbCoefficients;
uniform vec3 denominatorCoefficients[16];
uniform vec3 juliaHSV;
uniform float defaultHue;
uniform vec4 defaultColorParameters;
uniform float infinityHue;
uniform vec4 infinityColorParameters;
uniform int nbAttractors;
uniform vec2 attractors[16];
uniform float attractorsHue[16];
uniform vec4 attractorsColorParameters[16];


// UTILS

bool isZero(float x) {
  return abs(x) <= ZERO;
}

bool isInfinity(float x) {
  return abs(x) >= INFINITY;
}


// COMPLEX OPERATIONS

float complexMod(vec2 z) {
  return length(z);
}

float complexArg(vec2 z) {
  return atan(z.y, z.x);
}

bool isComplexZero(vec2 z) {
  return complexMod(z) <= ZERO;
}

bool isComplexInfinity(vec2 z) {
  return complexMod(z) >= INFINITY;
}

vec2 complexMultiplication(vec2 z1, vec2 z2) {
  return vec2(z1.x * z2.x - z1.y * z2.y, z1.x * z2.y + z1.y * z2.x);
}

vec2 complexInverse(vec2 z) {
  return vec2(z.x, -z.y) / dot(z, z);
}

vec2 complexPowerAndMultiplication(vec2 z, float power, vec2 factor) {
  float modpz = pow(complexMod(z), power) * factor.x;
  if (modpz > INFINITY) {
    return vec2(INFINITY);
  }
  float argpz = power * complexArg(z) + factor.y;
  return vec2(modpz * cos(argpz), modpz * sin(argpz));
}

float complexDistance(vec2 z1, vec2 z2) {
  return length(z1 - z2);
}


// ITERATION METHODS

vec2 applyFunction(vec2 z) {
  if (isComplexInfinity(z)) {
    return z;
  }
  vec2 numerator = vec2(0.0);
  vec2 denominator = vec2(0.0);
  for (int c = 0; c < numeratorNbCoefficients; ++c) {
    numerator += complexPowerAndMultiplication(z, numeratorCoefficients[c].z, numeratorCoefficients[c].xy);
  }
  for (int c = 0; c < denominatorNbCoefficients; ++c) {
    denominator += complexPowerAndMultiplication(z, denominatorCoefficients[c].z, denominatorCoefficients[c].xy);
  }
  return complexMultiplication(numerator, complexInverse(denominator));
}

float riemannSpheredistance(vec2 z, vec2 w) {
  float zMod = complexMod(z);
  float wMod = complexMod(w);
  vec2 zw_ = vec2(z.x * w.x + z.y * w.y, z.y * w.x - w.y * z.x);
  float d = 2.0 * atan(complexMod(zw_ - vec2(wMod * wMod, 0.0)) / (complexMod(zw_ + vec2(1.0, 0.0)) * wMod));
  return mix(d, 0.0, wMod < ZERO || wMod > INFINITY || zMod > INFINITY);
}


// COLOR OPERATIONS

vec3 getColor(float adjustedDivergence, float hue, vec4 colorParameters) {
  float saturation = pow(colorParameters.x * -adjustedDivergence + colorParameters.y, 0.2);
  float xValue = colorParameters.z * adjustedDivergence + colorParameters.w;
  float value = 0.5 * (xValue / sqrt(1.0 + xValue * xValue) + 1.0);
  return vec3(hue, saturation, value);
}

vec3 colorAccordingToSet(float adjustedDivergence, vec2 fkz) {
  // If it belongs to the Julia Set, return the Julia color
  if (adjustedDivergence > 0.0) {
    return juliaHSV;
  }

  // If it belongs to the Fatou set, color according to attractor
  for (int a = 0; a < nbAttractors; ++a) {
    if (complexDistance(attractors[a], fkz) < 0.001) {
      return getColor(adjustedDivergence, attractorsHue[a], attractorsColorParameters[a]);
    }
  }

  // If it converges to infinity, color using infinity coloring
  if (isComplexInfinity(fkz)) {
    return getColor(adjustedDivergence, infinityHue, infinityColorParameters);
  }

  // If no attractor matches the point, color using default coloring
  return getColor(adjustedDivergence, defaultHue, defaultColorParameters);
}

vec3 hsvToRgb(vec3 hsv) {
  return hsv.z * mix(vec3(1.0), clamp(abs(mod(hsv.x / 60.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0), hsv.y);
}


// MAIN

void main() {
  // Compute how close from an attractor the current point is 
  // by checking if nearby pixels tend to get closer
  vec2 fkz = coordinates;
  vec2 fkzeps = coordinates + epsilon;
  float divergence = 0.0;
  for (int k = 0; k < nbIterations; ++k) {
    fkz = applyFunction(fkz);
    fkzeps = applyFunction(fkzeps);
    divergence += riemannSpheredistance(fkz, fkzeps);
  }

  // Color according to the divergence of close points and convert to RGB
  fragColor = vec4(hsvToRgb(colorAccordingToSet(log(divergence) - juliaBound, fkz)), 1.0);
}