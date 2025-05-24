import React, { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';
import './IntroAnimation.css';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [text, setText] = useState("");
  const fullText = "Hi, I'm Suhani Pugalia";
  const [showCursor, setShowCursor] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        
        // After typing is complete, wait a bit then start transition
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 1000); // Transition after fade out animation
        }, 1500);
      }
    }, 100);

    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [onComplete, fullText]);

  return (
    <div className={`intro-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="intro-content">
        <h1 className="intro-text">
          {text}
          <span className={`cursor ${showCursor ? 'visible' : 'hidden'}`}>|</span>
        </h1>
        <Terminal className="terminal-icon" size={48} />
      </div>
      <div className="color-blocks">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="color-block"
            style={{ 
              animationDelay: `${i * 0.1}s`,
              backgroundColor: `hsl(${(i * 25) % 360}, 100%, 65%)`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default IntroAnimation;