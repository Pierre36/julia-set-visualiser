const PI: f32 = 3.14159265358979323846;

struct FunctionParameters {
  is_newton: u32,
  numerator_coefs_count: u32,
  denominator_coefs_count: u32,
  @align(16) newton_coef: EllipseParameters,
};

struct EllipseParameters {
  duration: f32,
  angle: f32,
  half_width: f32,
  half_height: f32,
  offset_mod: f32,
  offset_arg: f32,
  power: f32,
};

@group(0) @binding(1) var<uniform> time: f32;
@group(0) @binding(2) var<uniform> function_params: FunctionParameters;
@group(0) @binding(3) var<storage> coefficient_params: array<EllipseParameters>;
@group(0) @binding(4) var<storage, read_write> fraction: array<vec3f>;

fn evaluate(params: EllipseParameters) -> vec2f {
  let theta = select(2 * PI * (time % params.duration) / params.duration, 0, params.duration <= 0);
  return vec2f(
    params.offset_mod * cos(params.offset_arg - params.angle) + params.half_width * cos(theta),
    params.offset_mod * sin(params.offset_arg - params.angle) + params.half_height * sin(theta)
  );
}

fn polarWithAngle(complex: vec2f, angle: f32) -> vec2f {
  return vec2f(length(complex), atan2(complex.y, complex.x) + angle);
}

fn multiply(z1: vec2f, z2: vec2f) -> vec2f {
  return vec2f(z1.x * z2.x, z1.y + z2.y);
}

fn evaluateWithoutNewton(params: EllipseParameters) -> vec2f {
  return polarWithAngle(evaluate(params), params.angle);
}

fn evaluateWithNewton(params: EllipseParameters, newton_params: EllipseParameters) -> vec2f {
  return multiply(
    evaluateWithoutNewton(params), 
    polarWithAngle(
      params.power * vec2f(cos(newton_params.angle), -sin(newton_params.angle)) - evaluate(newton_params),
      newton_params.angle
    )
  );
}

@compute
@workgroup_size(16, 2)
fn computeMain(@builtin(global_invocation_id) index: vec3u) {
  let params = coefficient_params[index.x + index.y * 16];
  fraction[index.x + index.y * 16] = vec3f(select(
    evaluateWithoutNewton(params),
    evaluateWithNewton(params, function_params.newton_coef),
    index.y == 0 && function_params.is_newton == 1
  ), params.power);
}