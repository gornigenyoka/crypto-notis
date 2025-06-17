
import { useEffect, useState } from "react";
import { useShootingStars } from "../hooks/useShootingStars";
import ShootingStar from "./ShootingStar";

const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    console.log("AnimatedBackground mounted");
  }, []);

  const shootingStars = useShootingStars(mounted);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900/95 to-black" />
      
      {shootingStars.map((star) => (
        <ShootingStar key={star.id} star={star} />
      ))}
      
      <style>{`
        @keyframes shootingStar {
          0% {
            transform: translateY(0) translateX(0);
          }
          100% {
            transform: translateY(-150vh) translateX(calc(var(--arc-direction) * var(--arc-strength)));
          }
        }
        
        @keyframes iconFlow {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          15% {
            transform: scale(0.6);
            opacity: calc(var(--base-opacity) * 0.4);
          }
          30% {
            transform: scale(0.85);
            opacity: calc(var(--base-opacity) * 0.7);
          }
          50% {
            transform: scale(1);
            opacity: var(--base-opacity);
          }
          70% {
            transform: scale(0.9);
            opacity: calc(var(--base-opacity) * 0.8);
          }
          85% {
            transform: scale(0.5);
            opacity: calc(var(--base-opacity) * 0.4);
          }
          100% {
            transform: scale(0.2);
            opacity: 0;
          }
        }
        
        @keyframes iconAura {
          0% {
            opacity: 0;
            filter: blur(20px) brightness(1.1) saturate(1.3);
          }
          10% {
            opacity: 0.12;
            filter: blur(18px) brightness(1.2) saturate(1.4);
          }
          25% {
            opacity: 0.18;
            filter: blur(16px) brightness(1.25) saturate(1.5);
          }
          50% {
            opacity: 0.22;
            filter: blur(14px) brightness(1.3) saturate(1.6);
          }
          75% {
            opacity: 0.15;
            filter: blur(16px) brightness(1.2) saturate(1.4);
          }
          90% {
            opacity: 0.08;
            filter: blur(18px) brightness(1.15) saturate(1.3);
          }
          100% {
            opacity: 0;
            filter: blur(20px) brightness(1.1) saturate(1.2);
          }
        }
        
        @keyframes iconRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(var(--star-rotation));
          }
        }
        
        @keyframes iconColorShift {
          0% {
            filter: brightness(1.2) saturate(1.4) hue-rotate(calc(var(--base-hue) * 1deg)) drop-shadow(0 0 8px hsla(var(--base-hue), 80%, 60%, 0.6));
          }
          50% {
            filter: brightness(1.4) saturate(1.6) hue-rotate(calc((var(--base-hue) + var(--end-hue)) / 2 * 1deg)) drop-shadow(0 0 12px hsla(calc((var(--base-hue) + var(--end-hue)) / 2), 85%, 65%, 0.8));
          }
          100% {
            filter: brightness(1.1) saturate(1.3) hue-rotate(calc(var(--end-hue) * 1deg)) drop-shadow(0 0 6px hsla(var(--end-hue), 75%, 55%, 0.5));
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
