import * as THREE from 'three';

export interface ViewportInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
}

export interface StarFieldProps {
  count: number;
  radius: number;
  size: number;
  depthZ: number;
  spread: number;
  orbitSpeed?: number;
}

export interface PlanetProps {
  orbitRadiusX: number;
  orbitRadiusY: number;
  orbitSpeed: number;
  size: number;
  color1: string;
  color2: string;
  roughness: number;
  atmosphereColor: string;
  atmosphereIntensity: number;
  rotationSpeed: number;
  initialAngle: number;
  hasRing?: boolean;
  ringColor?: string;
  tilt?: number;
  planetType?: number; // 0=rocky, 1=gas, 2=ice, 3=ocean
  cloudColor?: string;
  cloudIntensity?: number;
  geometryDetail?: number; // 0.4 to 1.0 multiplier for segment counts
}

export interface NebulaCloudProps {
  position: [number, number, number];
  scale: number;
  colors: [string, string, string];
  opacity: number;
  flowSpeed: number;
  zPos: number;
}

export interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  vx: number;
  vy: number;
  vz: number;
  age: number;
  maxAge: number;
  brightness: number;
}

export interface FlightState {
  active: boolean;
  t: number;
  speed: number;
  nextIn: number;
  p0: THREE.Vector3;
  p1: THREE.Vector3;
  p2: THREE.Vector3;
  p3: THREE.Vector3;
}
