
import { ShootingStar as ShootingStarType } from "../types/shootingStar";

interface ShootingStarProps {
  star: ShootingStarType;
}

const ShootingStar = ({ star }: ShootingStarProps) => {
  return (
    <div
      className="absolute bottom-0"
      style={{
        left: `${star.startX}%`,
        '--arc-direction': star.arcDirection,
        '--arc-strength': `${star.arcStrength}vw`,
        '--base-hue': star.baseHue,
        '--end-hue': star.endHue,
        '--star-rotation': `${star.rotation}deg`,
        '--base-opacity': star.baseOpacity,
        '--base-size': star.size,
        animation: `shootingStar ${star.animationDuration}s linear forwards`,
        animationDelay: `${star.delay}s`,
      } as React.CSSProperties}
    >
      {/* Improved aura with better blending and fade animation */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          filter: 'blur(16px)',
          transform: 'scale(1.8)',
          animation: `iconAura ${star.animationDuration}s linear forwards`,
        }}
      >
        <img
          src={star.icon.url}
          alt=""
          className="block w-full h-full object-contain"
          style={{
            width: `${65 * star.size}px`,
            height: `${65 * star.size}px`,
            filter: 'brightness(1.2) saturate(1.2) drop-shadow(0 0 12px rgba(100, 180, 200, 0.4))',
          }}
          draggable={false}
          loading="eager"
        />
      </div>
      
      {/* Main shooting star icon */}
      <div className="relative z-10">
        <img
          src={star.icon.url}
          alt={star.icon.name}
          className="block"
          style={{
            width: `${65 * star.size}px`,
            height: `${65 * star.size}px`,
            objectFit: 'contain',
            animation: `iconFlow ${star.animationDuration}s linear forwards, iconRotate ${star.animationDuration}s linear forwards, iconColorShift ${star.animationDuration}s linear forwards`,
          }}
          draggable={false}
          loading="eager"
        />
      </div>
    </div>
  );
};

export default ShootingStar;
