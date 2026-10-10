/*
 * App.jsx
 *
 * Main component for the FocusFlow app.
 *
 * Responsibilities:
 * - Displays the Navbar on all pages
 * - Sets up page routing using React Router
 * - Connects URL paths to page components
 */

import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Todo from "./pages/Todo";
import Journal from "./pages/Journal";
import Timer from "./pages/Timer";

/**
 * App component — renders the Navbar and route definitions.
 * Wrapped in a Fragment (<>) since JSX requires a single root element
 * but we don't want an unnecessary DOM node.
 *
 * @returns {JSX.Element} The root layout of the application
 */
function App() {
  return (
    <>
      {/* Shared navigation bar rendered on every page */}
      <Navbar />

      {/* Route definitions — each path renders its page component */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/Timer" element={<Timer/>} />
      </Routes>
    </>
  );
}

export default App;