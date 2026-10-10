/**  Navbar — shown on every page, sits above all routes in App.jsx
 */

import { Link } from "react-router-dom";

// Link is used instead of <a> tags to navigate without a full page reload
function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-center gap-6">
      <Link to="/">Home</Link>
      <Link to="/todo">Todo</Link>
      <Link to="/journal">Journal</Link>
      <Link to="/timer">Timer</Link>
    </nav>
  );
}

export default Navbar;