// Galaxy swirl fragment shader
varying float vAlpha;

uniform vec3 uColor;
uniform vec3 uCoreColor;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  
  float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
  vec3 color = mix(uColor, uCoreColor, alpha * 0.5);
  
  gl_FragColor = vec4(color, alpha * 0.8);
}
