/**
 * Common animation variants for Framer Motion
 */

/**
 * Fading Animations
 */
// Fade in animation with a smoother duration and easing
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.8, // Slightly longer for smoother fade
      ease: "easeInOut" 
    }
  }
};

/**
 * Sliding Animations
 */
// Slide up animation with adjusted stiffness for a softer bounce
export const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 200, // Reduced stiffness for a gentler spring
      damping: 25, // Slightly reduced damping for a smoother effect
      mass: 0.8 // Added mass for a more natural feel
    }
  }
};

// Slide in from left with a subtle easing
export const slideInLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 25,
      mass: 0.8
    }
  }
};

// Slide in from right with a subtle easing
export const slideInRight = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 25,
      mass: 0.8
    }
  }
};

/**
 * Scaling and Popping Animations
 */
// Scale up animation with a more pronounced effect
export const scaleUp = {
  hidden: { scale: 0.7, opacity: 0 }, // Start from a smaller scale for more impact
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 250, 
      damping: 20,
      mass: 0.5 // Lighter mass for a quicker scale
    }
  }
};

// Pop animation for buttons with a slight rotation
export const popAnimation = {
  tap: { scale: 0.95, rotate: 2 }, // Added a subtle rotation on tap
  hover: { scale: 1.05, rotate: -2 } // Rotate in opposite direction on hover
};

/**
 * Staggered Animations
 */
// Staggered container animation with a slight delay adjustment
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Slightly faster stagger for better flow
      delayChildren: 0.2 // Reduced delay for quicker start
    }
  }
};

// Staggered child item with a softer spring
export const staggerItem = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
      mass: 0.8
    }
  }
};

/**
 * Page and Text Animations
 */
// Page transitions with a smoother easing
export const pageTransition = {
  initial: { opacity: 0, y: 20 }, // Added a slight upward slide
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }, // Slide down on exit
  transition: { duration: 0.6, ease: "easeInOut" } // Smoother easing
};

// Letter animation for text with a bouncier effect
export const letterAnimation = {
  hidden: { opacity: 0, y: 50 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: i * 0.05
    }
  })
};

/**
 * Floating and Pulsing Animations
 */
// Floating animation with a more dynamic range
export const floatingAnimation = {
  animate: {
    y: [0, -15, 0], // Increased range for more noticeable float
    rotate: [0, 2, -2, 0], // Added a subtle rotation for liveliness
    transition: {
      duration: 4, // Slightly longer for a more relaxed float
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

// BTS-themed pulse animation with a softer glow
export const btsPulse = {
  animate: {
    scale: [1, 1.03, 1], // Reduced scale for a subtler pulse
    boxShadow: [
      "0px 0px 0px rgba(138, 125, 224, 0)",
      "0px 0px 15px rgba(138, 125, 224, 0.5)", // Softer glow
      "0px 0px 0px rgba(138, 125, 224, 0)"
    ],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

/**
 * New Animations
 */
// Rotate animation for subtle spinning effects
export const rotateAnimation = {
  animate: {
    rotate: [0, 360],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Heartbeat animation for lively elements
export const heartbeatAnimation = {
  animate: {
    scale: [1, 1.1, 1, 1.05, 1], // Mimics a heartbeat rhythm
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};