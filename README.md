# Julia Set Visualiser

The aim of this project is to develop an interactive tool for visualising animations of Julia fractals. For a detailed explanation of Julia sets and their fractal structures, refer to the [Wikipedia page](https://en.wikipedia.org/wiki/Julia_set).

In essence, a Julia set consists of values where nearby points exhibit similar behaviour under repeated iterations of a given function. The Julia Set Visualizer is designed to enable configuration of the computation algorithm, the Julia Set visual representation, and the function being visualised.

## Interface description

The interface is divided in 3 sections: the header, the side panels and the main animation frame.

### Header

Besides the page title and logo, the header contains:

- a dropdown menu to select preset Julia fractals configurations
- a save button to store the current custom configuration in the browser
- a download button to download a JSON representation of the current configuration
- a help button redirecting to this page

### Side panels

The interface includes 3 side panels for configuring various aspects of the animation: the function, the colours, and the algorithm settings. A fourth panel provides options to randomise the configuration. Detailed descriptions of each panel's purpose and usage can be accessed by clicking the **ⓘ** button.

### Animation frame

The animation frame has 3 buttons:

- a metric button to display some debug metrics
- a pause/unpause button
- a full screen button

## Algorithm principles

The algorithm is based on the Cauchy Convergence Algorithm described on this [Wikipedia page](https://de.wikipedia.org/wiki/Benutzer:Georg-Johann/Mathematik#Visualising_Julia_sets). The idea is to observe how the distance between to initially nearby points evolves under repeated iteration of the function. If their distance increases, they belong to the Julia Set, otherwise, they belong to the Fatou Set and the sum of the distance at each step is used to colour the corresponding pixel.

### Distance

The distance is defined as the chordal distance extended to be defined for $\infty$:

$$
\forall (z_1, z_2) \in (\mathbb{C} \cup \{\infty\})^2,\space d(z_1, z_2) =
\begin{cases}
  0 & \text{if} \space |z_1| = \infty \space \text{and} \space |z_2| = \infty \\
  \frac{1}{\sqrt{1 + |z_2|^2}} & \text{if} \space |z_1| = \infty \space \text{and} \space |z_2| \neq \infty \\
  \frac{1}{\sqrt{1 + |z_1|^2}} & \text{if} \space |z_1| \neq \infty \space \text{and} \space |z_2| = \infty \\
  \frac{|z_1 - z_2|}{\sqrt{1 + |z_1|^2}\sqrt{1 + |z_2|^2}} & \text{otherwise}
\end{cases}
$$

Note that, since the distance between two points at $\infty$ is 0, $\infty$ becomes a valid attractor.

### Algorithm

For each point of coordinates $(x, y)$, we attribute a complex number $z = x + iy$. Then, given the configured $\epsilon$, we have $z_\epsilon = x + \epsilon + i(y + \epsilon)$.

We then compute the sum of the chordal distances between the repeated iteration of the configured function $f$ over $z$ and $z_\epsilon$: $divergence=\sum_{k=1}^{N}{d(f^k(z), f^k(z_\epsilon))}$. $N$ is the configured number of iterations.

If the natural log of the divergence is higher than the configured julia bound, the point $(x, y)$ is coloured as belonging to the Julia Set. Otherwise, the divergence and the final $f^N(z)$ is used to colour the point as belonging to the Fatou set.

## Colouring method

The colouring strategy is based on the smooth colouring described on this [Wikipedia Page](https://de.wikipedia.org/wiki/Benutzer:Georg-Johann/Mathematik#Visualising_Julia_sets).

For Julia set pixels, the configured Julia Set HSV is used directly.

For Fatou set pixels, the colouring parameters are obtained by comparing the configured attractors with the final $f^N(z)$. If no attractor is close enough, the default colouring parameters are used. Then, the HSV colour is determined like so:

- $H$ is the configured hue
- $S = strength \cdot -log(divergence) + offset$
- $V = \frac{1}{2} \cdot \left( \frac{v}{\sqrt{1 + v^2}} + 1 \right) \space \text{with} \space v = strength \cdot log(divergence) + offset$

## Sources and useful related pages

- [Julia Set Wikipedia page](https://en.wikipedia.org/wiki/Julia_set)
- [Georg-Johann mathematical Wikipedia page](https://de.wikipedia.org/wiki/Benutzer:Georg-Johann/Mathematik#Visualising_Julia_sets)
- [WebGPU API documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
- [WebGPU Fundamentals](https://webgpufundamentals.org/)
