#version 300 es
precision highp float;

// CONSTANTS

#define PI 3.1415926538
#define ZERO 0.00000000001
#define INFINITY 10000000000.0


// INPUT AND OUTPUT

in vec2 coordinates;

out vec4 fragColor;


// UNIFORMS

uniform int numeratorDegree;
uniform vec2 numeratorCoefficients[16];
uniform int denominatorDegree;
uniform vec2 denominatorCoefficients[16];
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
  if (isComplexZero(z)) {
    return vec2(INFINITY, INFINITY);
  }
  return vec2(z.x, -z.y) / (z.x * z.x + z.y * z.y);
}

vec2 complexDivision(vec2 z1, vec2 z2) {
  return complexMultiplication(z1, complexInverse(z2));
}

vec2 complexPower(vec2 z, int p) {
  if (p == 0) {
    return vec2(1.0, 0.0);
  } else if (p == 1) {
    return z;
  } else {
    vec2 result = z;
    for (int n = 1; n < p; n++) {
      if (length(result) >= INFINITY) {
        return result;
      } else {
        result = complexMultiplication(result, z);
      }
    }
    return result;
  }
}

float complexDistance(vec2 z1, vec2 z2) {
  return length(z1 - z2);
}


// ITERATION METHODS

vec2 applyFunction(vec2 z) {
  if (isComplexInfinity(z)) {
    return z;
  }
  




  vec2 numerator = numeratorCoefficients[0] + 14.0 * complexPower(z, 15);
  // vec2 denominator = denominatorCoefficients[0];
  vec2 denominator = 15.0 * complexPower(z, 14);




  // for (int p = 1; p <= numeratorDegree; ++p) {
  //   if (!isComplexZero(numeratorCoefficients[p])) {
  //     numerator = numerator + complexMultiplication(numeratorCoefficients[p], complexPower(z, p));
  //   }
  // }
  // for (int p = 1; p <= denominatorDegree; ++p) {
  //   if (!isComplexZero(denominatorCoefficients[p])) {
  //     denominator = denominator + complexMultiplication(denominatorCoefficients[p], complexPower(z, p));
  //   }
  // }
  return complexDivision(numerator, denominator);
}

float riemannSpheredistance(vec2 z, vec2 w) {
  float t;
  float zMod = complexMod(z);
  float wMod = complexMod(w);
  if (wMod < ZERO) {
    t = zMod;
  } else if (wMod > INFINITY) {
    t = 1.0 / zMod;
  } else if (zMod > INFINITY) {
    t = 0.0;
  } else {
    vec2 zw_ = vec2(z.x * w.x + z.y * w.y, z.y * w.x - w.y * z.x);
    t = complexMod(zw_ - vec2(wMod * wMod, 0)) / (complexMod(zw_ + vec2(1.0, 0)) * wMod);
  }
  return 2.0 * atan(t);
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

  // If no attractor match the point, color using default coloring
  return getColor(adjustedDivergence, defaultHue, defaultColorParameters);
}

vec3 hsvToRgb(vec3 hsv) {
  float hMod360 = mod(hsv.x, 360.0);
  int hSixth = int(mod(floor(hMod360 / 60.0), 6.0));
  float f = hMod360 / 60.0 - float(hSixth);
  float l = hsv.z * (1.0 - hsv.y);
  float m = hsv.z * (1.0 - f * hsv.y);
  float n = hsv.z * (1.0 - (1.0 - f) * hsv.y);
  if (hSixth == 0) {
    return vec3(hsv.z, n, l);
  } else if (hSixth == 1) {
    return vec3(m, hsv.z, l);
  } else if (hSixth == 2) {
    return vec3(l, hsv.z, n);
  } else if (hSixth == 3) {
    return vec3(l, m, hsv.z);
  } else if (hSixth == 4) {
    return vec3(n, l, hsv.z);
  } else if (hSixth == 5) {
    return vec3(hsv.z, l, m);
  }
  return vec3(0.0, 0.0, 0.0);
}


// MAIN

void main() {

  // Parameters
  int nbIteration = 20;
  float epsilon = 0.00001;
  float juliaBound = -4.0;

  // Compute how close from an attractor the current point is 
  // by checking if nearby pixels tend to get closer
  vec2 fkz = coordinates;
  vec2 fkzeps = coordinates + vec2(epsilon, epsilon);
  float divergence = 0.0;
  for (int k; k < nbIteration; ++k) {
    fkz = applyFunction(fkz);
    fkzeps = applyFunction(fkzeps);
    divergence += riemannSpheredistance(fkz, fkzeps);
  }

  // Color according to the divergence of close points and convert to RGB
  float adjustedDivergence = log(divergence) - juliaBound;
  fragColor = vec4(hsvToRgb(colorAccordingToSet(adjustedDivergence, fkz)), 1.0);
}