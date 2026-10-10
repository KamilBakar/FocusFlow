/**
 * Timer.jsx
 *
 * Pomodoro timer page for the FocusFlow app.
 * uses the Pomodoro technique — 25 minute work sessions separated
 * by short breaks, with a long break after every 4 completed sessions.
 * The timer advances to the next mode when a session ends.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const MODES = {
  work:       { label: 'Work Session', defaultSeconds: 25 * 60, color: 'from-blue-500 to-purple-500', stroke: '#6366f1' },
  shortBreak: { label: 'Short Break',  defaultSeconds:  5 * 60, color: 'from-green-400 to-teal-500',  stroke: '#10b981' },
  longBreak:  { label: 'Long Break',   defaultSeconds: 15 * 60, color: 'from-orange-400 to-pink-500', stroke: '#f97316' },
};

function Timer() {

  const [mode,       setMode      ] = useState('work');
  const [seconds,    setSeconds   ] = useState(MODES.work.defaultSeconds);
  const [started,    setStarted   ] = useState(false);
  const [sessions,   setSessions  ] = useState(0);
  const [customMins, setCustomMins] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  // Refs mirror state so interval callbacks always read the latest values
  const totalSeconds = useRef(MODES.work.defaultSeconds);
  const sessionsRef  = useRef(0);
  const modeRef      = useRef('work');

  useEffect(() => { sessionsRef.current = sessions; }, [sessions]);
  useEffect(() => { modeRef.current     = mode;     }, [mode]);

  // Reset the timer when the mode changes
  useEffect(() => {
    setStarted(false);
    const secs = MODES[mode].defaultSeconds;
    setSeconds(secs);
    totalSeconds.current = secs;
    setShowCustom(false);
    setCustomMins('');
  }, [mode]);

  // Move to the next mode when a session ends — every 4 work sessions triggers a long break
  const handleSessionEnd = useCallback(() => {
    setStarted(false);
    if (modeRef.current === 'work') {
      const newCount = sessionsRef.current + 1;
      setSessions(newCount);
      sessionsRef.current = newCount;
      setMode(newCount % 4 === 0 ? 'longBreak' : 'shortBreak');
    } else {
      setMode('work');
    }
  }, []);

  // Tick down every second while the timer is running
  useEffect(() => {
    if (!started) return;

    const interval = setInterval(function() {
      setSeconds(function(seconds) {
        if (seconds <= 0) {
          clearInterval(interval);
          setTimeout(handleSessionEnd, 0);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return function() { clearInterval(interval); };
  }, [started, handleSessionEnd]);

  const handleStartPause = () => setStarted(!started);

  const handleReset = () => {
    setStarted(false);
    setSeconds(totalSeconds.current);
  };

  // Validate and apply a custom duration (1–120 minutes)
  const handleCustomTime = () => {
    const mins = parseInt(customMins, 10);
    if (!mins || mins <= 0 || mins > 120) return;
    const secs = mins * 60;
    setStarted(false);
    setSeconds(secs);
    totalSeconds.current = secs;
    setShowCustom(false);
    setCustomMins('');
  };

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  const completedInCycle = sessions % 4;

  // Circular progress ring calculations
  const radius        = 90;
  const circumference = 2 * Math.PI * radius;
  const progress      = seconds / totalSeconds.current;
  const dashOffset    = circumference * (1 - progress);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center">

      {/* Header — gradient changes colour based on current mode */}
      <div className={`w-full bg-gradient-to-r ${MODES[mode].color} text-white py-10 flex flex-col items-center transition-all duration-500`}>
        <h1 className="text-3xl font-bold">⏱️ Timer</h1>
        <p className="text-sm opacity-80">Stay focused with Pomodoro</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow mt-8 w-full max-w-sm flex flex-col items-center gap-6">

        {/* Mode tabs */}
        <div className="flex gap-2 w-full">
          {Object.entries(MODES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition ${
                mode === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Circular progress ring — shrinks as time counts down */}
        <div className="relative flex items-center justify-center">
          <svg width="220" height="220" className="-rotate-90" aria-hidden="true">
            <circle cx="110" cy="110" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="110" cy="110" r={radius}
              fill="none"
              stroke={MODES[mode].stroke}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <p className="text-5xl font-bold text-gray-700 tracking-widest">{mins}:{secs}</p>
            <p className="text-xs text-gray-400 mt-1">{MODES[mode].label}</p>
          </div>
        </div>

        {seconds === 0 && (
          <p className="text-red-500 font-semibold text-sm">
            {mode === 'work' ? "Work session done! 🎉" : "Break over — back to work!"}
          </p>
        )}

        {/* Custom time input — hidden until toggled */}
        <div className="w-full flex flex-col gap-2">
          <button
            onClick={() => setShowCustom((prev) => !prev)}
            className="text-xs text-blue-500 hover:underline text-center"
          >
            {showCustom ? 'Cancel custom time' : '+ Set custom time (minutes)'}
          </button>

          {showCustom && (
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="120"
                placeholder="e.g. 45"
                value={customMins}
                onChange={(e) => setCustomMins(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomTime()}
                className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleCustomTime}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-lg text-sm transition"
              >
                Set
              </button>
            </div>
          )}
        </div>

        {/* Four dots showing progress through the current cycle of 4 sessions */}
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition ${
                i < completedInCycle ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-gray-400 -mt-4">
          {completedInCycle}/4 sessions — {sessions} total completed
        </p>

        <div className="flex gap-4">
          <button
            onClick={handleStartPause}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg w-24 transition"
          >
            {started ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg w-24 transition"
          >
            Reset
          </button>
        </div>

        <Link to="/" className="text-sm text-blue-500 hover:underline mt-2">
          ← Back to Home
        </Link>

      </div>
    </main>
  );
}

export default Timer;