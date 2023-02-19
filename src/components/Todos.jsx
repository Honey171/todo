import {
  arrayRemove,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { AuthContext } from '../hooks/auth';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';

function Todos() {
  const { user, isEditing, setIsEditing } = useContext(AuthContext);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [prevValue, setPrevValue] = useState(null);
  const [todos, setTodos] = useState([]);
  const [finishedTodos, setFinishedTodos] = useState([]);
  const [ongoingTodos, setOngoingTodos] = useState([]);
  const [filteredFinished, setFilteredFinished] = useState(false);
  const [filteredOngoing, setFilteredOngoing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  let times = [];
  let currentTime = new Date().toLocaleString();
  const count = todos?.filter((todo) => !todo.completed).length;

  for (let x = 0; x < todos?.length; x++) {
    times.push(
      new Date(
        todos[x].date.seconds * 1000 + todos[x].date.nanoseconds / 1000000,
      ).toLocaleString(),
    );
  }

  useEffect(() => {
    if (user && todos !== undefined) {
      setFinishedTodos(todos.filter((todo) => todo.completed));
      setOngoingTodos(todos.filter((todo) => !todo.completed));
    }
  }, [todos, user]);

  useEffect(() => {
    if (user) {
      const todosDataHandler = async () => {
        try {
          onSnapshot(doc(db, 'userTodos', user.uid), (doc) => {
            doc.exists() && setTodos(doc.data().todos);
          });
        } catch (err) {
          console.log(err);
        }
      };

      todosDataHandler();
    }
  }, [user?.uid, user]);

  const updateTodoItemValue = async (itemId, updatedValue) => {
    const todosRef = doc(db, 'userTodos', user.uid);
    const snapshot = await getDoc(todosRef);
    const todos = snapshot.data().todos;

    const updatedTodos = todos.map((todo) => {
      if (todo.id === itemId) {
        return {
          ...todo,
          todo: updatedValue,
          completed: false,
        };
      } else {
        return todo;
      }
    });

    try {
      await updateDoc(todosRef, {
        todos: updatedTodos,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateTodoItemComplete = async (itemId, completed) => {
    const todosRef = doc(db, 'userTodos', user.uid);
    const snapshot = await getDoc(todosRef);
    const todos = snapshot.data().todos;

    const updatedTodos = todos.map((todo) => {
      if (todo.id === itemId) {
        return {
          ...todo,
          completed: !completed,
        };
      } else {
        return todo;
      }
    });

    try {
      await updateDoc(todosRef, {
        todos: updatedTodos,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updateTodoItemDelete = async (itemId, index) => {
    const todosRef = doc(db, 'userTodos', user.uid);
    const snapshot = await getDoc(todosRef);
    const todos = snapshot.data().todos;

    try {
      await updateDoc(todosRef, {
        todos: arrayRemove(todos[index]),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section
      className={`relative space-y-2 px-6 flex flex-col h-[60%] pt-5 ${
        isEditing ? 'scrollbar-none overflow-hidden' : 'scrollbar overflow-auto'
      } scroll-smooth scrollbar-rounded scrollbar-thumb-blue-500 scrollbar-track-[#E8B4B8]
`}
    >
      {todos !== [] && (
        <div className="space-y-3">
          <p className="top-0 font-semibold">
            You have{' '}
            <span className="font-extrabold">
              {count !== undefined ? count : '0'}
            </span>{' '}
            ongoing todos
          </p>
          <div className="flex justify-between font-extrabold">
            <span
              onClick={() => {
                setFilteredFinished(false);
                setFilteredOngoing(false);
              }}
              className={`${
                !filteredFinished && !filteredOngoing
                  ? 'text-blue-500 underline underline-offset-4 decoration-black'
                  : 'text-black no-underline'
              } transition-all duration-300 cursor-pointer hover:text-blue-500`}
            >
              All
            </span>
            <span
              onClick={() => {
                setFilteredFinished(true);
                setFilteredOngoing(false);
              }}
              className={`${
                filteredFinished && !filteredOngoing
                  ? 'text-blue-500 underline underline-offset-4 decoration-black'
                  : 'text-black no-underline'
              } transition-all duration-300 cursor-pointer hover:text-blue-500`}
            >
              Finished
            </span>
            <span
              onClick={() => {
                setFilteredFinished(false);
                setFilteredOngoing(true);
              }}
              className={`${
                !filteredFinished && filteredOngoing
                  ? 'text-blue-500 underline underline-offset-4 decoration-black'
                  : 'text-black no-underline'
              } transition-all duration-300 cursor-pointer hover:text-blue-500`}
            >
              Ongoing
            </span>
          </div>
        </div>
      )}
      {isEditing && (
        <div className="fixed z-50 top-[50%] flex flex-col items-center gap-5 bg-blue-500 py-3 rounded-md w-[18.75rem] lg:w-[20rem]">
          <div>
            <p className="max-w-[250px] break-words font-semibold">
              You're editing{' '}
              <span className="text-gray-200 font-extrabold">
                {prevValue.charAt(0).toUpperCase() +
                  prevValue.slice(1).toLowerCase()}
              </span>
            </p>
            <button
              onClick={() => {
                setIsEditing(false);
                setIsEmpty(false);
                setEditingValue('');
              }}
              className="absolute right-2 top-2 bg-white hover:bg-black hover:text-white transition-all duration-300 px-0.5 py-0.5 rounded-full text-lg"
            >
              <IoMdClose />
            </button>
          </div>
          <div className="flex flex-col space-y-1 items-center">
            <div className="space-x-3">
              <input
                type="text"
                className="px-1 py-1 rounded-md outline-none bg-[#EED6D3] focus:shadow-xl hover:cursor-pointer transition-all duration-300 placeholder:text-black focus:text-black font-semibold"
                placeholder="Write new todo"
                onChange={(e) => setEditingValue(e.target.value)}
              />
              <button
                onClick={() => {
                  if (editingValue.trim() !== '') {
                    setIsEmpty(false);
                    setIsEditing(false);
                    updateTodoItemValue(editingTodo, editingValue);
                  }
                  if (editingValue.trim() === '') {
                    setIsEmpty(true);
                  }
                }}
                className="bg-white px-1.5 py-1.5 text-lg rounded-full hover:bg-black hover:text-white transition-all duration-300"
              >
                <HiOutlineSwitchHorizontal />
              </button>
            </div>

            <p
              className={`${
                isEmpty ? 'block' : 'hidden'
              } text-black font-extrabold`}
            >
              You can't change with an empty todo
            </p>
          </div>
        </div>
      )}
      {filteredOngoing &&
        ongoingTodos &&
        ongoingTodos.map((todo, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center gap-5 px-2.5 py-2.5 bg-[#E8B4B8] shadow-xl text-black rounded-md ${
              isEditing ? 'pointer-events-none brightness-50' : ''
            } w-[18.75rem] lg:w-[20rem]`}
          >
            <div className="flex flex-col space-y-2 items-center justify-center">
              <input
                type="checkbox"
                checked={todo.completed}
                className="w-4 h-4 focus:outline-blue-500"
                onChange={() => updateTodoItemComplete(todo.id, todo.completed)}
              />
              <p
                className={`${
                  todo.completed
                    ? 'line-through decoration-white text-blue-500'
                    : ''
                } break-words max-w-[200px] font-extrabold transition-all duration-500`}
              >
                {todo.todo.charAt(0).toUpperCase() +
                  todo.todo.slice(1).toLowerCase()}
              </p>
              <p className="font-medium text-sm">Created at: {times[idx]}</p>
              <p
                className={`font-medium text-sm ${
                  todo.completed ? 'block' : 'hidden'
                }`}
              >
                Completed at: {currentTime}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setPrevValue(todo.todo);
                  setIsEditing(true);
                  setEditingTodo(todo.id);
                }}
                className="bg-[#EED6D3] focus:outline-blue-500 px-1.5 py-1.5 rounded-md text-black hover:text-[#EED6D3] hover:bg-black transition-all duration-300"
              >
                <AiFillEdit />
              </button>
              <button
                onClick={() => updateTodoItemDelete(todo.id, idx)}
                className="bg-[#EED6D3] focus:outline-blue-500 px-1.5 py-1.5 rounded-md text-black hover:text-[#EED6D3] hover:bg-black transition-all duration-300"
              >
                <MdDelete />
              </button>
              <p className="font-extrabold">
                Status:{' '}
                <span
                  className={`${
                    todo.completed
                      ? 'text-blue-500'
                      : 'text-red-500 transition-all duration-300'
                  }`}
                >{`${todo.completed ? 'finished' : 'ongoing'}`}</span>
              </p>
            </div>
          </div>
        ))}
      {filteredFinished &&
        finishedTodos &&
        finishedTodos.map((todo, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center gap-5 px-2.5 py-2.5 bg-[#E8B4B8] shadow-xl text-black rounded-md ${
              isEditing ? 'pointer-events-none brightness-50' : ''
            } w-[18.75rem] lg:w-[20rem]`}
          >
            <div className="flex flex-col space-y-2 items-center justify-center">
              <input
                type="checkbox"
                checked={todo.completed}
                className="w-4 h-4 focus:outline-blue-500"
                onChange={() => updateTodoItemComplete(todo.id, todo.completed)}
              />
              <p
                className={`${
                  todo.completed
                    ? 'line-through decoration-white text-blue-500'
                    : ''
                } break-words max-w-[200px] font-extrabold transition-all duration-500`}
              >
                {todo.todo.charAt(0).toUpperCase() +
                  todo.todo.slice(1).toLowerCase()}
              </p>
              <p className="font-medium text-sm">Created at: {times[idx]}</p>
              <p
                className={`font-medium text-sm ${
                  todo.completed ? 'block' : 'hidden'
                }`}
              >
                Completed at: {currentTime}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setPrevValue(todo.todo);
                  setIsEditing(true);
                  setEditingTodo(todo.id);
                }}
                className="bg-[#EED6D3] focus:outline-blue-500 px-1.5 py-1.5 rounded-md text-black hover:text-[#EED6D3] hover:bg-black transition-all duration-300"
              >
                <AiFillEdit />
              </button>
              <button
                onClick={() => updateTodoItemDelete(todo.id, idx)}
                className="bg-[#EED6D3] focus:outline-blue-500 px-1.5 py-1.5 rounded-md text-black hover:text-[#EED6D3] hover:bg-black transition-all duration-300"
              >
                <MdDelete />
              </button>
              <p className="font-extrabold">
                Status:{' '}
                <span
                  className={`${
                    todo.completed
                      ? 'text-blue-500'
                      : 'text-red-500 transition-all duration-300'
                  }`}
                >{`${todo.completed ? 'finished' : 'ongoing'}`}</span>
              </p>
            </div>
          </div>
        ))}
      {!filteredOngoing &&
        !filteredFinished &&
        todos &&
        todos.map((todo, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center gap-5 px-2.5 py-2.5 bg-[#E8B4B8] shadow-xl text-black rounded-md ${
              isEditing ? 'pointer-events-none brightness-50' : ''
            } w-[18.75rem] lg:w-[20rem]`}
          >
            <div className="flex flex-col space-y-2 items-center justify-center">
              <input
                type="checkbox"
                checked={todo.completed}
                className="w-4 h-4 focus:outline-blue-500"
                onChange={() => updateTodoItemComplete(todo.id, todo.completed)}
              />
              <p
                className={`${
                  todo.completed
                    ? 'line-through decoration-white text-blue-500'
                    : ''
                } break-words max-w-[200px] font-extrabold transition-all duration-500`}
              >
                {todo.todo.charAt(0).toUpperCase() +
                  todo.todo.slice(1).toLowerCase()}
              </p>
              <p className="font-medium text-sm">Created at: {times[idx]}</p>
              <p
                className={`font-medium text-sm ${
                  todo.completed ? 'block' : 'hidden'
                }`}
              >
                Completed at: {currentTime}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setPrevValue(todo.todo);
                  setIsEditing(true);
                  setEditingTodo(todo.id);
                }}
                className="bg-[#EED6D3] focus:outline-blue-500 px-1.5 py-1.5 rounded-md text-black hover:text-[#EED6D3] hover:bg-black transition-all duration-300"
              >
                <AiFillEdit />
              </button>
              <button
                onClick={() => updateTodoItemDelete(todo.id, idx)}
                className="bg-[#EED6D3] focus:outline-blue-500 px-1.5 py-1.5 rounded-md text-black hover:text-[#EED6D3] hover:bg-black transition-all duration-300"
              >
                <MdDelete />
              </button>
              <p className="font-extrabold">
                Status:{' '}
                <span
                  className={`${
                    todo.completed
                      ? 'text-blue-500'
                      : 'text-red-500 transition-all duration-300'
                  }`}
                >{`${todo.completed ? 'finished' : 'ongoing'}`}</span>
              </p>
            </div>
          </div>
        ))}
    </section>
  );
}

export default Todos;
