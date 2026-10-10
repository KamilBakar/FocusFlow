/**
 * Todo.jsx
 * 
 * Task management page for FocusFlow.
 * Lets the user add, complete, edit and delete tasks.
 * All tasks are saved to localStorage so nothing is lost on refresh.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Todo() {

  // Load todos from localStorage on first render, default to empty array
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingId, setEditingId] = useState(null);
  const [editText,  setEditText  ] = useState("");
  const [input,     setInput     ] = useState("");

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput("");
  }

  // Toggle a todo between completed and not completed
  function toggleTodo(id) {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  // Save the edited text and exit edit mode
  function editTodo(id) {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
    setEditText("");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold">📝 Todo</h1>
        <p className="text-sm opacity-80">Manage your tasks efficiently</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow mt-8 w-full max-w-md flex flex-col gap-4">

        {/* Add task input — submits on Enter or clicking Add */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg transition"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {todos.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-4">
              No tasks yet — add one above!
            </p>
          )}
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              editingId={editingId}
              setEditingId={setEditingId}
              editText={editText}
              setEditText={setEditText}
              editTodo={editTodo}
            />
          ))}
        </div>

        <Link to="/" className="text-sm text-blue-500 hover:underline text-center mt-2">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}

// Renders a single todo item — shows an edit input or the task text depending on edit mode
function TodoItem({ todo, toggleTodo, deleteTodo, editingId, setEditingId, editText, setEditText, editTodo }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
      {editingId === todo.id ? (
        <>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && editTodo(todo.id)}
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
          />
          <button
            onClick={() => editTodo(todo.id)}
            className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition"
          >
            Save
          </button>
        </>
      ) : (
        <p className={`text-gray-800 ${todo.completed ? "line-through text-gray-400" : ""}`}>
          {todo.text}
        </p>
      )}

      <div className="flex gap-3 mt-3 text-sm">
        <button onClick={() => toggleTodo(todo.id)} className="text-green-500 hover:text-green-600 transition">
          {todo.completed ? "Undo" : "Done"}
        </button>
        <button onClick={() => { setEditingId(todo.id); setEditText(todo.text); }} className="text-blue-500 hover:text-blue-600 transition">
          Edit
        </button>
        <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-600 transition">
          Delete
        </button>
      </div>
    </div>
  );
}

export default Todo;