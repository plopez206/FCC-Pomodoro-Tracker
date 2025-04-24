// src/App.tsx
import { useEffect, useState, useRef } from 'react';
import './App.css';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaAngleDoubleUp, 
  FaAngleDoubleDown 
} from 'react-icons/fa6';
import 'bootstrap/dist/css/bootstrap.min.css';
import beepSound from './assets/nokia_alarma.mp3';

function App() {
  const [settings, setSettings] = useState({
    session: 25,
    breakTime: 5,
  });
  const [secondsLeft, setSecondsLeft] = useState(settings.session * 60);
  const [isSession, setIsSession] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const beepAudio = useRef(new Audio(beepSound));
  const intervalRef = useRef<number | null>(null);
  const isSessionRef = useRef(isSession);

  // Mantener referencia actualizada de isSession dentro del intervalo
  useEffect(() => {
    isSessionRef.current = isSession;
  }, [isSession]);

  const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Lógica del timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (prev === 0) {
            beepAudio.current.play();
            const nextSession = !isSessionRef.current;
            setIsSession(nextSession);
            return nextSession
              ? settings.session * 60
              : settings.breakTime * 60;
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
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, settings]);

  // Actualiza contador al cambiar sesión/descanso
  useEffect(() => {
    setSecondsLeft(
      isSession
        ? settings.session * 60
        : settings.breakTime * 60
    );
  }, [settings, isSession]);

  const handleSkip = () => {
    beepAudio.current.play();
    const next = !isSession;
    setIsSession(next);
    setSecondsLeft(
      next
        ? settings.session * 60
        : settings.breakTime * 60
    );
  };

  return (
    <div id="app-container">
      <div id="clock-container">
        <h1>Pomodoro Clock</h1>

        {/* Break controls (sin cambios) */}
        <div id="break-container">
          <div id="break-label">Break Length</div>
          <div className="controls">
            <button
              id="break-decrement"
              onClick={() =>
                setSettings(prev => ({
                  ...prev,
                  breakTime: Math.max(1, prev.breakTime - 1),
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
                  breakTime: Math.min(60, prev.breakTime + 1),
                }))
              }
            >
              <FaArrowUp />
            </button>
          </div>
        </div>

        {/* Session controls con +1, -1, +5 y -5 */}
        <div id="session-container">
          <div id="session-label">Session Length</div>
          <div className="controls">
            {/* –5 minutos */}
            <button
              id="session-decrement-5"
              onClick={() =>
                setSettings(prev => ({
                  ...prev,
                  session: Math.max(1, prev.session - 5),
                }))
              }
            >
              <FaAngleDoubleDown />
            </button>
            {/* –1 minuto */}
            <button
              id="session-decrement"
              onClick={() =>
                setSettings(prev => ({
                  ...prev,
                  session: Math.max(1, prev.session - 1),
                }))
              }
            >
              <FaArrowDown />
            </button>

            <div id="session-length">{settings.session}</div>

            {/* +1 minuto (sin límite superior) */}
            <button
              id="session-increment"
              onClick={() =>
                setSettings(prev => ({
                  ...prev,
                  session: prev.session + 1,
                }))
              }
            >
              <FaArrowUp />
            </button>
            {/* +5 minutos */}
            <button
              id="session-increment-5"
              onClick={() =>
                setSettings(prev => ({
                  ...prev,
                  session: prev.session + 5,
                }))
              }
            >
              <FaAngleDoubleUp />
            </button>
          </div>
        </div>

        {/* Display del temporizador */}
        <div
          id="timer-container"
          style={{
            backgroundColor: isSession ? '#4DA8DA' : '#1ABC9C',
            border: `5px solid ${isRunning ? 'rgb(28,146,63)' : 'red'}`,
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div id="timer-label">
            {isSession ? 'Session' : 'Break'}
          </div>
          <div id="time-left">
            {formatTime(secondsLeft)}
          </div>
        </div>

        {/* Botones de control */}
        <div id="control-center">
          <button
            id="start_stop"
            className="start-btn"
            onClick={() =>
              setIsRunning(prev => !prev)
            }
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            id="skip"
            className="skip-btn"
            onClick={handleSkip}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
