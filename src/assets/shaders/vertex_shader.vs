#version 300 es
precision highp float;

in vec4 vertexPosition;

out vec2 coordinates;

uniform float resolution;
uniform float coordinatesScale;

void main() {
  gl_Position = vertexPosition;
  if (resolution < 1.0) {
    coordinates = vertexPosition.xy * vec2(1.0, 1.0 / resolution);
  } else {
    coordinates = vertexPosition.xy * vec2(resolution, 1.0);
  }
  coordinates = coordinatesScale * coordinates;
}