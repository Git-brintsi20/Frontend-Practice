// LetterPage.jsx - Fixed version
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/LetterPage.css';

// These can be customized based on the theme
const letterContents = {
  default: {
    greeting: "Dear ARMY Friend,",
    body: `Today is your special day, and we wanted to celebrate it BTS-style! 

As BTS always says, "You never walk alone." We hope this little gift brings you happiness and reminds you of the connection we share through our love for BTS.

The music, the message, the moments - BTS has brought so many people together, and we're grateful to have you as part of this amazing journey.

Remember Jin's wise words: "You live only once, so do what you want." We hope your birthday is filled with everything that brings you joy.

And as Jungkook would say, "Let's not push ourselves too hard. Let's believe in ourselves. Fighting!"

Happy Birthday! 생일 축하해요!`,
    closing: "With purple love,",
    signature: "Your ARMY Family 💜"
  },
  jk: {
    greeting: "Dear ARMY,",
    body: `Today is your day! I hope it's as golden as our maknae's voice.

Jungkook always says, "I'd rather die than not be able to perform on stage." That's how passionate he is about bringing joy to others - just like we want to bring joy to you on your birthday!

Your determination and spirit remind me of Jungkook's endless energy and talent. Whether it's dancing, singing, or just being the lovable bunny that he is, JK puts his whole heart into everything.

As you celebrate another year, remember what Jungkook told us: "Even if you're not perfect, you're limited edition." There's only one you, and that's something to celebrate!

Happy Birthday! 생일 축하해요!`,
    closing: "Golden vibes only,",
    signature: "Your ARMY Family 💜"
  },
  jin: {
    greeting: "Dear ARMY,",
    body: `Happy Worldwide Handsome Birthday to you! (Jin would approve of this greeting!)

As our Jin-hyung would say, "You know what? I'm worldwide handsome, you know?" And today, on your birthday, you're the worldwide handsome/beautiful one!

Jin always brings laughter and joy with his dad jokes and windshield-wiper laugh. We hope your day is filled with just as much happiness and laughter.

Remember Jin's words: "When things get tough, remember that you have the strength to get through it." His resilience and positivity are qualities we admire in you too.

Eat well today! Jin would want you to enjoy some good food on your special day.

Happy Birthday! 생일 축하해요!`,
    closing: "With worldwide handsome energy,",
    signature: "Your ARMY Family 💜"
  }
};

const LetterPage = () => {
  const navigate = useNavigate();
  // Use the updated theme context with both old and new properties
  const { theme, themeMode } = useTheme();
  const { playTrack, pauseTrack } = useAudio();
  const [isRevealed, setIsRevealed] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const letterRef = useRef(null);
  
  // Get the correct letter content based on theme
  const letterContent = letterContents[themeMode] || letterContents.default;
  
  // Play background music on component mount
  useEffect(() => {
    // Choose music based on theme
    let trackId = '2FugYpDRl2aVGb5YK6L1Kr'; // Default BTS song (Life Goes On)
    
    if (themeMode === 'jk') {
      trackId = '0WNGsQ1oAuHzNTk8jivBKW'; // Jungkook song (Still With You)
    } else if (themeMode === 'jin') {
      trackId = '5nTnCfI5oIWR9InXG3caP5'; // Jin song (Epiphany)
    }
    
    // Play the track
    playTrack(trackId);
    
    // Clean up function to pause music when component unmounts
    return () => {
      pauseTrack();
    };
  }, [themeMode, playTrack, pauseTrack]);
  
  const revealLetter = () => {
    setIsRevealed(true);
    setConfetti(true);
    
    // Scroll to the letter content
    setTimeout(() => {
      letterRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
    
    // Stop confetti after 5 seconds
    setTimeout(() => {
      setConfetti(false);
    }, 5000);
  };
  
  const goToMusicRoom = () => {
    navigate('/music-room');
  };
  
  return (
    <div 
      className="letter-page" 
      style={{ 
        background: theme.gradient || `linear-gradient(to bottom, ${theme.background}, ${theme.primary}22)`,
        fontFamily: theme.fontFamily
      }}
    >
      {confetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: i % 5 === 0 ? theme.primary : 
                               i % 5 === 1 ? theme.accent : 
                               i % 5 === 2 ? '#fff' : 
                               i % 5 === 3 ? '#ffcd00' : '#ff69b4'
              }}
            ></div>
          ))}
        </div>
      )}
      
      <motion.div
        className="letter-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {!isRevealed ? (
          <div className="envelope-container">
            <motion.div 
              className="envelope"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                borderColor: theme.primary,
                backgroundColor: theme.secondary
              }}
            >
              <div className="envelope-flap"></div>
              <div 
                className="envelope-content"
                style={{ color: theme.text }}
              >
                <h2>A Special Birthday Message</h2>
                <p>Click to open</p>
              </div>
              <button 
                className="open-button"
                onClick={revealLetter}
                style={{
                  backgroundColor: theme.primary,
                  color: theme.secondary
                }}
              >
                Open Letter
              </button>
            </motion.div>
          </div>
        ) : (
          <motion.div 
            className="letter"
            initial={{ opacity: 0, y: 30, rotateZ: 5 }}
            animate={{ opacity: 1, y: 0, rotateZ: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            ref={letterRef}
            style={{
              backgroundColor: theme.secondary,
              color: theme.text,
              boxShadow: `0 10px 30px rgba(0,0,0,0.1), 0 0 0 5px ${theme.primary}33`
            }}
          >
            <div className="letter-content">
              <div className="letter-header">
                <img 
                  src={
                    themeMode === 'jk' ? "/assets/images/bts/jk/jk-profile.jpeg" :
                    themeMode === 'jin' ? "/assets/images/bts/jin/jin-profile.jpeg" :
                    "/assets/images/bts/bts-main.jpeg"
                  }
                  alt="BTS"
                  className="letter-image"
                />
              </div>
              
              <div className="letter-body">
                <h2 className="letter-greeting" style={{ color: theme.primary }}>
                  {letterContent.greeting}
                </h2>
                
                <p className="letter-message">
                  {letterContent.body}
                </p>
                
                <p className="letter-closing">
                  {letterContent.closing}<br/>
                  <span className="signature">{letterContent.signature}</span>
                </p>
              </div>
              
              <motion.button
                className="music-room-button"
                onClick={goToMusicRoom}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  backgroundColor: theme.primary,
                  color: theme.secondary
                }}
              >
                Go to Music Room
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LetterPage;