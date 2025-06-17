
export interface ShootingStar {
  id: number;
  icon: { url: string; name: string };
  startX: number;
  arcDirection: number;
  arcStrength: number;
  animationDuration: number;
  delay: number;
  baseHue: number;
  endHue: number;
  size: number;
  rotation: number;
  baseOpacity: number;
}
