// Galaxy swirl vertex shader
varying vec2 vUv;
varying float vAlpha;

attribute float angle;
attribute float radius;
attribute float randomness;

uniform float uTime;
uniform float uSize;

void main() {
  vUv = uv;
  
  float currentAngle = angle + uTime * 0.1 * (1.0 / max(radius, 0.5));
  
  vec3 pos = position;
  pos.x = cos(currentAngle) * radius + randomness * 0.5;
  pos.y = (randomness - 0.5) * 0.8;
  pos.z = sin(currentAngle) * radius + randomness * 0.3;
  
  vAlpha = smoothstep(0.0, 0.5, 1.0 - radius / uSize);
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = max(1.5, (2.0 + randomness) * (200.0 / -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;
}
