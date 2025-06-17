
import { useState, useEffect } from "react";
import { cryptoIcons } from "../data/cryptoIcons";
import { ShootingStar } from "../types/shootingStar";

export const useShootingStars = (mounted: boolean) => {
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    if (!mounted) return;

    let iconRotation = 0;
    const usedPositions: { x: number; time: number }[] = [];
    const recentIcons: { name: string; time: number }[] = [];

    const createShootingStar = () => {
      const id = Date.now() + Math.random();
      const now = Date.now();
      
      // Clean old entries
      const cutoff = now - 6000;
      usedPositions.splice(0, usedPositions.length, ...usedPositions.filter(p => p.time > cutoff));
      recentIcons.splice(0, recentIcons.length, ...recentIcons.filter(i => i.time > cutoff));
      
      // Better icon distribution
      let icon;
      let attempts = 0;
      do {
        icon = cryptoIcons[iconRotation % cryptoIcons.length];
        iconRotation++;
        attempts++;
      } while (
        attempts < 8 && 
        recentIcons.filter(i => i.name === icon.name).length >= 2
      );
      
      recentIcons.push({ name: icon.name, time: now });
      
      // Better spawn distribution
      let startX: number;
      let spawnAttempts = 0;
      do {
        startX = 5 + Math.random() * 90;
        spawnAttempts++;
      } while (
        spawnAttempts < 20 && 
        usedPositions.some(pos => Math.abs(pos.x - startX) < 15)
      );
      
      usedPositions.push({ x: startX, time: now });
      
      const arcDirection = Math.random() > 0.5 ? 1 : -1;
      const arcStrength = 35 + Math.random() * 45;
      
      const baseSpeed = 8 + Math.random() * 5;
      const animationDuration = baseSpeed;
      
      // IMPROVED COLOR DISTRIBUTION - 10% orange, 10% purple, 5% black, more blues especially royal blue, cold greens
      let baseHue, endHue;
      const colorChoice = Math.random();
      
      if (colorChoice < 0.1) {
        // 10% ORANGE (15-45 degrees)
        baseHue = 15 + Math.random() * 30;
        endHue = baseHue + (Math.random() - 0.5) * 20;
      } else if (colorChoice < 0.2) {
        // 10% PURPLE (260-300 degrees)
        baseHue = 260 + Math.random() * 40;
        endHue = baseHue + (Math.random() - 0.5) * 25;
      } else if (colorChoice < 0.25) {
        // 5% BLACK/DARK (0-30 degrees, low saturation)
        baseHue = Math.random() * 30;
        endHue = baseHue + (Math.random() - 0.5) * 20;
      } else if (colorChoice < 0.4) {
        // 15% DARK PINK/MAGENTA (300-340 degrees)
        baseHue = 300 + Math.random() * 40;
        endHue = baseHue + (Math.random() - 0.5) * 30;
      } else if (colorChoice < 0.55) {
        // 15% COLD GREENS (120-180 degrees, avoiding yellow-greens)
        const greenVariant = Math.random();
        if (greenVariant < 0.4) {
          baseHue = 140 + Math.random() * 20; // Emerald/teal greens
        } else if (greenVariant < 0.7) {
          baseHue = 160 + Math.random() * 20; // Sea greens
        } else {
          baseHue = 120 + Math.random() * 15; // Cool forest greens
        }
        endHue = baseHue + (Math.random() - 0.5) * 25;
      } else {
        // 45% BLUES including lots of ROYAL BLUE (200-270 degrees)
        const blueVariant = Math.random();
        if (blueVariant < 0.2) {
          baseHue = 200 + Math.random() * 15; // Sky blue
        } else if (blueVariant < 0.6) {
          baseHue = 220 + Math.random() * 25; // Royal blue (heavy emphasis)
        } else if (blueVariant < 0.8) {
          baseHue = 245 + Math.random() * 15; // Deep blue
        } else {
          baseHue = 260 + Math.random() * 10; // Blue-purple
        }
        endHue = baseHue + (Math.random() - 0.5) * 30;
      }
      
      const baseSizeVariation = 0.95 + Math.random() * 0.1;
      const size = (0.65 + Math.random() * 0.2) * baseSizeVariation;
      
      const rotation = arcDirection * (25 + Math.random() * 35);
      
      const baseOpacity = 0.8 + Math.random() * 0.15;
      
      const newStar: ShootingStar = {
        id,
        icon,
        startX,
        arcDirection,
        arcStrength,
        animationDuration,
        delay: 0,
        baseHue,
        endHue,
        size,
        rotation,
        baseOpacity
      };

      setShootingStars(prev => [...prev, newStar]);

      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== id));
      }, animationDuration * 1000);
    };

    // Initial stars
    Array.from({ length: 12 }, (_, i) => {
      setTimeout(() => createShootingStar(), i * 250);
    });

    const interval = setInterval(() => {
      setShootingStars(current => {
        if (current.length < 6) {
          setTimeout(() => createShootingStar(), 50);
          setTimeout(() => createShootingStar(), 400);
          if (current.length < 4) {
            setTimeout(() => createShootingStar(), 700);
          }
        } else if (current.length < 10) {
          createShootingStar();
          if (Math.random() < 0.8) {
            setTimeout(() => createShootingStar(), 500);
          }
        } else if (current.length < 12 && Math.random() < 0.7) {
          createShootingStar();
        }
        return current;
      });
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [mounted]);

  return shootingStars;
};
