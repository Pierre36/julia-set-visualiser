#version 300 es
precision highp float;

in vec4 vertexPosition;

out vec2 coordinates;

uniform float dimensionRatio;
uniform float coordinatesScale;

void main() {
  gl_Position = vertexPosition;
  if (dimensionRatio < 1.0) {
    coordinates = vertexPosition.xy * vec2(1.0, 1.0 / dimensionRatio);
  } else {
    coordinates = vertexPosition.xy * vec2(dimensionRatio, 1.0);
  }
  coordinates = coordinatesScale * coordinates;
}