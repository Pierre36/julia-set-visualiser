import { Complex } from "./models/Complex";

export { complexCircle, complexLine };

/**
 * Returns a function which returns the complex point on the described circle at the provided time.
 * @param {Complex} center The center of the circle.
 * @param {Number} radius The radius of the circle.
 * @param {Number} duration The duration of the animation in milliseconds.
 * @returns {Function} A function which returns the complex point on the described circle at the provided time.
 */
function complexCircle(center, radius, duration) {
  return (time) => {
    const animTime = ((time % duration) / duration) * 2 * Math.PI;
    return new Complex(
      center.re + radius * Math.cos(animTime),
      center.im + radius * Math.sin(animTime)
    );
  };
}

/**
 * Returns a function which returns the complex point on the described line at the provided time.
 * @param {Complex} start The start of the line.
 * @param {Complex} end The end of the line.
 * @param {Number} duration The duration of the animation in milliseconds.
 * @returns {Function} A function which returns the complex point on the described line at the provided time.
 */
function complexLine(start, end, duration) {
  return (time) => {
    const animTime = (time % duration) / duration;
    if (animTime < 0.5) {
      return new Complex(
        start.re + 2 * animTime * (end.re - start.re),
        start.im + 2 * animTime * (end.im - start.im)
      );
    } else {
      return new Complex(
        end.re - (2 * animTime - 1) * (end.re - start.re),
        end.im + (2 * animTime - 1) * (end.im - start.im)
      );
    }
  };
}
