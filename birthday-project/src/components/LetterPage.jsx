import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/LetterPage.css';

const letterContents = {
  default: {
    greeting: "To My Dearest Sunshine Soul on her Birthday ✨",
    body: `You recently wrote to me something that I've read and re-read—something that felt like a warm hug wrapped in words. It's honestly one of the kindest, most heartfelt things anyone has ever written for me. And today, on your birthday, I want to try and give you even a fraction of that same warmth back. I know I might stumble with words as I'm in a rush now, but I'll still try, because you are worth it.

From the very first semester, you've been someone I looked at and thought—"Wow, she's just... light." You give so much. So effortlessly. And with that rare kind of gentleness that isn't loud, but lingers. You're not just a kind person, you're an endlessly giving one. You've always been on the giving side of everything—friendships, time, energy, care. You never ask for anything in return.

But my dear, you have to know—true love, the purest kind, starts with loving yourself first. I've told you this before and I'll say it again....the way you care for others should also reflect in how you care for yourself. You've changed so much since we met, and it fills me with pride to see that. But there's still a little more to go—and that's not a flaw. That's just the magic of being in progress.

When I think of you, I don't just see a friend—I see someone who's a walking BTS playlist. A Jungkook-biased, J-Hope-wrapped sunshine soul who radiates music even in silence. You are "Still With You" to me, always there even when we don't speak. You're "Epiphany" in action, slowly learning, slowly blooming into the version of you that sees herself the way we see her. Your tears are "Blue and Grey" but your heart is full of colors most people don't even know exist.

And my god—how you dance. How you sing. So freely, so confidently, so beautifully. I watch you and wonder how a person can hold so much art in them and so much girliness in them and yet act like a Bf material..Haha. And I love it. I love every quirky, sexy, graceful bit of it. It's you. And I don't think you realize how magnetic that is.

About that April prank thing—let's just close that page now. What we had before, what we still have—it matters way more than that tiny bump. I'm still the same Harshita, just a slightly more sleep-deprived, lil stressed version thanks to the exam season. And I know you might've felt some distance lately, but please don't overthink it. Everyone's just finding their space, including me. But love and friendship? That doesn't change and go to the ruins just like that.

Now coming to the best part: Happy Birthday, My Beautiful Girl!
Today is your day—your own spotlight moment in the movie of your life. So forget the semester stress for a while, dress up, ting-ting your way into the day like I did on mine, wear your favorite smile and maybe a little lip tint if you feel it (a lip balm is a must, I give u no choice). If I could bake you a cake today, I would, but consider this letter a slice of my heart instead. But I will bake you one, randomly, one day—I promise.

Even if I can't dance with you today or match your high-energy party vibes, know that I'm celebrating you in my heart. Just go out there and have the best time. Eat your favorite food. Listen to your comfort songs. Let BTS guide your playlist—maybe start with Life Goes On because that's exactly what we all need to believe in now.

And when you feel overwhelmed, just remember: you are not here by mistake. You're not stuck. You're growing. Everything begins with you, and everything will be okay. I promise. Just keep that smile on. The world gets warmer when you do.`,
    closing: "Saranghae. Borahae. I Purple You. Always.",
    signature: "With so much love, Your Sweetie."
  },
  jungkook: {
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
  const location = useLocation();
  const { theme, themeMode, changeThemeNew } = useTheme();
  const { playTrack, pauseTrack, trackList } = useAudio();
  const [isRevealed, setIsRevealed] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const letterRef = useRef(null);

  useEffect(() => {
    const selectedMember = location.state?.selectedMember || 'default';
    if (selectedMember !== themeMode) {
      changeThemeNew(selectedMember);
    }
  }, [location.state, themeMode, changeThemeNew]);

  const letterContent = letterContents[themeMode] || letterContents.default;

  useEffect(() => {
    if (!trackList.length) {
      return;
    }

    let selectedTrack = null;
    if (themeMode === 'jungkook') {
      selectedTrack = trackList.find(track => track.artists?.some(artist => artist.name === 'Jungkook'));
    } else if (themeMode === 'jin') {
      selectedTrack = trackList.find(track => track.artists?.some(artist => artist.name === 'Jin'));
    } else {
      selectedTrack = trackList[0]; // Fallback to first track
    }

    if (selectedTrack) {
      playTrack(selectedTrack.id);
    }

    return () => {
      pauseTrack();
    };
  }, [themeMode, playTrack, pauseTrack, trackList]);

  const revealLetter = () => {
    setIsRevealed(true);
    setConfetti(true);
    setTimeout(() => {
      letterRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
    setTimeout(() => {
      setConfetti(false);
    }, 5000);
  };

  const goToMusicRoom = () => {
    navigate('/music-room', { state: { selectedMember: themeMode } });
  };

  // Fallback UI in case theme is undefined
  if (!theme) {
    return <div style={{ color: 'white', textAlign: 'center' }}>Loading theme...</div>;
  }

  return (
    <div 
      className="letter-page" 
      style={{ 
        background: theme.gradient || `linear-gradient(to bottom, ${theme.background || '#F5F5F5'}, ${theme.primary || '#E1BEE7'}22)`,
        fontFamily: theme.fontFamily || "'Poppins', sans-serif"
      }}
    >
      {confetti && (
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => ( // Reduced to 20 for performance
            <div 
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: i % 5 === 0 ? theme.primary || '#E1BEE7' : 
                               i % 5 === 1 ? theme.accent || '#CE93D8' : 
                               i % 5 === 2 ? '#fff' : 
                               i % 5 === 3 ? '#ffcd00' : '#ff69b4'
              }}
            />
          ))}
        </div>
      )}
      
      <motion.div
        className="letter-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!isRevealed ? (
          <div className="envelope-container">
            <motion.div 
              className="envelope"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                borderColor: theme.primary || '#E1BEE7',
                backgroundColor: theme.secondary || '#F3E5F5'
              }}
            >
              <div className="envelope-flap" />
              <div 
                className="envelope-content"
                style={{ color: theme.text || '#4A148C' }}
              >
                <h2>A Special Birthday Message</h2>
                <p>Click to open</p>
              </div>
              <button 
                className="open-button"
                onClick={revealLetter}
                style={{
                  backgroundColor: theme.primary || '#E1BEE7',
                  color: theme.secondary || '#F3E5F5'
                }}
              >
                Open Letter
              </button>
            </motion.div>
          </div>
        ) : (
          <motion.div 
            className="letter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            ref={letterRef}
            style={{
              backgroundColor: theme.secondary || '#F3E5F5',
              color: theme.text || '#4A148C',
              boxShadow: `0 5px 15px rgba(0,0,0,0.1), 0 0 0 3px ${theme.primary || '#E1BEE7'}33`
            }}
          >
            <div className="letter-content">
              <div className="letter-header">
                <img 
                  src={
                    themeMode === 'jungkook' ? "/assets/images/bts/jk/jk-profile.jpeg" :
                    themeMode === 'jin' ? "/assets/images/bts/jin/jin-profile.jpeg" :
                    "/assets/images/bts/bts-main.jpeg"
                  }
                  alt="BTS"
                  className="letter-image"
                />
              </div>
              
              <div className="letter-body">
                <h2 className="letter-greeting" style={{ color: theme.primary || '#E1BEE7' }}>
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
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  backgroundColor: theme.primary || '#E1BEE7',
                  color: theme.secondary || '#F3E5F5'
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