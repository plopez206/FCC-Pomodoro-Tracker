import { useEffect, useState, useRef } from 'react';
import './App.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
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
    if (!isRunning) {
      setSecondsLeft(isSession ? settings.session * 60 : settings.breakTime * 60);
    }
  }, [settings, isSession, isRunning]);

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

  const handleReset = () => {
    setSettings({ session: 25, breakTime: 5 });
    setSecondsLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);

    beepAudio.current.pause();
    beepAudio.current.currentTime = 0;
  };

  return (
    <div id="app-container">
      <div id="clock-container" className="row">
        <h1>Pomodoro Clock</h1>
        <div id="break-container" className="row col-6">
          <div id="break-label" className="col-12">Break Length</div>
          <button id="break-decrement" className="btn col-4" onClick={() =>
            setSettings(prev => ({ ...prev, breakTime: Math.max(1, prev.breakTime - 1) }))
          }>
            <FaArrowDown />
          </button>
          <div id="break-length" className="col-4">{settings.breakTime}</div>
          <button id="break-increment" className="btn col-4" onClick={() =>
            setSettings(prev => ({ ...prev, breakTime: Math.min(60, prev.breakTime + 1) }))
          }>
            <FaArrowUp />
          </button>
        </div>
        <div id="session-container" className="row col-6">
          <div id="session-label">Session Length</div>
          <button id="session-decrement" className="btn col-4" onClick={() =>
            setSettings(prev => ({ ...prev, session: Math.max(1, prev.session - 1) }))
          }>
            <FaArrowDown />
          </button>
          <div id="session-length" className="col-4">{settings.session}</div>
          <button id="session-increment" className="btn col-4" onClick={() =>
            setSettings(prev => ({ ...prev, session: Math.min(60, prev.session + 1) }))
          }>
            <FaArrowUp />
          </button>
        </div>
        <div 
          id="timer-container" 
          className="col-12 row" 
          style={{ backgroundColor: isSession ? '' : 'orange' }}
        >
          <div id="timer-label" className="col-12">{isSession ? "Session" : "Break"}</div>
          <div 
            id="time-left" 
            style={{ color: secondsLeft <= 60 ? 'red' : '#333' }}
          >
            {formatTime(secondsLeft)}
          </div>
        </div>
        <div id="control-center" className="row">
          <button id="start_stop" className="btn col-6" onClick={() => setIsRunning(prev => !prev)}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button id="reset" className="btn col-6" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
