import React, { useState, useEffect } from 'react';
import IntroAnimation from './components/IntroAnimation';
import Terminal from './components/Terminal';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  
  useEffect(() => {
    // After 4 seconds, transition to terminal
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container">
      {showIntro ? (
        <IntroAnimation onComplete={() => setShowIntro(false)} />
      ) : (
        <Terminal />
      )}
    </div>
  );
}

export default App;