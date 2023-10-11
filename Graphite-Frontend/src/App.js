import React, { useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    audio.addEventListener('play', () => {
      audioContext.resume().then(() => {
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
          const WIDTH = canvas.width;
          const HEIGHT = canvas.height;
          requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);

          ctx.fillStyle = 'rgb(0, 0, 0)';
          ctx.fillRect(0, 0, WIDTH, HEIGHT);

          const barWidth = (WIDTH / bufferLength) * 2.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
            ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth + 1;
          }
        };
        draw();
      });
    });
  }, []);

  return (
    <div className="App">
      <canvas ref={canvasRef} width="800" height="400"></canvas>
      <audio ref={audioRef} controls>
        <source src="music.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
};

export default App;
