import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';

const JourneyContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-color), var(--primary-color) 70%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const PathContainer = styled.div`
  width: 80%;
  max-width: 800px;
  position: relative;
  z-index: 10;
`;

const PathLine = styled(motion.div)`
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  border-radius: 10px;
  margin: 50px 0;
  position: relative;
`;

const PathPoint = styled(motion.div)`
  width: 40px;
  height: 40px;
  background-color: var(--accent-color);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: ${props => props.$position}%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  z-index: 2;

  &::before {
    content: '${props => props.$number}';
    color: white;
    font-weight: bold;
  }
`;

const PathContent = styled(motion.div)`
  padding: 30px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: var(--primary-color);
  margin-bottom: 15px;
`;

const Description = styled.p`
  margin-bottom: 20px;
  line-height: 1.7;
`;

const ContinueButton = styled(motion.button)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 30px;
  font-size: 1.1rem;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  margin-top: 20px;

  &:hover {
    background-color: var(--accent-color);
  }
`;

const FloatingPhoto = styled(motion.div)`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 1;
  top: ${props => props.$top}%;
  left: ${props => props.$left}%;
  transform: rotate(${props => props.$rotate}deg);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BackgroundText = styled.div`
  position: absolute;
  font-size: 250px;
  font-weight: 900;
  opacity: 0.05;
  color: var(--primary-color);
  pointer-events: none;
  transform: rotate(-10deg);
  right: -50px;
  bottom: -50px;

  @media (max-width: 768px) {
    font-size: 150px;
  }
`;

const MemberSelectionContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  z-index: 10; /* Ensure it's above the path */
`;

const MemberCard = styled.div`
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    display: block;
  }

  h3 {
    text-align: center;
    padding: 10px;
    margin: 0;
    background-color: white;
    color: var(--primary-color);
    font-size: 1rem;
  }

  &.active {
    border: 2px solid var(--accent-color);
  }
`;

const journeySteps = [
  {
    title: "The Beginning of Your Special Day",
    description: "Today is all about you! Select your favorite BTS member to personalize your journey.",
    position: 0,
    isSelectionStep: true // Mark this as the theme selection step
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
    description: "Here it is! A heartfelt letter and a BTS music experience created just for you. Click 'Continue' to see what awaits!",
    position: 100
  }
];

const FloatingPhotos = () => {
  const photos = [
    { src: "/assets/images/bts/jk/jk-profile.jpeg", size: 120, top: 15, left: 10, rotate: -10 },
    { src: "/assets/images/bts/jin/jin-profile.jpeg", size: 150, top: 70, left: 85, rotate: 8 },
    { src: "/assets/images/bts/jk/album-art.jpeg", size: 140, top: 80, left: 20, rotate: 5 },
    { src: "/assets/images/bts/jin/album-art.jpeg", size: 130, top: 20, left: 80, rotate: -12 }
  ];

  return (
    <>
      {photos.map((photo, index) => (
        <FloatingPhoto
          key={index}
          $size={photo.size}
          $top={photo.top}
          $left={photo.left}
          $rotate={photo.rotate}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.2 }}
        >
          <img src={photo.src} alt="BTS Memory" />
        </FloatingPhoto>
      ))}
    </>
  );
};

const JourneyPath = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeMember, setActiveMember] = useState('default'); // Default to all BTS
  const navigate = useNavigate();
  const { setThemeMode } = useTheme();

  useEffect(() => {
    // Auto-progress through steps, but skip the selection step
    if (currentStep < journeySteps.length - 1 && !journeySteps[currentStep].isSelectionStep) {
      const timer = setTimeout(() => {
        setCurrentStep(current => current + 1);
      }, 5000); // Progress every 5 seconds

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleContinue = () => {
    if (currentStep < journeySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/letter');
    }
  };

  const handleThemeChange = (memberName) => {
    setActiveMember(memberName);
    setThemeMode(memberName);
    // After selecting a member, progress to the next step
    if (journeySteps[currentStep].isSelectionStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const currentJourneyStep = journeySteps[currentStep];

  return (
    <JourneyContainer>
      <BackgroundText>BTS</BackgroundText>

      <FloatingPhotos />

      <PathContainer>
        <PathContent
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          key={currentStep}
        >
          <Title>{currentJourneyStep.title}</Title>
          <Description>{currentJourneyStep.description}</Description>

          {currentJourneyStep.isSelectionStep && (
            <MemberSelectionContainer>
              <MemberCard
                className={activeMember === 'jk' ? 'active' : ''}
                onClick={() => handleThemeChange('jk')}
              >
                <img src="/assets/images/bts/jk/jk-profile.jpeg" alt="Jungkook" />
                <h3>Jungkook</h3>
              </MemberCard>

              <MemberCard
                className={activeMember === 'jin' ? 'active' : ''}
                onClick={() => handleThemeChange('jin')}
              >
                <img src="/assets/images/bts/jin/jin-profile.jpeg" alt="Jin" />
                <h3>Jin</h3>
              </MemberCard>

              <MemberCard
                className={activeMember === 'default' ? 'active' : ''}
                onClick={() => handleThemeChange('default')}
              >
                <img src="/assets/images/bts/bts-main.jpeg" alt="BTS" />
                <h3>All BTS</h3>
              </MemberCard>
            </MemberSelectionContainer>
          )}

          {!currentJourneyStep.isSelectionStep && (
            <ContinueButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
            >
              Continue
            </ContinueButton>
          )}
        </PathContent>

        <PathLine
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2 }}
        >
          {journeySteps.map((step, index) => (
            <PathPoint
              key={index}
              $position={step.position}
              $number={index + 1}
              initial={{ scale: 0 }}
              animate={{ scale: index <= currentStep ? 1 : 0 }}
              transition={{ delay: index * 0.2 }}
              onClick={() => index <= currentStep && setCurrentStep(index)}
            />
          ))}
        </PathLine>
      </PathContainer>
    </JourneyContainer>
  );
};

export default JourneyPath;