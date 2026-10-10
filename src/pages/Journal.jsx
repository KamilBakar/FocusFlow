
/**  Journal page for the FocusFlow app.
 Lets users create, edit, and delete journal entries.
 Entries are stored in localStorage so they stay saved after refreshing.
*/

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Journal() {

  /** entries:
  * responsible for Storing all journal entries.
  * When the page first loads, it checks localStorage for saved entries.
  * If none exist yet, it starts with an empty array.
  */
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("journal");
    return saved ? JSON.parse(saved) : [];
  });

  
  // input: Stores the text currently being typed into the "New Entry" textarea.
  const [input, setInput] = useState("");

  /**
  * editingId:
  * Stores the ID of the entry currently being edited.
  * If null, no entry is being edited.
   */
 
  const [editingId, setEditingId] = useState(null);

  // editText:
  // Stores the updated text while editing an existing entry.
  const [editText, setEditText] = useState("");

  // Save entries to localStorage every time the entries array changes.
  // This keeps journal data saved even after refreshing the browser.
  useEffect(() => {
    localStorage.setItem("journal", JSON.stringify(entries));
  }, [entries]);

  // addEntry:
  // Creates a new journal entry and adds it to the top of the list.
  // Prevents empty entries from being added.
  function addEntry() {
    if (!input.trim()) return;

    setEntries([
      {
        id: Date.now(), // unique ID using current timestamp
        text: input,
        date: new Date().toLocaleString(), // current date and time
      },
      ...entries,
    ]);

    // Clear the textarea after adding the entry
    setInput("");
  }

  // deleteEntry:
  // Removes an entry from the journal using its ID.
  function deleteEntry(id) {
    setEntries(entries.filter((entry) => entry.id !== id));
  }

  // editEntry:
  // Updates the text of an existing journal entry.
  // After saving, edit mode is turned off.
  function editEntry(id) {
    setEntries(
      entries.map((entry) =>
        entry.id === id
          ? { ...entry, text: editText }
          : entry
      )
    );

    // Exit edit mode
    setEditingId(null);

    // Clear edit input
    setEditText("");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center">

      {/* Page header section */}
      <div className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-10 flex flex-col items-center">

        {/* Main page title */}
        <h1 className="text-3xl font-bold">📖 Journal</h1>

        {/* Small subtitle below the title */}
        <p className="text-sm opacity-80">
          Reflect on your progress
        </p>
      </div>

      {/* Main journal card container */}
      <div className="bg-white p-8 rounded-2xl shadow mt-8 w-full max-w-md flex flex-col gap-4">

        {/* New journal entry section */}
        <div className="flex flex-col gap-2">

          {/* Label for accessibility */}
          <label
            htmlFor="journal-input"
            className="text-sm font-semibold text-gray-600"
          >
            New Entry
          </label>

          {/* Textarea where the user writes a new entry */}
          <textarea
            id="journal-input"
            placeholder="Write your thoughts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}

            // Pressing Enter submits the entry.
            // Shift + Enter creates a new line instead.
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), addEntry())
            }

            rows={4}
            aria-label="Write a new journal entry"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm"
          />

          {/* Button to add the new entry */}
          <button
            onClick={addEntry}
            aria-label="Add journal entry"
            className="self-end bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition text-sm"
          >
            Add Entry
          </button>
        </div>

        {/* Journal entries list */}
        {/* overflow-y-auto allows scrolling if many entries exist */}
        <div
          className="overflow-y-auto max-h-96 space-y-3 pr-1"
          aria-label="Journal entries timeline"
          role="feed"
        >

          {/* Message shown if there are no entries */}
          {entries.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-4">
              No entries yet — write your first thought above!
            </p>
          )}

          {/* Loop through every journal entry */}
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-50 p-4 rounded-xl border border-gray-100"
              aria-label={`Journal entry from ${entry.date}`}
            >

              {/* Date and time of the entry */}
              <p className="text-xs text-gray-400 mb-2">
                {entry.date}
              </p>

              {/* If this entry is being edited, show edit mode */}
              {editingId === entry.id ? (
                <>
                  {/* Edit label */}
                  <label
                    htmlFor={`edit-${entry.id}`}
                    className="text-xs text-gray-500 mb-1 block"
                  >
                    Edit entry
                  </label>

                  {/* Textarea for editing the entry */}
                  <textarea
                    id={`edit-${entry.id}`}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}

                    // Enter saves changes
                    // Shift + Enter adds a new line
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      (e.preventDefault(), editEntry(entry.id))
                    }

                    rows={3}
                    aria-label="Edit journal entry"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2 resize-none text-sm"
                  />

                  {/* Save button */}
                  <button
                    onClick={() => editEntry(entry.id)}
                    aria-label="Save edited entry"
                    className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition"
                  >
                    Save
                  </button>
                </>
              ) : (

                // Normal view mode
                // whitespace-pre-wrap keeps line breaks entered by the user
                <p className="text-gray-800 text-sm whitespace-pre-wrap">
                  {entry.text}
                </p>
              )}

              {/* Action buttons for each entry */}
              <div className="flex gap-3 mt-3 text-sm">

                {/* Edit button */}
                <button
                  onClick={() => {
                    setEditingId(entry.id);
                    setEditText(entry.text);
                  }}
                  aria-label="Edit this entry"
                  className="text-blue-500 hover:text-blue-600 transition"
                >
                  Edit
                </button>

                {/* Delete button */}
                <button
                  onClick={() => deleteEntry(entry.id)}
                  aria-label="Delete this entry"
                  className="text-red-500 hover:text-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Link back to the homepage */}
        <Link
          to="/"
          className="text-sm text-blue-500 hover:underline text-center mt-2"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}

export default Journal;