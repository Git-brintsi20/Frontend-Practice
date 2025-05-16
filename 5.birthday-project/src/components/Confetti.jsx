import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#8a7de0', '#ff0080', '#00bfff', '#ffd700', '#50c878', '#ff6b6b', '#8e44ad'];

const Confetti = ({ count = 100, active = false }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * windowWidth,
      y: -20 - Math.random() * 100, // Start above the screen
      size: 5 + Math.random() * 15,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      velocity: {
        x: Math.random() * 6 - 3, // -3 to 3
        y: 2 + Math.random() * 5,  // 2 to 7
        rotation: Math.random() * 10 - 5 // -5 to 5
      },
      shape: Math.random() > 0.3 ? 'rectangle' : 'circle' // 70% rectangles, 30% circles
    }));
    
    setParticles(newParticles);
    
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Update position
          let newX = particle.x + particle.velocity.x;
          let newY = particle.y + particle.velocity.y;
          let newRotation = particle.rotation + particle.velocity.rotation;
          
          // Reset if it goes out of bounds
          if (newY > windowHeight + 50) {
            newY = -20;
            newX = Math.random() * windowWidth;
          }
          
          if (newX < -50) newX = windowWidth + 30;
          if (newX > windowWidth + 50) newX = -30;
          
          return {
            ...particle,
            x: newX,
            y: newY,
            rotation: newRotation
          };
        })
      );
    };
    
    const interval = setInterval(animateParticles, 30);
    
    return () => clearInterval(interval);
  }, [active, count]);
  
  if (!active) return null;
  
  return (
    <div className="confetti-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.shape === 'rectangle' ? particle.size : particle.size * 0.6,
            height: particle.shape === 'rectangle' ? particle.size * 0.3 : particle.size * 0.6,
            backgroundColor: particle.color,
            borderRadius: particle.shape === 'circle' ? '50%' : '0',
            rotate: `${particle.rotation}deg`,
            opacity: Math.random() * 0.4 + 0.6, // 0.6 to 1
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
            zIndex: 1000
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;