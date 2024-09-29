const PI: f32 = 3.14159265358979323846;
const INFINITY: f32 = 10000000000;

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

fn evaluatePolynomial(z: vec2f, offset: u32, coefs_count: u32) -> vec2f {
  var re: f32 = 0;
  var im: f32 = 0;

  var r: f32 = 0;
  var theta: f32 = 0;
  for (var k: u32 = 0; k < coefs_count; k++) {
    let coef = fraction[u32(k) + offset];
    let power = coef.z;
    r = select(coef.x * pow(z.x, power), coef.x, power == 0);
    theta = power * z.y + coef.y;
    re += r * cos(theta);
    im += r * sin(theta);
  }

  return polar(re, im);
}

fn divide(z1: vec2f, z2: vec2f) -> vec2f {
  return vec2f(z1.x / z2.x, z1.y - z2.y);
}

fn applyFunction(z: vec2f) -> vec2f {
  // TODO /!\ Returning infinity may not always be OK (for exemple for fractions)
  return select(
    divide(
      evaluatePolynomial(z, 0, function_params.numerator_coefs_count), 
      evaluatePolynomial(z, 16, function_params.denominator_coefs_count)
    ), 
    vec2f(INFINITY, z.y), 
    z.x >= INFINITY
  );
}

fn chordalDistance(z1: vec2f, z2: vec2f) -> f32 {
  return select(
    select(
      2 * sqrt(max(z1.x * z1.x + z2.x * z2.x - 2 * z1.x * z2.x * cos(z2.y - z1.y), 0)) / (sqrt((1 + z1.x * z1.x)) * sqrt((1 + z2.x * z2.x))),
      2 / sqrt(1 + z1.x * z1.x),
      z2.x >= INFINITY
    ),
    select(
      2 / sqrt(1 + z2.x * z2.x), 
      0, 
      z2.x >= INFINITY
    ),
    z1.x >= INFINITY
  );
}

fn colourAccordingToAttractor(adjusted_divergence: f32, fkz: vec2f) -> vec3f {
  // If it converges to infinity, colour using infinity colouring
  if (fkz.x >= INFINITY) {
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
    colourAccordingToAttractor(adjusted_divergence, fkz), // If it belongs to the Fatou Set, coulour based on the attractor
    adjusted_divergence <= 0
  );
}

fn getColour(adjusted_divergence: f32, colour_params: ColourParameters) -> vec3f {
  let saturation = colour_params.sat_strength * -adjusted_divergence + colour_params.sat_offset;
  let raw_value = colour_params.val_strength * adjusted_divergence + colour_params.val_offset;
  let value = 0.5 * (raw_value / sqrt(1.0 + raw_value * raw_value) + 1.0);
  return vec3f(colour_params.hue, saturation, value);
}

fn hsvToRgba(hsv: vec3f) -> vec4f {
  return vec4f(hsv.z * mix(vec3f(1), clamp(abs((hsv.x / 60 + vec3f(0, 4, 2)) % 6 - 3) - 1, vec3f(0), vec3f(1)), hsv.y), 1);
}

@fragment
fn fragmentMain(@location(0) coords: vec2f) -> @location(0) vec4f {
  let z = polar(coords.x, coords.y);

  var fkz = z;
  var fkzeps = z + vec2(fractal_params.epsilon, 0);

  var divergence: f32 = 0;
  var distance: f32 = INFINITY;
  var iteration: u32 = 0;
  while (iteration < fractal_params.iterations_count && distance > 0) {
    fkz = applyFunction(fkz);
    fkzeps = applyFunction(fkzeps);
    distance = chordalDistance(fkz, fkzeps);
    divergence += distance;
    iteration++;
  }

  return hsvToRgba(colourAccordingToSet(log(divergence) - fractal_params.julia_bound, fkz));
}