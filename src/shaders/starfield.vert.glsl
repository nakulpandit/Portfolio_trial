// Starfield vertex shader
varying vec2 vUv;
varying float vBrightness;

attribute float brightness;
attribute float twinkleSpeed;

uniform float uTime;

void main() {
  vUv = uv;
  vBrightness = brightness * (0.5 + 0.5 * sin(uTime * twinkleSpeed));
  
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = max(1.0, brightness * 3.0 * (300.0 / -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;
}
