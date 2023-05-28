#version 300 es
precision highp float;

in vec4 vertexPosition;

out vec2 normalizedCoord;

uniform float resolution;

void main() {
    gl_Position = vertexPosition;
    if (resolution < 1.0) {
        normalizedCoord = vertexPosition.xy * vec2(1.0, 1.0 / resolution);
    } else {
        normalizedCoord = vertexPosition.xy * vec2(resolution, 1.0);
    }
}