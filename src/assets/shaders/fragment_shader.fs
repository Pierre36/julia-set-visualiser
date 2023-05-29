#version 300 es
precision highp float;

#define PI 3.1415926538
#define ZERO 0.000000000001
#define EPSILON 0.000001
#define INFINITY 1000000.0

in vec2 coordinates;

out vec4 fragColor;

uniform float time;
uniform int numeratorDegree;
uniform vec2 numeratorCoefficients[16];
uniform int denominatorDegree;
uniform vec2 denominatorCoefficients[16];


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
    vec2 zw_ = complexMultiplication(z, vec2(w.x, -w.y));
    // transformationResult = complexSum(zw_, vec2(-wAbs * wAbs, 0.0)).x / 2.0 * wAbs * cos((z.y + w.y) / 2.0);
    transformationResult = complexSum(zw_, vec2(-wAbs * wAbs, 0.0)).x / (complexSum(zw_, vec2(1.0, 0.0)).x * wAbs);
  }
  if (abs(transformationResult) >= INFINITY) {
    return PI;
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

void main() {

  // Parameters
  float scale = 2.0;
  int nbMaxIteration = 20;

  // Convert coordinates to complex number
  vec2 z = vec2(length(coordinates), atan(coordinates.y, coordinates.x));
  z = vec2(z.x * scale, z.y);

  // Find the smallest n so that the distance between f^k(z) and f^k(z + epsilon) 
  // is below the given bound for all k >= n
  float bound = 0.00001;
  vec2 fkz = z;
  vec2 fkzeps = vec2(z.x * (1.0 + EPSILON), z.y);
  int n = nbMaxIteration;
  for (int k; k < nbMaxIteration; ++k) {
    fkz = applyFunction(fkz);
    fkzeps = applyFunction(fkzeps);
    if (riemannSpheredistance(fkz, fkzeps) <= bound) {
      n = min(n, k);
    } else {
      n = nbMaxIteration;
    }
  }

  // Color according to n
  float hue = 210.0;
  float saturation = 0.9;
  float value = 0.0;
  value = float(n) / float(nbMaxIteration);
  if (n == nbMaxIteration) {
    value = 1.0;
    saturation = 0.0;
  }
  // if (n == 0) {
  //   value = 0.5;
  // }
  // if (!isComplexInfinity(fkz)) {
  //   saturation = 0.0;
  //   value = 1.0;
  // }

  // Convert HSV to RGB
  fragColor = vec4(hsvToRgb(vec3(hue, saturation, value)), 1.0);
}