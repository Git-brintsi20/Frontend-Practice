import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import NavBar from '../components/NavBar';
import '../styles/JourneyPath.css';

const journeySteps = [
  {
    title: "The Beginning of Your Special Day",
    description: "Today is all about you! Select your favorite BTS member to personalize your journey.",
    position: 0,
    isSelectionStep: true
  },
  {
    title: "A Taste of Purple",
    description: "Do you know what 'Borahae' means? In BTS language, it's 'I purple you' - meaning I'll love and trust you for a long time. That's how we feel about you - our special friend deserves all the purple love in the world!",
    position: 33
  },
  {
    title: "Almost There",
    description: "You've almost reached your destination! Jin and JK would be proud of how patient you've been. Just one more step and your special birthday surprise will be revealed.",
    position: 66
  },
  {
    title: "Your BTS Birthday Gift",
    description: "Here it is! A heartfelt letter and a BTS music experience created just for you. Click 'Reveal Surprise' to see what awaits!",
    position: 100
  }
];

const FloatingPhotos = ({ theme }) => {
  const photos = [
    { src: "/assets/images/bts/jk/jk-profile.jpeg", size: 100, top: 10, left: 5, rotate: -8 },
    { src: "/assets/images/bts/jin/jin-profile.jpeg", size: 110, top: 85, left: 80, rotate: 6 },
    { src: "/assets/images/bts/jk/album-art.jpeg", size: 90, top: 75, left: 10, rotate: 4 },
    { src: "/assets/images/bts/jin/album-art.jpeg", size: 95, top: 15, left: 85, rotate: -10 }
  ];

  return (
    <>
      {photos.map((photo, index) => (
        <motion.div
          key={index}
          className="floating-photo"
          style={{
            width: `${photo.size}px`,
            height: `${photo.size}px`,
            top: `${photo.top}%`,
            left: `${photo.left}%`,
            position: 'absolute',
            perspective: '1000px',
            border: `2px solid ${theme.primary}`
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            rotate: photo.rotate
          }}
          transition={{ 
            delay: 0.5 + index * 0.5, // Reduced delay: 0.5s base + 0.5s per photo
            duration: 6, // Reduced duration for faster animation
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <img src={photo.src} alt="BTS Memory" style={{ width: '100%', height: '100%' }} />
        </motion.div>
      ))}
    </>
  );
};

const BTSSymbols = ({ theme }) => {
  const symbols = ['💜', '⭐', '✨', '🎵', '🎂'];
  const elements = [];
  const numberOfElements = 15;

  for (let i = 0; i < numberOfElements; i++) {
    const initialX = Math.random() * 100;
    const initialY = Math.random() * 100;
    const delay = Math.random() * 3; // Reduced max delay to 3s
    const size = 20 + Math.random() * 20;

    elements.push(
      <motion.div
        key={i}
        className="bts-symbol"
        initial={{ left: `${initialX}%`, top: `${initialY}%`, opacity: 0.6 }}
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          delay,
          duration: 4 + Math.random() * 2, // Reduced duration to 4-6s
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          fontSize: `${size}px`,
          color: theme.primary,
          zIndex: 2
        }}
      >
        {symbols[i % symbols.length]}
      </motion.div>
    );
  }

  return <div className="bts-symbols-container">{elements}</div>;
};

const JourneyPath = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeMember, setActiveMember] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const { theme, changeThemeNew } = useTheme();

  useEffect(() => {
    if (currentStep === 0 || journeySteps[currentStep].isSelectionStep) {
      return;
    }

    if (currentStep < journeySteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(current => current + 1);
      }, 8000); // Reduced to 8 seconds for each step
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000); // Reduced confetti duration to 6s
    }
  }, [currentStep, activeMember]);

  const handleThemeChange = (memberName) => {
    setActiveMember(memberName);
    changeThemeNew(memberName);
  };

  const handleContinue = () => {
    if (currentStep === 0 && !activeMember) {
      alert("Please select a BTS member to personalize your journey!");
      return;
    }

    if (currentStep < journeySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/letter', { state: { selectedMember: activeMember } });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentJourneyStep = journeySteps[currentStep];

  return (
    <div className="journey-container" style={{ background: theme.gradient || `linear-gradient(135deg, ${theme.background}, ${theme.primary}22)` }}>
      <NavBar />
      <div className="navbar-spacer"></div>
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`, // Reduced confetti fall duration
                animationDelay: `${Math.random() * 1}s`, // Reduced delay range
                backgroundColor: i % 5 === 0 ? theme.primary : 
                               i % 5 === 1 ? theme.accent : 
                               i % 5 === 2 ? '#fff' : 
                               i % 5 === 3 ? '#ffcd00' : '#ff69b4'
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="background-text">BTS</div>

      <FloatingPhotos theme={theme} />
      <BTSSymbols theme={theme} />

      <div className="path-container">
        <motion.div
          className="path-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }} // Reduced duration to 0.8s, delay to 0.4s
          key={currentStep}
        >
          <h2 className="title" style={{ color: theme.primary }}>{currentJourneyStep.title}</h2>
          <p className="description">{currentJourneyStep.description}</p>

          {currentJourneyStep.isSelectionStep && (
            <div className="member-selection-container">
              <motion.div
                className={`member-card ${activeMember === 'jungkook' ? 'active' : ''}`}
                onClick={() => handleThemeChange('jungkook')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }} // Faster hover/tap transition
              >
                <img src="/assets/images/bts/jk/jk-profile.jpeg" alt="Jungkook" />
                <h3>Jungkook</h3>
              </motion.div>

              <motion.div
                className={`member-card ${activeMember === 'default' ? 'active' : ''}`}
                onClick={() => handleThemeChange('default')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <img src="/assets/images/bts/group/bts-main.jpeg" alt="BTS" />
                <h3>All BTS</h3>
              </motion.div>

              <motion.div
                className={`member-card ${activeMember === 'jin' ? 'active' : ''}`}
                onClick={() => handleThemeChange('jin')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <img src="/assets/images/bts/jin/jin.png" alt="Jin" />
                <h3>Jin</h3>
              </motion.div>
            </div>
          )}

          <div className="navigation-buttons">
            {currentStep > 0 && (
              <motion.button
                className="button back-button"
                onClick={handleBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                Back
              </motion.button>
            )}

            <motion.button
              className="button continue-button"
              onClick={handleContinue}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 ? 'Select & Continue' : currentStep === journeySteps.length - 1 ? 'Reveal Surprise' : 'Continue'}
            </motion.button>
          </div>
        </motion.div>

        <div className="path-navigation">
          {journeySteps.map((step, index) => (
            <motion.div
              key={index}
              className={`path-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              onClick={() => setCurrentStep(index)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.5 }} // Reduced duration to 0.8s, delay to 0.5s per step
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-title">{step.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JourneyPath;