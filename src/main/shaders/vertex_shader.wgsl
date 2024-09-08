struct ViewportUniforms {
  dimension_ratio: f32,
  scale: f32,
  center: vec2f,
};

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) coords: vec2f,
};

@group(0) @binding(0) var<uniform> viewport: ViewportUniforms;

@vertex
fn vertexMain(@location(0) pos: vec2f) -> VertexOutput {
  var output: VertexOutput;

  output.position = vec4f(pos, 0, 1);

  let dimension_ratio_coef = select(vec2(1, 1 / viewport.dimension_ratio), vec2(viewport.dimension_ratio, 1), viewport.dimension_ratio >= 1);
  output.coords = viewport.scale * pos * dimension_ratio_coef + viewport.center;
  
  return output;
}