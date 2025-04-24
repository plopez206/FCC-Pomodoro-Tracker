import { useEffect, useState, useRef } from 'react';
import './App.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa6';
import 'bootstrap/dist/css/bootstrap.min.css';
import beepSound from './assets/nokia_alarma.mp3';

function App() {
  const [settings, setSettings] = useState({
    session: 25,
    breakTime: 5,
  });
  const [secondsLeft, setSecondsLeft] = useState<number>(settings.session * 60);
  const [isSession, setIsSession] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const beepAudio = useRef(new Audio(beepSound));
  const intervalRef = useRef<number | null>(null);
  const isSessionRef = useRef(isSession);

  useEffect(() => {
    isSessionRef.current = isSession;
  }, [isSession]);

  const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (prev === 0) {
            beepAudio.current.play();
            const newIsSession = !isSessionRef.current;
            setIsSession(newIsSession);
            return newIsSession ? settings.session * 60 : settings.breakTime * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, settings]);

  // Actualiza el temporizador inmediatamente al modificar el tiempo
  useEffect(() => {
    setSecondsLeft(isSession ? settings.session * 60 : settings.breakTime * 60);
  }, [settings, isSession]);

  const handleSkip = () => {
    beepAudio.current.play();
    const newIsSession = !isSession;
    setIsSession(newIsSession);
    setSecondsLeft(newIsSession ? settings.session * 60 : settings.breakTime * 60);
  };

  return (
    <div id="app-container">
      <div id="clock-container">
        <h1>Pomodoro Clock</h1>
        <div id="break-container">
          <div id="break-label">Break Length</div>
          <div className="controls">
            <button
              id="break-decrement"
              onClick={() =>
                setSettings(prev => ({ 
                  ...prev, 
                  breakTime: Math.max(1, prev.breakTime - 1) 
                }))
              }
            >
              <FaArrowDown />
            </button>
            <div id="break-length">{settings.breakTime}</div>
            <button
              id="break-increment"
              onClick={() =>
                setSettings(prev => ({ 
                  ...prev, 
                  breakTime: Math.min(60, prev.breakTime + 1) 
                }))
              }
            >
              <FaArrowUp />
            </button>
          </div>
        </div>
        <div id="session-container">
          <div id="session-label">Session Length</div>
          <div className="controls">
            <button
              id="session-decrement"
              onClick={() =>
                setSettings(prev => ({ 
                  ...prev, 
                  session: Math.max(1, prev.session - 1) 
                }))
              }
            >
              <FaArrowDown />
            </button>
            <div id="session-length">{settings.session}</div>
            <button
              id="session-increment"
              onClick={() =>
                setSettings(prev => ({ 
                  ...prev, 
                  session: prev.session + 1 
                }))
              }
            >
              <FaArrowUp />
            </button>
          </div>
        </div>
        <div
          id="timer-container"
          style={{ 
            backgroundColor: isSession ? '#4DA8DA' : '#1ABC9C', 
            border: `5px solid ${isRunning ? 'rgb(28,146,63)' : 'red'}`,
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div id="timer-label">{isSession ? "Session" : "Break"}</div>
          <div id="time-left">{formatTime(secondsLeft)}</div>
        </div>
        <div id="control-center">
          <button id="start_stop" className="start-btn" onClick={() => setIsRunning(prev => !prev)}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button id="skip" className="skip-btn" onClick={handleSkip}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
