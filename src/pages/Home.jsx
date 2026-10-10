import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * shows array of 10 motivational strings inside the component. 
 *  which rotate in the hero section.
 */

export default function Home() {
  const quotes = [
    "Small steps every day lead to big results.",
    "Stay consistent, not perfect.",
    "Discipline beats motivation.",
    "Progress over perfection.",
    "Focus on what matters most.",
    "You are capable of more than you think.",
    "Start now, not later.",
    "Success is built daily.",
    "Your future self will thank you.",
    "Push yourself a little further today."
  ];

/**
 * index state initiates the state variable at 0, keeping track of which quote is being shown
 * visible state initiates the boolean state variable at true, 
 * used to create the fade transitions effect
 */

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

/**
 * changeQuote function, makes the current quote invisible, 
 * then changes to the next quote,
 * 400ms period to wait
 * then makes it visible
 */

  const changeQuote = (newIndex) => {
    setVisible(false);
    setTimeout(() => {
      setIndex(newIndex);
      setVisible(true);
    }, 400);
  };

/**
 * runs when the component loads
 * creates a setinterval that changes the quote every 4000ms
 * uses modulo to loopback to the first quote once the last one is reached
 * the interval is cleared when the component unmounts avoiding memory leaks
 */

  useEffect(() => {
    const interval = setInterval(() => {
      changeQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  /**
   * handleNext function calls changeQuote and calculates the next quote index
   * triggered when the Next Quote button is clicked
   */

  const handleNext = () => {
    changeQuote((index + 1) % quotes.length);
  };

 /**
  *  
  */ 
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center">

      {/* Hero — gradient header shared across all pages for visual consistency.
          If the logo file is missing the onError fallback stops a broken
          image icon from appearing during development */}
      <div className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-12 flex flex-col items-center">
        <img
          src="/focusflow/logo.png"
          alt="App Logo"
          className="w-16 h-16 mb-3"
          onError={(e) => { e.target.src = "https://placehold.co/64"; }}
        />
        <h1 className="text-3xl font-bold">FocusFlow</h1>
        <p className="text-sm opacity-80 mb-6">Your personal productivity hub</p>

        {/* Quote display — opacity is driven by the visible state rather than
            conditionally rendering the element, so the CSS transition has
            something to animate between rather than an instant mount/unmount */}
        <div className="rounded-2xl px-8 py-6 max-w-lg w-full mx-4 flex flex-col items-center gap-4">
          <p className="text-xs font-bold opacity-90 tracking-widest uppercase text-white">
            {index + 1} / {quotes.length}
          </p>
          <p
            className="italic text-center text-xl font-bold leading-relaxed text-white drop-shadow"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.4s ease-in-out"
            }}
          >
            "{quotes[index]}"
          </p>
          <button
            onClick={handleNext}
            aria-label="Show next quote"
            className="mt-1 px-4 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-40 rounded-full text-sm font-semibold text-purple-200 transition"
          >
            Next Quote →
          </button>
        </div>
      </div>

      {/* Feature cards — one per main page. Using React Router's Link keeps
          navigation client-side so the app doesn't do a full page reload */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl p-6">
        <Link to="/todo" aria-label="Go to Todo list" className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="font-semibold mb-2">📝 Todo</h2>
          <p className="text-gray-500 text-sm">Manage your tasks efficiently</p>
        </Link>

        <Link to="/journal" aria-label="Go to Journal" className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="font-semibold mb-2">📖 Journal</h2>
          <p className="text-gray-500 text-sm">Reflect on your progress</p>
        </Link>

        <Link to="/Timer" aria-label="Go to Timer" className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="font-semibold mb-2">⏱️ Timer</h2>
          <p className="text-gray-500 text-sm">Stay focused with Pomodoro</p>
        </Link>
      </div>

    </main>
  );
}