// Warp speed fragment shader
varying vec2 vUv;

uniform float uTime;
uniform float uIntensity;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 center = vUv - 0.5;
  float dist = length(center);
  float angle = atan(center.y, center.x);
  
  // Streaking stars
  float streak = random(vec2(angle * 100.0, floor(dist * 50.0)));
  streak = step(0.97, streak);
  
  // Radial stretch
  float stretch = smoothstep(0.0, 0.5, dist) * uIntensity;
  float brightness = streak * stretch * (1.0 - dist * 1.5);
  
  // Blue-white color
  vec3 color = mix(vec3(0.4, 0.6, 1.0), vec3(1.0), brightness);
  
  float alpha = brightness * uIntensity;
  
  gl_FragColor = vec4(color, alpha);
}
