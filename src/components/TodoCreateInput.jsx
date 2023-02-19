import { arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { db } from '../firebase/firebase';
import { AuthContext } from '../hooks/auth';
import { v4 as uuidv4 } from 'uuid';
import { RiAddLine } from 'react-icons/ri';

function TodoCreateInput() {
  const { user, setIsCompleted, isEditing, setLoading } =
    useContext(AuthContext);
  const [inputValue, setInputValue] = useState('');
  const [isInputEmpty, setIsInputEmpty] = useState(false);

  const todoCreateHandler = async (e) => {
    e.preventDefault();
    try {
      if (inputValue.trim() !== '') {
        setLoading(true);
        await updateDoc(doc(db, 'userTodos', user.uid), {
          todos: arrayUnion({
            todo: inputValue,
            completed: false,
            id: uuidv4(),
            date: Timestamp.now(),
          }),
        });
        setIsInputEmpty(false);
        setInputValue('');
        setLoading(false);
      }
      if (inputValue.trim() === '') {
        setIsInputEmpty(true);
      }
    } catch (err) {
      setIsCompleted(false);
      console.log(err);
    }
  };

  return (
    <form>
      <label
        className={` ${
          isEditing ? 'pointer-events-none' : ''
        } flex items-center space-x-3 pb-2 relative`}
      >
        <input
          type="text"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          className="px-2 py-2 rounded-md outline-none w-[17rem] lg:w-[20rem] bg-[#EED6D3] focus:bg-blue-500 hover:cursor-pointer transition-all duration-300 font-semibold placeholder:text-black focus:text-white focus:placeholder:text-white"
          placeholder="Add todo"
        />
        {isInputEmpty && (
          <p className="absolute top-11 text-sm font-bold">
            Please fill the input before adding a todo
          </p>
        )}
        <button
          className="w-7 h-7 flex items-center justify-center cursor-pointer focus:outline-blue-500 bg-[#EED6D3] px-1.5 py-1.5 rounded-md text-black hover:bg-blue-500 hover:text-white transition-all duration-300"
          onClick={todoCreateHandler}
        >
          <RiAddLine />
        </button>
      </label>
    </form>
  );
}

export default TodoCreateInput;
