import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useContext } from 'react';
import { auth, db } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../hooks/auth';

function Register() {
  const navigate = useNavigate();
  const { setLoading, error, setError } = useContext(AuthContext);

  const validateHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, {
        displayName: name,
      });
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        displayName: name,
        email,
      });
      await setDoc(doc(db, 'userTodos', res.user.uid), {});
      setLoading(false);
      setError(null);
      navigate('/');
    } catch (err) {
      setLoading(false);
      setError(err.code);
    }

    console.log(name, email, password);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        className="flex flex-col items-center justify-around shadow-xl rounded-md w-[20rem] h-[21rem] text-sm font-bold"
        onSubmit={validateHandler}
      >
        {error && (
          <p className="bg-red-700 text-white text-sm px-1.5 py-1.5 rounded-md">
            {error}!
          </p>
        )}
        <label>
          <p className="pb-1">Display name</p>
          <input
            type="text"
            maxLength={20}
            required
            className="outline-none w-[14.5rem] rounded-md px-2 py-2 transition-all duration-300  focus:bg-blue-500 focus:text-white"
          />
        </label>
        <label>
          <p className="pb-1">Email</p>
          <input
            type="email"
            required
            className="outline-none w-[14.5rem] rounded-md px-2 py-2 transition-all duration-300  focus:bg-blue-500 focus:text-white"
          />
        </label>
        <label>
          <p className="pb-1">Password</p>
          <input
            type="password"
            minLength={6}
            required
            className="outline-none w-[14.5rem] rounded-md px-2 py-2 transition-all duration-300  focus:bg-blue-500 focus:text-white"
          />
        </label>
        <button
          type="submit"
          className="px-2 py-2 bg-transparent border hover:border-black hover:bg-blue-500 hover:text-white rounded-full tracking-wide transition-all duration-300"
        >
          REGISTER
        </button>
      </form>
    </div>
  );
}

export default Register;
