import React, { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { MdLibraryAdd } from "react-icons/md";
import { RiTodoFill } from "react-icons/ri";
import { IoSave } from "react-icons/io5";
import bg from "../images.jpeg";
import {
  useTodos,
  useAddTodo,
  useToggleTodo,
  useDeleteTodo,
  useUpdateTodo,
} from "../store/store";
import { toast } from "react-toastify";

const Todo = () => {
  const { data: todos = [], isLoading, error } = useTodos();
  const addTodoMutation = useAddTodo();
  const toggleTodoMutation = useToggleTodo();
  const deleteTodoMutation = useDeleteTodo();
  const updateTodoMutation = useUpdateTodo();

  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState("");

  const handleAddTodo = () => {
    if (newTodo.trim() === "") toast.warning("Please add a Todo");
    else {
      addTodoMutation.mutate(newTodo);
      setNewTodo("");
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo.id);
    setEditingText(todo.title);
  };

  const handleUpdateTodo = () => {
    if (editingText.trim() === "") return;

    updateTodoMutation.mutate({ id: editingTodo, updatedTitle: editingText });
    setEditingTodo(null);
    setEditingText("");
  };
  if (isLoading)
    return <h1 className="text-center text-primary">Loading...</h1>;
  if (error)
    return <h1 className="text-center text-danger">Something went wrong!</h1>;
  return (
    <div className="">
      <div
        className="p-2 bg-dark text-white"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <h2 className="text-center text-light fs-1 mb-4 ">
          <RiTodoFill /> Todo List
        </h2>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control bg-white text-black border-0"
            placeholder="Add a new todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            onClick={handleAddTodo}
            className="btn btn-primary d-flex align-items-center fs-3"
          >
            <MdLibraryAdd />
          </button>
        </div>
        <ul className="list-group fs-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="list-group-item d-flex justify-content-between align-items-center bg-transparent text-white border-0"
            >
              <div className="d-flex align-items-center w-75">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoMutation.mutate(todo.id)}
                  className="form-check-input me-2"
                />
                {editingTodo === todo.id ? (
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-0"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <span
                    className={`ms-2 ${
                      todo.completed
                        ? "text-decoration-line-through fw-bold text-light"
                        : "text-light"
                    }`}
                  >
                    {todo.title}
                  </span>
                )}
              </div>
              <div>
                {editingTodo === todo.id ? (
                  <button
                    onClick={handleUpdateTodo}
                    className="btn btn-success btn-sm fs-4"
                  >
                    <IoSave />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditTodo(todo)}
                    className="btn btn-warning btn-sm fs-4"
                  >
                    <FiEdit />
                  </button>
                )}
                <button
                  onClick={() => deleteTodoMutation.mutate(todo.id)}
                  className="btn btn-danger btn-sm fs-4"
                >
                  <AiFillDelete />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
