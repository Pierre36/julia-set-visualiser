const PI: f32 = 3.14159265358979323846;
const INFINITY: f32 = 1e10;
const INFINITY_POINT: vec2f = vec2f(INFINITY, INFINITY);
const ZERO_POINT: vec2f = vec2f(0, 0);

struct FunctionParameters {
  is_newton: u32,
  numerator_coefs_count: u32,
  denominator_coefs_count: u32,
};

struct ColourParameters {
  hue: f32,
  sat_strength: f32,
  sat_offset: f32,
  val_strength: f32,
  val_offset: f32,
};

struct FractalParameters {
  iterations_count: u32,
  epsilon: f32,
  julia_bound: f32,
  attractors_count: u32,
  default_colour: ColourParameters,
  @align(16) infinity_colour: ColourParameters,
  @align(16) julia_hsv: vec3f,
};

struct Attractor {
  complex: vec2f,
  @align(16) colour: ColourParameters,
};

@group(0) @binding(2) var<uniform> function_params: FunctionParameters;
@group(0) @binding(4) var<storage, read_write> fraction: array<vec3f>;
@group(0) @binding(5) var<uniform> fractal_params: FractalParameters;
@group(0) @binding(6) var<storage> attractors: array<Attractor>;

fn polar(re: f32, im: f32) -> vec2f {
  return vec2f(sqrt(re * re + im * im), atan2(im, re));
}

fn multiply(z1: vec2f, z2: vec2f) -> vec2f {
  return select(
    vec2f(mat2x2f(z1.x, z1.y, -z1.y, z1.x) * z2.xy),
    INFINITY_POINT,
    length(z1) > INFINITY || length(z2) > INFINITY
  );
}

fn divide(z1: vec2f, z2: vec2f, value_when_both_infinity: vec2f) -> vec2f {
  let mod_z1 = length(z1);
  let mod_z2 = length(z2);
  
  if (mod_z1 == 0) {
    return ZERO_POINT;
  }

  if (mod_z2 == 0) {
    return INFINITY_POINT;
  }

  if (mod_z1 > INFINITY) {
    if (mod_z2 < mod_z1) {
      return INFINITY_POINT;
    }
    if (mod_z2 > mod_z1) {
      return ZERO_POINT;
    }
    return value_when_both_infinity;
  }
  
  if (mod_z2 > INFINITY) {
    return ZERO_POINT;
  }

  return multiply(z1, vec2f(z2.x, -z2.y)) / (mod_z2 * mod_z2);
}

fn power(z: vec2f, p: f32) -> vec2f {
  if (p == 0) {
    return vec2f(1, 0);
  }

  var result = z;
  for (var n: f32 = 0; n < p - 1; n = n + 1) {
    result = multiply(result, z);
  }
  return result;
}

fn evaluatePolynomial(z: vec2f, offset: u32, coefs_count: u32) -> vec2f {
  var result = vec2f(0, 0);

  for (var k: u32 = offset + coefs_count; k > offset; k--) {
    let coef = fraction[k - 1];
    result = multiply(result + coef.xy, power(z, coef.z));
  }

  return result;
}

fn getPolynomialDegree(offset: u32, coefs_count: u32) -> f32 {
  var power: f32 = 0;
  for (var k: u32 = offset; k < coefs_count + offset; k++) {
    power += fraction[k].z;
  }
  return power;
}

fn evaluateFractionAtInfinity() -> vec2f {
  let higher_numerator_coef = fraction[function_params.numerator_coefs_count - 1];
  let higher_denominator_coef = fraction[function_params.denominator_coefs_count + 15];

  let numerator_degree = getPolynomialDegree(0, function_params.numerator_coefs_count);
  let denominator_degree = getPolynomialDegree(16, function_params.denominator_coefs_count);

  return select(
    select(
      divide(higher_numerator_coef.xy, higher_denominator_coef.xy, vec2f(1, 0)),
      ZERO_POINT,
      numerator_degree < denominator_degree
    ),
    INFINITY_POINT,
    numerator_degree > denominator_degree
  );
}

fn applyFunction(z: vec2f, value_at_infinity: vec2f) -> vec2f {
  if (length(z) >= INFINITY) {
    return value_at_infinity;
  }
  return divide(
    evaluatePolynomial(z, 0, function_params.numerator_coefs_count),
    evaluatePolynomial(z, 16, function_params.denominator_coefs_count),
    value_at_infinity
  );
}

fn chordalDistance(z1: vec2f, z2: vec2f) -> f32 {
  let mod_z2 = length(z2);
  let mod_z1 = length(z1);
  
  let inverse_sqrt_1_plus_squared_mod_z1 = 1 / sqrt(1 + mod_z1 * mod_z1);
  let inverse_sqrt_1_plus_squared_mod_z2 = 1 / sqrt(1 + mod_z2 * mod_z2);

  if (mod_z1 >= INFINITY) {
    if (mod_z2 >= INFINITY) {
      return 0;
    }
    return inverse_sqrt_1_plus_squared_mod_z2;
  }

  if (mod_z2 >= INFINITY) {
    return inverse_sqrt_1_plus_squared_mod_z1;
  } 
  return length(z1 - z2) * inverse_sqrt_1_plus_squared_mod_z1 * inverse_sqrt_1_plus_squared_mod_z2;
}

fn colourAccordingToAttractor(adjusted_divergence: f32, fkz: vec2f) -> vec3f {
  // If it converges to infinity, colour using infinity colouring
  if (length(fkz) >= INFINITY) {
    return getColour(adjusted_divergence, fractal_params.infinity_colour); 
  }

  // Search for an attractor
  for (var a = 0u; a < fractal_params.attractors_count; a++) {
    if (chordalDistance(attractors[a].complex, fkz) < 0.001) {
      return getColour(adjusted_divergence, attractors[a].colour);
    }
  }

  // If no attractor matches the point, colour using default colouring
  return getColour(adjusted_divergence, fractal_params.default_colour);
}

fn colourAccordingToSet(adjusted_divergence: f32, fkz: vec2f) -> vec3f {
  return select(
    fractal_params.julia_hsv, // If it belongs to the Julia Set, return the Julia colour
    colourAccordingToAttractor(adjusted_divergence, fkz), // If it belongs to the Fatou Set, colour based on the attractor
    adjusted_divergence <= 0
  );
}

fn getColour(adjusted_divergence: f32, colour_params: ColourParameters) -> vec3f {
  let saturation = colour_params.sat_strength * -adjusted_divergence + colour_params.sat_offset;
  let raw_value = colour_params.val_strength * adjusted_divergence + colour_params.val_offset;
  let value = 0.5 * (raw_value / sqrt(1.0 + raw_value * raw_value) + 1.0);
  return vec3f(colour_params.hue, saturation, value);
}

fn hsv2rgba(hsv: vec3f) -> vec4f {
  return vec4f(hsv.z * mix(vec3f(1), clamp(abs((hsv.x / 60 + vec3f(0, 4, 2)) % 6 - 3) - 1, vec3f(0), vec3f(1)), hsv.y), 1);
}

@fragment
fn fragmentMain(@location(0) z: vec2f) -> @location(0) vec4f {
  var fkz = z;
  var fkzeps = z + fractal_params.epsilon;

  let value_at_infinity = evaluateFractionAtInfinity();

  var divergence: f32 = 0;
  var distance: f32 = INFINITY;
  var k: u32 = 0;
  while (k < fractal_params.iterations_count && distance > 0) {
    fkz = applyFunction(fkz, value_at_infinity);
    fkzeps = applyFunction(fkzeps, value_at_infinity);
    distance = chordalDistance(fkz, fkzeps);
    divergence += distance;
    k++;
  }

  return hsv2rgba(colourAccordingToSet(log(divergence) - fractal_params.julia_bound, fkz));
}