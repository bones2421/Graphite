import React, { useState, useEffect } from 'react';
import './App.css';

const animations = ['bounce', 'slide', 'fade'];

const App = () => {
  const [animation, setAnimation] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * animations.length);
    setAnimation(animations[randomIndex]);
  }, []);

  return (
    <div className={`App ${animation}`}>
      <h1>Hello, world:</h1>
    </div>
  );
};

export default App;


