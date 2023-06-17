#version 300 es
precision highp float;

#define PI 3.1415926538
#define ZERO 0.000001
#define EPSILON 0.000001
#define INFINITY 1000000.0

in vec2 coordinates;

out vec4 fragColor;

uniform float time;
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


// COMPLEX OPERATIONS

bool isComplexZero(vec2 z) {
  return abs(z.x) <= ZERO;
}

bool isComplexInfinity(vec2 z) {
  return abs(z.x) >= INFINITY;
}

vec2 complexSum(vec2 z1, vec2 z2) {
  vec2 classicNotationResult = vec2(z1.x * cos(z1.y) + z2.x * cos(z2.y), z1.x * sin(z1.y) + z2.x * sin(z2.y));
  return vec2(length(classicNotationResult), atan(classicNotationResult.y, classicNotationResult.x));
}

vec2 complexMultiplication(vec2 z1, vec2 z2) {
  return vec2(z1.x * z2.x, z1.y + z2.y);
}

vec2 complexPower(vec2 z, float p) {
  return vec2(pow(z.x, p), p * z.y);
}

vec2 complexPower(vec2 z, int p) {
  if (p == 0) {
    return vec2(1.0, 0.0);
  } else if (p == 1) {
    return z;
  } else {
    return complexPower(z, float(p));
  }
}

vec2 complexInverse(vec2 z) {
  if (isComplexZero(z)) {
    return vec2(INFINITY, -z.y);
  }
  return vec2(1.0 / z.x, -z.y);
}

float complexDistance(vec2 z1, vec2 z2) {
  return length(vec2(z1.x * cos(z1.y) - z2.x * cos(z2.y), z1.x * sin(z1.y) - z2.x * sin(z2.y)));
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


float riemannSpheredistance(vec2 z, vec2 w) {
  float zAbs = abs(z.x);
  float wAbs = abs(w.x);
  float transformationResult;
  if (wAbs < ZERO) {
    transformationResult = zAbs;
  } else if (zAbs < ZERO) {
    transformationResult = wAbs;
  } else if (wAbs >= INFINITY) {
    transformationResult = 1.0 / zAbs;
  } else if (zAbs >= INFINITY) {
    transformationResult = 1.0 / wAbs;
  } else {
    float c = z.x * cos(z.y - w.y);
    float s = z.x * sin(z.y - w.y);
    transformationResult = sqrt((c - w.x) * (c - w.x) + s * s) / sqrt((w.x * c + 1.0) * (w.x * c + 1.0) + w.x * w.x * s * s);
  }
  if (abs(transformationResult) >= INFINITY) {
    return PI;
  } else if (abs(transformationResult) <= ZERO) {
    return 2.0 * atan(ZERO);
  } else {
    return 2.0 * atan(transformationResult);
  }
}

vec2 applyFunction(vec2 z) {
  if (isComplexInfinity(z)) {
    return z;
  }
  vec2 numerator = numeratorCoefficients[0];
  vec2 denominator = denominatorCoefficients[0];
  for (int p = 1; p <= numeratorDegree; ++p) {
    if (!isComplexZero(numeratorCoefficients[p])) {
      numerator = complexSum(numerator, complexMultiplication(numeratorCoefficients[p], complexPower(z, p)));
    }
  }
  for (int p = 1; p <= denominatorDegree; ++p) {
    if (!isComplexZero(denominatorCoefficients[p])) {
      denominator = complexSum(denominator, complexMultiplication(denominatorCoefficients[p], complexPower(z, p)));
    }
  }
  return complexMultiplication(numerator, complexInverse(denominator));
}

vec3 getColor(float adjustedDivergence, float hue, vec4 colorParameters) {
  float saturation = colorParameters.x * pow(adjustedDivergence, colorParameters.y);
  float value = colorParameters.z * pow(adjustedDivergence, colorParameters.w);
  return vec3(hue, saturation, value);
}

vec3 colorAccordingToSet(float adjustedDivergence, vec2 fkz) {
  // If it belongs to the Julia Set, return the Julia color
  if (adjustedDivergence > 1.) {
    return juliaHSV;
  }

  // If it belongs to the Fatou set, color according to attractor
  for (int a = 0; a <= nbAttractors; ++a) {
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

void main() {

  // Parameters
  int nbIteration = 20;

  // Convert coordinates to complex number
  vec2 z = vec2(length(coordinates), atan(coordinates.y, coordinates.x));

  // Compute how close from an attractor the current point is 
  // by checking if nearby pixels tend to get closer
  vec2 fkz = z;
  vec2 fkzeps = vec2(z.x + EPSILON, z.y);
  float divergence = 0.0;
  for (int k; k < nbIteration; ++k) {
    fkz = applyFunction(fkz);
    fkzeps = applyFunction(fkzeps);
    divergence += riemannSpheredistance(fkz, fkzeps);
  }

  // Color according to the divergence of close points and convert to RGB
  float adjustedDivergence = 1400. * log(divergence + 1.0);
  fragColor = vec4(hsvToRgb(colorAccordingToSet(adjustedDivergence, fkz)), 1.0);

  // fragColor = vec4(divergence * 10000.0, 0., 0., 1.0);
}