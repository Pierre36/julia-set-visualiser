#version 300 es
precision highp float;

in vec2 normalizedCoord;

out vec4 fragColor;

uniform float time;

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

void main() {
  float hue = (sin(time / 2.0) + 1.0) / 2.0 * 360.0;
  float saturation = 1.0;
  float value = 0.0;
  if (length(normalizedCoord) < 0.5) {
    value = 1.0;
  }
  vec3 rgb = hsvToRgb(vec3(hue, saturation, value));
  fragColor = vec4(rgb, 1.0);
}