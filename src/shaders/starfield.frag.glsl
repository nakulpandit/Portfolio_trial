// Starfield fragment shader
varying float vBrightness;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  
  float alpha = smoothstep(0.5, 0.0, dist);
  vec3 color = mix(vec3(0.6, 0.7, 1.0), vec3(1.0, 0.95, 0.8), vBrightness);
  
  gl_FragColor = vec4(color, alpha * vBrightness);
}
